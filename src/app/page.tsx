
import { getAnimes } from '@/lib/firebase/firestore';
import { AnimeCard } from '@/components/anime-card';
import type { AnimeSerializable } from '@/types/anime';

export default async function Home() {
  const animes: AnimeSerializable[] = await getAnimes();

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Explore Our Anime Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover the latest and greatest anime series available for streaming.
        </p>
      </div>

      {animes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No anime has been added yet.</p>
          <p className="text-sm text-muted-foreground">Use the Admin Panel to upload new anime series.</p>
        </div>
      )}
    </main>
  );
}
