
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { AnimeSerializable } from '@/types/anime';

interface AnimeCardProps {
  anime: AnimeSerializable;
  className?: string;
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
    return `https://placehold.co/400x600/F00/FFF?text=Host+Error&font=lato`;
}


export function AnimeCard({ anime, className }: AnimeCardProps) {
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
                {anime.rating && anime.rating > 0 ? (
                <Badge 
                    variant="destructive" 
                    className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 border-white/20 text-white"
                >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{anime.rating.toFixed(1)}</span>
                </Badge>
                ) : null}
            </div>
            <div className="p-3 space-y-1.5">
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
