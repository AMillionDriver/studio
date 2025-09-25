
import { getAnimes } from '@/lib/firebase/firestore';
import { getI18n } from '../i18n/server';
import { Suspense } from 'react';
import Loading from './loading';
import { FeaturedAnimeCarousel } from '@/components/featured-anime-carousel';
import { AnimeShelf } from '@/components/anime-shelf';
import { AnimeCard } from '@/components/anime-card';

async function HomePageContent() {
  const t = await getI18n();

  const [
    featuredAnimes, 
    latestAnimes, 
    popularAnimes, 
    allAnimes
  ] = await Promise.all([
    getAnimes(8, 'rating', 'desc'), // For carousel, let's use popular ones
    getAnimes(12, 'createdAt', 'desc'),
    getAnimes(12, 'rating', 'desc'),
    getAnimes(30) // For the final grid
  ]);

  if (allAnimes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No anime has been added yet.</p>
        <p className="text-sm text-muted-foreground">Use the Admin Panel to upload new anime series.</p>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div className="w-full aspect-[16/7] bg-muted animate-pulse" />}>
        <FeaturedAnimeCarousel animes={featuredAnimes} />
      </Suspense>
      
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-12">
        <AnimeShelf title="Update Terbaru">
          {latestAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeShelf>
        
        <AnimeShelf title="Paling Populer">
          {popularAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeShelf>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Semua Anime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {allAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Suspense fallback={<Loading />}>
        <HomePageContent />
      </Suspense>
    </main>
  );
}
