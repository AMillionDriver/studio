import { getAnimes } from '@/lib/data';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Swords, Drama, Heart, Ghost, History, Wand2, Music, Bot, Sailboat, School, Gamepad,
  Rocket, Slice, Star, Tv, CircleHelp, Users, Briefcase, Award, Car, Plane, ShieldQuestion
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// A simple mapping from genre names to Lucide icons
const genreIconMap: Record<string, React.FC<LucideProps>> = {
    'action': Swords,
    'adventure': Sailboat,
    'cars': Car,
    'comedy': Drama,
    'drama': Drama,
    'fantasy': Wand2,
    'game': Gamepad,
    'hentai': CircleHelp, // Placeholder
    'historical': History,
    'horror': Ghost,
    'kids': Users,
    'magic': Wand2,
    'mecha': Bot,
    'military': ShieldQuestion,
    'music': Music,
    'mystery': ShieldQuestion,
    'parody': Drama,
    'police': Briefcase,
    'psychological': CircleHelp,
    'romance': Heart,
    'samurai': Swords,
    'school': School,
    'sci-fi': Rocket,
    'seinen': Award,
    'shoujo': Heart,
    'shounen': Star,
    'slice of life': Slice,
    'space': Rocket,
    'sports': Award,
    'super power': Star,
    'supernatural': Ghost,
    'suspense': ShieldQuestion,
    'thriller': ShieldQuestion,
    'vampire': Ghost,
    'yaoi': Heart,
    'yuri': Heart,
    'isekai': Wand2,
    'aviation': Plane,
};

function getGenreIcon(genre: string) {
    const Icon = genreIconMap[genre.toLowerCase()];
    return Icon ? <Icon className="h-8 w-8 text-primary" /> : <Tv className="h-8 w-8 text-primary" />;
}

export default async function GenrePage() {
  const animes = await getAnimes();
  const allGenres = animes.flatMap(anime => anime.genres);
  const uniqueGenres = [...new Set(allGenres)].sort();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Jelajahi Berdasarkan Genre</h1>
        <p className="text-muted-foreground mt-1">Temukan anime favoritmu berdasarkan kategori yang kamu suka.</p>
      </div>
      
      {uniqueGenres.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {uniqueGenres.map(genre => (
            <Link key={genre} href={`/genre/${encodeURIComponent(genre)}`} className="group">
              <Card className="flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
                {getGenreIcon(genre)}
                <p className="mt-3 font-semibold text-center text-sm md:text-base group-hover:text-primary transition-colors">{genre}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Belum Ada Genre</h2>
            <p className="text-muted-foreground">Sepertinya belum ada anime yang ditambahkan. Genre akan muncul di sini setelah anime ditambahkan.</p>
        </div>
      )}
    </div>
  );
}
