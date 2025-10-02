
'use client';

import type { AnimeSerializable } from '@/types/anime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useMemo } from 'react';

interface RelatedAnimeProps {
  currentAnime: AnimeSerializable;
  allAnimes: AnimeSerializable[];
}

export function RelatedAnime({ currentAnime, allAnimes }: RelatedAnimeProps) {
  
  const relatedAnimes = useMemo(() => {
    if (!currentAnime || !allAnimes) {
      return [];
    }

    const currentGenres = new Set(currentAnime.genres.map(g => g.toLowerCase()));

    // Find other anime that share at least one genre
    const scoredAnimes = allAnimes
      .map(anime => {
        if (anime.id === currentAnime.id) return null; // Exclude self

        const sharedGenres = anime.genres.filter(genre =>
          currentGenres.has(genre.toLowerCase())
        );

        return {
          anime,
          score: sharedGenres.length,
        };
      })
      .filter(item => item !== null && item.score > 0) as { anime: AnimeSerializable; score: number }[];

    // Sort by score (number of shared genres) and then by rating as a tie-breaker
    scoredAnimes.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (b.anime.rating || 0) - (a.anime.rating || 0);
    });

    return scoredAnimes.map(item => item.anime);

  }, [currentAnime, allAnimes]);

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Layers className="h-5 w-5 text-primary" />
          Rekomendasi Terkait
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Berdasarkan genre yang mirip dengan anime yang Anda tonton.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {relatedAnimes.length > 0 ? (
          <div className="space-y-4">
            {relatedAnimes.slice(0, 5).map(anime => (
              anime.id && (
                <div key={anime.id} className="p-3 rounded-lg border bg-background hover:border-primary/50 transition-all">
                    <h4 className="font-semibold leading-tight">{anime.title}</h4>
                    <p className="text-sm text-muted-foreground my-1">
                      {anime.genres.join(', ')}
                    </p>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <Link href={`/watch/${anime.id}`}>
                            Tonton Sekarang
                        </Link>
                    </Button>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada rekomendasi yang dapat dibuat saat ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

    