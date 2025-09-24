import Image from 'next/image';
import { mockAnimeData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimeCard } from '@/components/anime/anime-card';

export default function DashboardPage() {
  const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const watching = mockAnimeData.slice(0, 4);
  const planToWatch = mockAnimeData.slice(2, 6);
  const completed = mockAnimeData.slice(1, 3).reverse();

  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          {avatar && <AvatarImage src={avatar.imageUrl} alt="User Avatar" data-ai-hint={avatar.imageHint} />}
          <AvatarFallback>AF</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Welcome back, AniFan123</h1>
          <p className="text-muted-foreground">Here's what's on your list.</p>
        </div>
      </div>

      <Tabs defaultValue="watching" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="watching">Currently Watching</TabsTrigger>
          <TabsTrigger value="plan-to-watch">Plan to Watch</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="watching" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watching.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="plan-to-watch" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {planToWatch.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {completed.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
