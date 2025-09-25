
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-anime-recommendations';
import type { AnimeSerializable } from '@/types/anime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Bot } from 'lucide-react';
import { getAnimes } from '@/lib/data';
import Link from 'next/link';
import { Button } from './ui/button';

interface PersonalizedRecommendationsProps {
  watchedAnime: AnimeSerializable;
  recommendationPool: AnimeSerializable[];
}

export async function PersonalizedRecommendations({ watchedAnime, recommendationPool }: PersonalizedRecommendationsProps) {
  if (!watchedAnime) {
    return null;
  }

  const allTitles = recommendationPool.map(a => a.title);

  const aiRecommendations = await getPersonalizedRecommendations({
    watchedTitles: [watchedAnime.title], // Using the current anime as the seed for recommendations
    allTitles: allTitles,
  });

  const recommendedAnimes = aiRecommendations.recommendations.map(rec => {
    const fullAnime = recommendationPool.find(a => a.title === rec.title);
    return { ...rec, ...fullAnime };
  }).filter(rec => rec.id); // Filter out any that weren't found

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Rekomendasi Untukmu
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="h-3 w-3" /> Ditenagai oleh AI berdasarkan anime yang sedang Anda tonton.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendedAnimes.length > 0 ? (
          <div className="space-y-4">
            {recommendedAnimes.slice(0, 5).map(anime => (
              anime.id && (
                <div key={anime.id} className="p-3 rounded-lg border bg-background hover:border-primary/50 transition-all">
                    <h4 className="font-semibold leading-tight">{anime.title}</h4>
                    <p className="text-sm text-muted-foreground italic my-1">&quot;{anime.reason}&quot;</p>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <Link href={`/watch/${anime.id}`}>
                            Tonton Sekarang
                        </Link>
                    </Button>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada rekomendasi yang dapat dibuat saat ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
