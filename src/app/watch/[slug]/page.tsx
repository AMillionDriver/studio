import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAnimes } from '@/lib/firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VideoPlayer } from '@/components/anime/video-player';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';


export default async function WatchPage({ params }: { params: { slug: string } }) {
  const animes = await getAnimes();
  const anime = animes.find((a) => a.episodes.some(e => e.slug === params.slug));
  const episode = anime?.episodes.find(e => e.slug === params.slug);

  if (!anime || !episode) {
    notFound();
  }

  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Player and Details */}
        <div className="flex-grow lg:w-3/4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
            <VideoPlayer />
          </div>
          <div className="mt-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter font-headline">
              Ep {episode.episodeNumber}: {episode.title}
            </h1>
            <Link href={`/anime/${anime.slug}`}>
              <h2 className="text-lg md:text-xl text-muted-foreground hover:text-primary transition-colors">
                {anime.title}
              </h2>
            </Link>
          </div>
        </div>

        {/* Sidebar: Episode List */}
        <div className="lg:w-1/4 lg:max-w-sm flex-shrink-0">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-bold mb-4 text-lg font-headline">Episodes</h3>
            <ScrollArea className="h-96 lg:h-[60vh]">
              <div className="space-y-2 pr-4">
                {anime.episodes.map(ep => {
                  const thumbnail = PlaceHolderImages.find(img => img.id === ep.thumbnailId);
                  const isActive = ep.id === episode.id;
                  return (
                    <Link key={ep.id} href={`/watch/${ep.slug}`} className="block group">
                      <div className={cn(
                        "flex gap-4 p-2 rounded-md transition-colors",
                        isActive ? "bg-primary/20" : "hover:bg-primary/10"
                      )}>
                        <div className="w-24 h-14 relative flex-shrink-0 overflow-hidden rounded-md">
                          {thumbnail && (
                            <Image
                              src={thumbnail.imageUrl}
                              alt={`Thumbnail for ${ep.title}`}
                              data-ai-hint={thumbnail.imageHint}
                              fill
                              className="object-cover"
                            />
                          )}
                          {isActive && (
                            <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white"/>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-semibold leading-tight",
                            isActive ? "text-primary" : "text-foreground"
                          )}>Ep {ep.episodeNumber}: {ep.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{ep.duration}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
