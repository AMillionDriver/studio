
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { AnimeSerializable } from '@/types/anime';

interface AnimeCardProps {
  anime: AnimeSerializable;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/watch/${anime.id}`} className="group block">
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={anime.coverImageUrl}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {anime.rating && anime.rating > 0 ? (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2 flex items-center gap-1"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderColor: 'rgba(255,255,255,0.2)'
                }}
              >
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{anime.rating.toFixed(1)}</span>
              </Badge>
            ) : null}
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-semibold text-sm truncate group-hover:text-primary" title={anime.title}>
              {anime.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
