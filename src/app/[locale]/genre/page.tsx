
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Swords, Drama, Heart, Ghost, History, Wand2, Music, Bot, Sailboat, School, Gamepad,
  Rocket, SliceOfLife, Star, Tv, CircleHelp, Users, Briefcase, Award, Car, Plane, ShieldQuestion, Utensils, Brain, Glasses, ShieldAlert
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Daftar genre umum yang telah ditentukan
const commonGenres = [
  'Shōnen', 'Shōjo', 'Seinen', 'Josei', 'Kodomo', 'Aksi', 'Petualangan', 'Fantasi', 
  'Sci-Fi', 'Slice of Life', 'Komedi', 'Romansa', 'Horor', 'Misteri', 'Isekai', 
  'Mecha', 'Olahraga', 'Musikal', 'Thriller', 'Psikologis', 'Gourmet', 'Historis', 
  'Magical Girl', 'Harem', 'Reverse Harem', 'Ecchi'
];

// Pemetaan dari nama genre ke ikon Lucide
const genreIconMap: Record<string, React.FC<LucideProps>> = {
    'aksi': Swords,
    'petualangan': Sailboat,
    'komedi': Drama,
    'fantasi': Wand2,
    'game': Gamepad,
    'historis': History,
    'horor': Ghost,
    'isekai': Wand2,
    'josei': Glasses,
    'kodomo': Users,
    'magical girl': Wand2,
    'mecha': Bot,
    'misteri': ShieldQuestion,
    'musikal': Music,
    'psikologis': Brain,
    'romansa': Heart,
    'sci-fi': Rocket,
    'seinen': Award,
    'shōjo': Heart,
    'shōnen': Star,
    'slice of life': Utensils,
    'olahraga': Award,
    'thriller': ShieldAlert,
    'ecchi': ShieldAlert, // Placeholder icon
    'gourmet': Utensils,
    'harem': Users,
    'reverse harem': Users,
};

function getGenreIcon(genre: string) {
    const iconKey = genre.toLowerCase();
    const Icon = genreIconMap[iconKey];
    return Icon ? <Icon className="h-8 w-8 text-primary" /> : <Tv className="h-8 w-8 text-primary" />;
}

export default async function GenrePage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Genre Umum</h1>
        <p className="text-muted-foreground mt-1">Jelajahi anime berdasarkan kategori paling populer.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {commonGenres.map(genre => (
          <Link key={genre} href={`/genre/${encodeURIComponent(genre)}`} className="group">
            <Card className="flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
              {getGenreIcon(genre)}
              <p className="mt-3 font-semibold text-center text-sm md:text-base group-hover:text-primary transition-colors">{genre}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
