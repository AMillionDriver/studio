
import { getAnimeById, getAnimes } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tv, Calendar, Clapperboard, Layers } from 'lucide-react';
import { AnimeCard } from '@/components/anime-card';
import { RecommendedAnime } from '@/components/recommended-anime';

interface WatchPageProps {
  params: {
    id: string;
  };
}

// Helper to convert YouTube URL to embeddable format
function getEmbedUrl(url: string): string | null {
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
      const videoId = videoUrl.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } else if (videoUrl.hostname === 'youtu.be') {
      const videoId = videoUrl.pathname.slice(1);
       return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return url; // Return original URL if not a standard YouTube link
  } catch (error) {
    console.error("Invalid URL for embedding:", url, error);
    return null; // Return null if URL is malformed
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const anime = await getAnimeById(params.id);

  if (!anime) {
    notFound();
  }

  const recommendedAnimes = (await getAnimes(12)).filter(a => a.id !== anime.id);
  const embedUrl = getEmbedUrl(anime.streamUrl);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <Card className="overflow-hidden">
             {embedUrl ? (
                <div className="aspect-video w-full">
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
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                    <p className="text-white">The video link is not a valid YouTube URL.</p>
                </div>
             )}
          </Card>
          
          {/* Anime Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">{anime.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
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
              <CardDescription className="text-base leading-relaxed">
                {anime.description}
              </CardDescription>
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
