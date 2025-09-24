import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const coverImage = PlaceHolderImages.find(img => img.id === anime.coverImageId);

  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            {coverImage && (
              <Image
                src={coverImage.imageUrl}
                alt={`Cover for ${anime.title}`}
                data-ai-hint={coverImage.imageHint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
               <div className="flex items-center gap-1.5 text-xs text-white">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{anime.rating}</span>
                </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-base truncate font-headline">{anime.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
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
