
'use client';

import { useAuth } from '@/hooks/use-auth';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface CommentSectionProps {
  animeId: string;
}

export function CommentSection({ animeId }: CommentSectionProps) {
  const { user, loading } = useAuth();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Kolom Komentar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-24 ml-auto" />
            </div>
          </div>
        ) : user && !user.isAnonymous ? (
          <CommentForm animeId={animeId} />
        ) : (
          <CardDescription className="text-center border p-4 rounded-md">
            Anda harus{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login">masuk</Link>
            </Button>{' '}
            atau{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup">mendaftar</Link>
            </Button>{' '}
            untuk meninggalkan komentar.
          </CardDescription>
        )}
        <CommentList animeId={animeId} />
      </CardContent>
    </Card>
  );
}
