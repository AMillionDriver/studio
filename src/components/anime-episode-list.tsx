
'use client';

import { useEffect, useState } from 'react';
import { getEpisodesForAnime } from '@/lib/firebase/firestore';
import type { EpisodeSerializable } from '@/types/anime';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteEpisode } from '@/lib/episode.actions';

interface AnimeEpisodeListProps {
  animeId: string;
}

export function AnimeEpisodeList({ animeId }: AnimeEpisodeListProps) {
  const [episodes, setEpisodes] = useState<EpisodeSerializable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!animeId) return;

    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const episodeData = await getEpisodesForAnime(animeId);
        setEpisodes(episodeData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching episodes for anime ${animeId}:`, err);
        setError('Failed to load episodes.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId]);

  const handleDelete = async (episodeId: string) => {
    const result = await deleteEpisode(animeId, episodeId);
    if (result.success) {
        toast({
            title: 'Episode Deleted',
            description: 'The episode has been successfully removed.',
        });
        setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
    } else {
        toast({
            title: 'Error',
            description: result.error || 'Failed to delete the episode.',
            variant: 'destructive',
        });
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive p-4">{error}</p>;
  }

  if (episodes.length === 0) {
    return <p className="text-muted-foreground p-4 text-sm">No episodes have been uploaded for this anime yet.</p>;
  }

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-2">Episode List</h4>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Episode</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodes.map((ep) => (
              <TableRow key={ep.id}>
                <TableCell className="font-medium">{ep.episodeNumber}</TableCell>
                <TableCell>{ep.title}</TableCell>
                <TableCell>{format(new Date(ep.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin-panel/edit-episode/${animeId}/${ep.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Episode</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete Episode</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete episode {ep.episodeNumber}: &quot;{ep.title}&quot;.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleDelete(ep.id)}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
