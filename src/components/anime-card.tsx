
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, PlayCircle } from 'lucide-react';
import type { AnimeSerializable } from '@/types/anime';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: AnimeSerializable;
  className?: string;
  showEpisodeNumber?: boolean;
}

const ALLOWED_HOSTNAMES = [
    'placehold.co',
    'images.unsplash.com',
    'picsum.photos',
    'encrypted-tbn0.gstatic.com',
    'www.google.com',
    'www.animenewsnetwork.com',
    'za.pinterest.com',
    'pin.it',
    'storage.googleapis.com'
];

function getValidSrc(url: string | undefined | null): string {
    if (!url) {
        return 'https://placehold.co/400x600?text=No+Image';
    }
    try {
        const urlObject = new URL(url);
        if (ALLOWED_HOSTNAMES.includes(urlObject.hostname)) {
            return url;
        }
    } catch (e) {
        return 'https://placehold.co/400x600?text=Invalid+URL';
    }
    return 'https://placehold.co/400x600/F00/FFF?text=Host+Error&font=lato';
}


export function AnimeCard({ anime, className, showEpisodeNumber = false }: AnimeCardProps) {
  const validSrc = getValidSrc(anime.coverImageUrl);
  
  return (
    <div className={className}>
        <Link href={`/watch/${anime.id}`} className="group block h-full">
        <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out bg-card hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
            <CardContent className="p-0">
            <div className="relative aspect-[2/3] w-full">
                <Image
                src={validSrc}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent transition-opacity duration-300 group-hover:opacity-70"></div>
                {anime.rating && anime.rating > 0 ? (
                  <Badge 
                      variant="destructive" 
                      className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 border-white/20 text-white"
                  >
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{anime.rating.toFixed(1)}</span>
                  </Badge>
                ) : null}

                {showEpisodeNumber && anime.episodes > 0 && (
                   <div className={cn(
                    "absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 group-hover:opacity-0",
                   )}>
                      <div className="flex flex-col items-center justify-center gap-1 rounded-full bg-black/70 p-3 text-white backdrop-blur-sm border border-white/20 aspect-square w-16 h-16">
                        <PlayCircle className="h-5 w-5" />
                        <span className="text-sm font-bold tracking-tight">EP {anime.episodes}</span>
                      </div>
                   </div>
                )}
            </div>
            <div className="p-3 space-y-1">
                <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors" title={anime.title}>
                {anime.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                {anime.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs font-medium">
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
