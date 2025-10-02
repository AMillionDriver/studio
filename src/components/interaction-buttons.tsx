
'use client';

import { useOptimistic, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';
import { voteOnAnime } from '@/lib/anime.actions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

interface InteractionButtonsProps {
  animeId: string;
  initialLikes: number;
  initialDislikes: number;
  initialViews: number;
  initialUserVote: 'like' | 'dislike' | null;
}

type OptimisticVote = {
  likes: number;
  dislikes: number;
  currentUserVote: 'like' | 'dislike' | null;
};

export function InteractionButtons({
  animeId,
  initialLikes,
  initialDislikes,
  initialViews,
  initialUserVote,
}: InteractionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth(); // Use client-side auth context which has the full User object

  const [optimisticVote, setOptimisticVote] = useOptimistic<OptimisticVote, 'like' | 'dislike'>(
    {
      likes: initialLikes,
      dislikes: initialDislikes,
      currentUserVote: initialUserVote,
    },
    (state, action) => {
      if (action === 'like') {
        if (state.currentUserVote === 'like') {
          // Undo like
          return {
            likes: state.likes - 1,
            dislikes: state.dislikes,
            currentUserVote: null,
          };
        }
        // New like or changing from dislike
        return {
          likes: state.likes + 1,
          dislikes: state.currentUserVote === 'dislike' ? state.dislikes - 1 : state.dislikes,
          currentUserVote: 'like',
        };
      }
      if (action === 'dislike') {
        if (state.currentUserVote === 'dislike') {
          // Undo dislike
          return {
            likes: state.likes,
            dislikes: state.dislikes - 1,
            currentUserVote: null,
          };
        }
        // New dislike or changing from like
        return {
          likes: state.currentUserVote === 'like' ? state.likes - 1 : state.likes,
          dislikes: state.dislikes + 1,
          currentUserVote: 'dislike',
        };
      }
      return state;
    }
  );

  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (!user) {
       toast({
         title: 'Login Diperlukan',
         description: (
            <span>
              Anda harus <Link href="/login" className="underline font-bold">masuk</Link> untuk memberi suara.
            </span>
         ),
         variant: 'destructive',
       });
      return;
    }

    startTransition(() => {
      setOptimisticVote(voteType);
      // Pass the user's ID token for server-side verification
      // user from useAuth() is the full client-side User object with getIdToken()
      user.getIdToken().then(idToken => {
        voteOnAnime(animeId, voteType, idToken);
      });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 my-4">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Eye className="h-5 w-5" />
        <span className="text-sm font-medium">{formatCompactNumber(initialViews)} views</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => handleVote('like')}
        disabled={isPending}
      >
        <ThumbsUp
          className={cn('h-4 w-4', optimisticVote.currentUserVote === 'like' && 'text-primary fill-primary')}
        />
        <span>{formatCompactNumber(optimisticVote.likes)}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => handleVote('dislike')}
        disabled={isPending}
      >
        <ThumbsDown
          className={cn('h-4 w-4', optimisticVote.currentUserVote === 'dislike' && 'text-primary fill-primary')}
        />
        <span>{formatCompactNumber(optimisticVote.dislikes)}</span>
      </Button>
    </div>
  );
}
