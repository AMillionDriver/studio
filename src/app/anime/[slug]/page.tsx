import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Calendar, Tv, Bookmark, Play } from 'lucide-react';
import { getAnimeBySlug, getAllAnimeSlugs } from '@/lib/firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  const slugs = await getAllAnimeSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function AnimeDetailPage({ params }: { params: { slug: string } }) {
  const anime = await getAnimeBySlug(params.slug);

  if (!anime) {
    notFound();
  }

  const coverImage = PlaceHolderImages.find((img) => img.id === anime.coverImageId);
  const heroImage = PlaceHolderImages.find((img) => img.id === anime.heroImageId);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`Backdrop for ${anime.title}`}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </section>

      {/* Details Section */}
      <section className="container max-w-screen-lg -mt-[20vh]">
        <div className="relative z-10 md:flex md:gap-8">
          <div className="w-48 md:w-60 lg:w-72 mx-auto md:mx-0 flex-shrink-0 -mt-24 md:-mt-32">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              {coverImage && (
                <Image
                  src={coverImage.imageUrl}
                  alt={`Cover for ${anime.title}`}
                  data-ai-hint={coverImage.imageHint}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div className="mt-6 md:mt-4 flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">
              {anime.title}
            </h1>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-semibold">{anime.rating}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold">{anime.year}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-primary" />
                <span className="font-semibold">{anime.status}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="border-primary/50 text-primary">
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="mt-6 text-foreground/80 text-sm md:text-base">
              {anime.description}
            </p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={`/watch/${anime.episodes[0].slug}`}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Episode 1
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Bookmark className="mr-2 h-5 w-5" />
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="container max-w-screen-lg py-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Episodes</h2>
        <Separator className="mb-6"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anime.episodes.map((episode) => {
            const thumbnail = PlaceHolderImages.find((img) => img.id === episode.thumbnailId);
            return (
              <Link key={episode.id} href={`/watch/${episode.slug}`} className="group block">
                <div className="bg-card rounded-lg overflow-hidden border transition-all duration-300 hover:border-primary/50">
                  <div className="relative aspect-video">
                    {thumbnail && (
                      <Image
                        src={thumbnail.imageUrl}
                        alt={`Thumbnail for ${episode.title}`}
                        data-ai-hint={thumbnail.imageHint}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                       <Play className="w-10 h-10 text-white/70 group-hover:text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold truncate text-sm">
                      Ep {episode.episodeNumber}: {episode.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{episode.duration}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
