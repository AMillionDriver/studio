
'use client';

import { useEffect, useState } from 'react';
import { getEpisodesForAnime } from '@/lib/firebase/firestore';
import type { EpisodeSerializable } from '@/types/anime';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';

interface AnimeEpisodeListProps {
  animeId: string;
}

export function AnimeEpisodeList({ animeId }: AnimeEpisodeListProps) {
  const [episodes, setEpisodes] = useState<EpisodeSerializable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <Button variant="ghost" size="icon" disabled>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Episode</span>
                  </Button>
                  <Button variant="ghost" size="icon" disabled>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete Episode</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

