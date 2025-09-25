
'use client';

import { getAnimes } from '@/lib/firebase/firestore';
import { AnimeCard } from '@/components/anime-card';
import type { AnimeSerializable } from '@/types/anime';
import { useI18n } from '../i18n/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { t } = useI18n();
  const [animes, setAnimes] = useState<AnimeSerializable[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnimes = async () => {
      const animeData = await getAnimes();
      setAnimes(animeData);
      setLoading(false);
    }
    fetchAnimes();
  }, [])


  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{t('home.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : animes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No anime has been added yet.</p>
          <p className="text-sm text-muted-foreground">Use the Admin Panel to upload new anime series.</p>
        </div>
      )}
    </main>
  );
}
