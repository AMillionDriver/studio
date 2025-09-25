
'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/sdk';
import type { CommentSerializable } from '@/types/anime';
import { CommentItem } from './comment-item';
import { Skeleton } from '../ui/skeleton';

interface CommentListProps {
  animeId: string;
}

export function CommentList({ animeId }: CommentListProps) {
  const [comments, setComments] = useState<CommentSerializable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const commentsRef = collection(firestore, 'animes', animeId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as CommentSerializable;
      });
      setComments(fetchedComments);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching comments:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [animeId]);

  if (loading) {
    return (
        <div className="space-y-4">
            <CommentItemSkeleton />
            <CommentItemSkeleton />
        </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Jadilah yang pertama berkomentar!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}


function CommentItemSkeleton() {
    return (
        <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    );
}