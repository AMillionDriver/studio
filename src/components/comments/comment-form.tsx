
'use client';

import { useRef, useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { addComment } from '@/lib/comments.actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import { Send } from 'lucide-react';

interface CommentFormProps {
  animeId: string;
}

export function CommentForm({ animeId }: CommentFormProps) {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const idToken = await user.getIdToken();
    formData.set('idToken', idToken);

    startTransition(async () => {
      const result = await addComment(animeId, formData);
      if (result.success) {
        formRef.current?.reset();
      } else {
        toast({
          title: 'Gagal Mengirim Komentar',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  if (!user) return null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
      </Avatar>
      <div className="w-full space-y-2">
        <Textarea
          name="comment"
          placeholder="Tulis komentar Anda..."
          className="w-full"
          rows={3}
          required
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Send className="mr-2 h-4 w-4" />
            {isPending ? 'Mengirim...' : 'Kirim'}
          </Button>
        </div>
      </div>
    </form>
  );
}
