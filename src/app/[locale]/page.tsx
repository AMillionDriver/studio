
import { getAnimes } from '@/lib/firebase/firestore';
import { AnimeCard } from '@/components/anime-card';
import { getI18n } from '../i18n/server';
import { Suspense } from 'react';
import Loading from './loading';
import { FeaturedAnimeCarousel } from '@/components/featured-anime-carousel';

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
  const featuredAnimes = await getAnimes(8); // Fetch 8 animes for carousel

  return (
    <main className="flex flex-col">
      <Suspense fallback={<div className="w-full aspect-[16/7] bg-muted animate-pulse" />}>
        <FeaturedAnimeCarousel animes={featuredAnimes} />
      </Suspense>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">{t('home.title')}</h2>
          <p className="mt-1 text-lg text-muted-foreground">
            {t('home.subtitle')}
          </p>
        </div>
        
        <Suspense fallback={<Loading />}>
          <AnimeGrid />
        </Suspense>
      </div>
    </main>
  );
}
