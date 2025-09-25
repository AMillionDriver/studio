
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, PlayCircle } from 'lucide-react';
import type { AnimeSerializable } from '@/types/anime';
import { cn } from '@/lib/utils';
import { getValidImageUrl } from '@/lib/utils';

interface AnimeCardProps {
  anime: AnimeSerializable;
  className?: string;
  showEpisodeNumber?: boolean;
}

export function AnimeCard({ anime, className, showEpisodeNumber = false }: AnimeCardProps) {
  const validSrc = getValidImageUrl(anime.coverImageUrl);
  
  return (
    <div className={cn("h-full", className)}>
        <Link href={`/watch/${anime.id}`} className="group block h-full">
        <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out bg-card hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1.5">
            <CardContent className="p-0">
            <div className="relative aspect-[2/3] w-full">
                <Image
                src={validSrc}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent transition-opacity duration-300"></div>
                {anime.rating && anime.rating > 0 ? (
                  <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 border-white/20 text-white backdrop-blur-sm px-2 py-1"
                  >
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm">{anime.rating.toFixed(1)}</span>
                  </Badge>
                ) : null}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                    <PlayCircle className="h-16 w-16 text-white/80" />
                </div>

                {showEpisodeNumber && anime.episodes > 0 && (
                   <div className={cn(
                    "absolute bottom-2 left-2",
                   )}>
                      <Badge variant="destructive" className="text-sm font-bold">EP {anime.episodes}</Badge>
                   </div>
                )}
            </div>
            <div className="p-3 space-y-1.5">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors" title={anime.title}>
                {anime.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                {anime.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs font-normal">
                    {genre}
                    </Badge>
                ))}
                </div>
            </div>
            </CardContent>
        </Card>
        </Link>
    </div>
  );
}
