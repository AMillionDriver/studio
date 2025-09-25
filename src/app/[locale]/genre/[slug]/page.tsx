import { getAnimes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { AnimeCard } from '@/components/anime-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const genre = decodeURIComponent(params.slug);
  return {
    title: `Anime Genre: ${genre}`,
    description: `Telusuri semua anime dengan genre ${genre}.`,
  };
}

export default async function GenreSlugPage({ params }: { params: { slug: string } }) {
  const genre = decodeURIComponent(params.slug);
  if (!genre) {
    notFound();
  }

  const allAnimes = await getAnimes();
  // Normalize genre from URL and from anime data for case-insensitive matching
  const normalizedGenre = genre.toLowerCase();
  const animesInGenre = allAnimes.filter(anime =>
    anime.genres.map(g => g.toLowerCase()).includes(normalizedGenre)
  );

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Genre:</h1>
                <Badge variant="secondary" className="text-2xl font-semibold px-4 py-1">{genre}</Badge>
            </div>
            <p className="text-muted-foreground mt-2">
                Menampilkan {animesInGenre.length} anime dengan genre {genre}.
            </p>
        </div>
         <Button asChild variant="outline">
            <Link href="/genre">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke semua genre
            </Link>
        </Button>
      </div>

      {animesInGenre.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animesInGenre.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Tidak ada anime yang ditemukan untuk genre ini.</p>
        </div>
      )}
    </div>
  );
}
