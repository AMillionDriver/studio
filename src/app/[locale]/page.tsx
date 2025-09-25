
import { getAnimes } from '@/lib/firebase/firestore';
import { AnimeCard } from '@/components/anime-card';
import type { AnimeSerializable } from '@/types/anime';
import { getI18n } from '../i18n/server';
import { Suspense } from 'react';
import Loading from './loading';

async function AnimeGrid() {
  const animes = await getAnimes();
  const t = await getI18n();

  if (animes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No anime has been added yet.</p>
        <p className="text-sm text-muted-foreground">Use the Admin Panel to upload new anime series.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}

export default async function Home() {
  const t = await getI18n();

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{t('home.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
      </div>
      
      <Suspense fallback={<Loading />}>
        <AnimeGrid />
      </Suspense>
    </main>
  );
}
