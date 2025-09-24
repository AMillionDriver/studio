import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimeCard } from '@/components/anime/anime-card';
import { PlayCircle } from 'lucide-react';
import { getFeaturedAnime, getPopularAnime, getTrendingAnime } from '@/lib/firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function Home() {
  const featuredAnime = await getFeaturedAnime();
  const trendingAnime = await getTrendingAnime(6);
  const popularAnime = await getPopularAnime(6);

  if (!featuredAnime) {
    // Handle case where no anime is available
    return (
      <div className="container text-center py-20">
        <h2 className="text-2xl font-bold">No Anime Found</h2>
        <p className="text-muted-foreground">Check back later for new content!</p>
      </div>
    );
  }

  const heroImage = PlaceHolderImages.find(img => img.id === featuredAnime.heroImageId);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`Hero image for ${featuredAnime.title}`}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="container relative z-10 flex flex-col justify-center h-full max-w-screen-2xl">
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
              {featuredAnime.title}
            </h1>
            <p className="text-lg text-foreground/80 line-clamp-3">
              {featuredAnime.description}
            </p>
            <div className="flex items-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={`/watch/${featuredAnime.episodes[0].slug}`}>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/20 border-white/50 backdrop-blur-sm hover:bg-white/10">
                <Link href={`/anime/${featuredAnime.slug}`}>
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-screen-2xl space-y-16 py-8">
        {/* Trending Now Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-headline">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* Popular This Season Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-headline">Popular This Season</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
