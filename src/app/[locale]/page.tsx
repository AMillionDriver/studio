
import { getAnimes } from '@/lib/data';
import { Suspense } from 'react';
import Loading from './loading';
import { FeaturedAnimeCarousel } from '@/components/featured-anime-carousel';
import { AnimeShelf } from '@/components/anime-shelf';
import { AnimeCard } from '@/components/anime-card';
import { AnnouncementBanner } from '@/components/announcement-banner';

async function HomePageContent() {

  // Fetch all data in parallel for maximum efficiency
  const [
    featuredAnimes, 
    latestAnimes, 
    popularAnimes, 
    allAnimes
  ] = await Promise.all([
    getAnimes(5, 'rating', 'desc'),      // For carousel, use most popular
    getAnimes(12, 'updatedAt', 'desc'),   // For latest shelf
    getAnimes(12, 'rating', 'desc'),      // For popular shelf
    getAnimes(30)                         // For the main grid
  ]);

  // Handle case where there is no content at all
  if (allAnimes.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-2">No Anime Found</h2>
        <p className="text-muted-foreground text-lg">It looks like no anime has been added yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Please use the Admin Panel to upload new anime series.</p>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div className="w-full aspect-[16/7] bg-muted animate-pulse" />}>
        <FeaturedAnimeCarousel animes={featuredAnimes} />
      </Suspense>
      
      <AnnouncementBanner />

      <div className="container mx-auto py-10 px-4 md:px-6 space-y-16">
        {latestAnimes.length > 0 && (
          <AnimeShelf title="Update Terbaru">
            {latestAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className="w-40 flex-shrink-0" showEpisodeNumber={true} />
            ))}
          </AnimeShelf>
        )}
        
        {popularAnimes.length > 0 && (
          <AnimeShelf title="Paling Populer">
            {popularAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className="w-40 flex-shrink-0" />
            ))}
          </AnimeShelf>
        )}

        {allAnimes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Semua Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {allAnimes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default async function Home() {
  return (
    <main className="flex flex-col bg-background">
      <Suspense fallback={<Loading />}>
        <HomePageContent />
      </Suspense>
    </main>
  );
}
