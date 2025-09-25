
'use client';

import { useRef, useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import { Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/sdk';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface CommentFormProps {
  animeId: string;
}

export function CommentForm({ animeId }: CommentFormProps) {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || user.isAnonymous || !commentText.trim()) return;

    startTransition(() => {
        const commentsCollection = collection(firestore, 'animes', animeId, 'comments');
        
        const commentData = {
          text: commentText,
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous User',
          authorPhotoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
        };

        // Use client-side addDoc and attach a .catch() for error handling
        addDoc(commentsCollection, commentData)
          .then(() => {
            setCommentText(''); // Clear textarea on success
          })
          .catch((error) => {
            // This is the critical part for contextual error handling
            console.error('Failed to add comment:', error);
            
            // 1. Create the detailed, contextual error
            const permissionError = new FirestorePermissionError({
              path: `animes/${animeId}/comments`, // The path of the collection we are writing to
              operation: 'create', // The operation being performed
              requestResourceData: commentData, // The data we tried to send
            });

            // 2. Emit the error globally
            errorEmitter.emit('permission-error', permissionError);

            // 3. Show a generic error to the user (the dev overlay will show the details)
            toast({
              title: 'Gagal Mengirim Komentar',
              description: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
              variant: 'destructive',
            });
          });
    });
  };

  if (!user || user.isAnonymous) return null;

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
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !commentText.trim()}>
            <Send className="mr-2 h-4 w-4" />
            {isPending ? 'Mengirim...' : 'Kirim'}
          </Button>
        </div>
      </div>
    </form>
  );
}
