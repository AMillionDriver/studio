
'use client';

import { getAnimeById, getAnimes, getEpisodesForAnime } from '@/lib/firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tv, Calendar, Clapperboard, Layers, VenetianMask, Youtube, Instagram, Facebook } from 'lucide-react';
import { RecommendedAnime } from '@/components/recommended-anime';
import { useEffect, useState } from 'react';
import type { AnimeSerializable, EpisodeSerializable } from '@/types/anime';
import { Skeleton } from '@/components/ui/skeleton';
import { EpisodeSelector } from '@/components/episode-selector';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XIcon } from '@/components/icons/x-icon';


interface WatchPageProps {
  params: {
    id: string;
  };
}

// Helper to convert YouTube URL to embeddable format
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
      const videoId = videoUrl.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } else if (videoUrl.hostname === 'youtu.be') {
      const videoId = videoUrl.pathname.slice(1);
       return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    }
    // For now, only support YouTube. In future, could support other direct embed URLs.
    return null;
  } catch (error) {
    console.error("Invalid URL for embedding:", url, error);
    return null;
  }
}

export default function WatchPage() {
  const params = useParams();
  const animeId = typeof params.id === 'string' ? params.id : '';
  
  const [anime, setAnime] = useState<AnimeSerializable | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeSerializable[]>([]);
  const [recommendedAnimes, setRecommendedAnimes] = useState<AnimeSerializable[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeSerializable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) {
      setLoading(false);
      notFound();
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [animeData, episodesData, recommendedData] = await Promise.all([
            getAnimeById(animeId),
            getEpisodesForAnime(animeId),
            getAnimes(12)
        ]);

        if (!animeData) {
          return notFound();
        }
        
        setAnime(animeData);
        setEpisodes(episodesData);
        setRecommendedAnimes(recommendedData.filter(a => a.id !== animeId));
        
        if (episodesData.length > 0) {
          setCurrentEpisode(episodesData[0]);
        }

      } catch (error) {
        console.error("Failed to fetch anime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId]);

  const handleEpisodeSelect = (episode: EpisodeSerializable) => {
    setCurrentEpisode(episode);
  };
  
  const videoUrlToPlay = currentEpisode?.videoUrl || anime?.streamUrl || '';
  const embedUrl = getEmbedUrl(videoUrlToPlay);

  if (loading) {
    return <WatchPageSkeleton />;
  }

  if (!anime) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <Card className="overflow-hidden bg-background">
             {embedUrl ? (
                <div className="aspect-video w-full bg-black">
                    <iframe
                        src={embedUrl}
                        title={`Player for ${anime.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
             ) : (
                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Video stream not available.</p>
                </div>
             )}
          </Card>
          
          {/* Anime Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">{anime.title}</CardTitle>
               {currentEpisode && (
                 <CardDescription className="text-lg text-primary font-semibold">
                    Episode {currentEpisode.episodeNumber}: {currentEpisode.title}
                 </CardDescription>
               )}
              <div className="flex flex-wrap gap-2 mt-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                 {anime.rating && anime.rating > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{anime.rating.toFixed(1)}</span>
                    </div>
                 )}
                 <div className="flex items-center gap-1">
                    <Tv className="h-4 w-4" />
                    <span>TV Series</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <Clapperboard className="h-4 w-4" />
                    <span>{anime.episodes} Episodes</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(anime.createdAt).getFullYear()}</span>
                 </div>
              </div>
              <CardDescription className="text-base leading-relaxed mb-6">
                {anime.description}
              </CardDescription>

              {anime.creator && anime.creator.name && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <VenetianMask className="h-5 w-5 text-primary" />
                      About the Creator
                    </h3>
                    <div className="flex items-center gap-4">
                       <p className="font-medium text-foreground">{anime.creator.name}</p>
                       <div className="flex items-center gap-2">
                          {anime.creator.socials.youtube && (
                            <Button variant="outline" size="icon" asChild>
                              <Link href={anime.creator.socials.youtube} target="_blank">
                                <Youtube className="h-5 w-5 text-red-500" />
                              </Link>
                            </Button>
                          )}
                          {anime.creator.socials.instagram && (
                            <Button variant="outline" size="icon" asChild>
                               <Link href={anime.creator.socials.instagram} target="_blank">
                                <Instagram className="h-5 w-5 text-pink-500" />
                               </Link>
                            </Button>
                          )}
                           {anime.creator.socials.twitter && (
                            <Button variant="outline" size="icon" asChild>
                              <Link href={anime.creator.socials.twitter} target="_blank">
                                <XIcon className="h-5 w-5" />
                              </Link>
                            </Button>
                          )}
                           {anime.creator.socials.facebook && (
                            <Button variant="outline" size="icon" asChild>
                              <Link href={anime.creator.socials.facebook} target="_blank">
                                <Facebook className="h-5 w-5 text-blue-600" />
                              </Link>
                            </Button>
                          )}
                       </div>
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </>
              )}
              
              {episodes.length > 0 && (
                 <div className="mt-6">
                  <EpisodeSelector 
                      episodes={episodes}
                      currentEpisodeNumber={currentEpisode?.episodeNumber || 0}
                      onEpisodeSelect={handleEpisodeSelect}
                  />
                 </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Anime Sidebar */}
        <div className="lg:col-span-1">
             <RecommendedAnime animes={recommendedAnimes} />
        </div>
      </div>
    </div>
  );
}

function WatchPageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-5 w-1/2 mt-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  );
}
