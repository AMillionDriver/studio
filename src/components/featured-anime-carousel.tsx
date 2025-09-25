
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { AnimeSerializable } from '@/types/anime';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';

interface FeaturedAnimeCarouselProps {
  animes: AnimeSerializable[];
}

export function FeaturedAnimeCarousel({ animes }: FeaturedAnimeCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!animes || animes.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {animes.map((anime) => (
            <CarouselItem key={anime.id}>
              <div className="relative aspect-video md:aspect-[16/7] w-full">
                <Image
                  src={anime.coverImageUrl || 'https://placehold.co/1280x720?text=Anime'}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                 <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl text-foreground p-8 md:p-12 lg:p-16 space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight !leading-tight">
                      {anime.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {anime.genres.slice(0,3).map(genre => (
                            <Badge key={genre} variant="secondary" className="backdrop-blur-sm">{genre}</Badge>
                        ))}
                    </div>
                    <p className="mt-2 text-md md:text-lg line-clamp-3 leading-relaxed text-muted-foreground">
                      {anime.description}
                    </p>
                    <Button asChild className="mt-6" size="lg">
                      <Link href={`/watch/${anime.id}`}>
                        <PlayCircle className="mr-2 h-5 w-5"/>
                        Tonton Sekarang
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
