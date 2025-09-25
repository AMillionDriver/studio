
import { getAnimeById, getAnimes, getEpisodesForAnime } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tv, Calendar, Clapperboard, VenetianMask, Youtube, Instagram, Facebook } from 'lucide-react';
import { RecommendedAnime } from '@/components/recommended-anime';
import type { AnimeSerializable } from '@/types/anime';
import { EpisodeSelector } from '@/components/episode-selector';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XIcon } from '@/components/icons/x-icon';
import { Suspense } from 'react';
import WatchPageClient from './page-client';
import Loading from './loading';

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const animeId = params.id;
  
  if (!animeId) {
    notFound();
  }

  // Fetch data on the server
  const animeData = await getAnimeById(animeId);

  if (!animeData) {
    notFound();
  }

  // We can fetch these in parallel for better performance
  const [episodesData, recommendedData] = await Promise.all([
    getEpisodesForAnime(animeId),
    getAnimes(12)
  ]);
  
  const recommendedAnimes = recommendedData.filter(a => a.id !== animeId);

  return (
    <Suspense fallback={<Loading />}>
      <WatchPageClient 
        anime={animeData}
        episodes={episodesData}
        recommendedAnimes={recommendedAnimes}
      />
    </Suspense>
  );
}
