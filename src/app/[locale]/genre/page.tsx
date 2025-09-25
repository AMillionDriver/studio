
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Swords, Drama, Heart, Ghost, History, Wand2, Music, Bot, Sailboat, School, Gamepad,
  Rocket, SliceOfLife, Star, Tv, Users, Award, ShieldQuestion, Utensils, Brain, Glasses, ShieldAlert,
  Cog, Bomb, Sun, Dna, Microscope, BookOpen, Clock, Shield, Anchor, GraduationCap, Mountain
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAnimes } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Daftar genre umum yang telah ditentukan
const commonGenres = [
  'Shōnen', 'Shōjo', 'Seinen', 'Josei', 'Kodomo', 'Aksi', 'Petualangan', 'Fantasi', 
  'Sci-Fi', 'Slice of Life', 'Komedi', 'Romansa', 'Horor', 'Misteri', 'Isekai', 
  'Mecha', 'Olahraga', 'Musikal', 'Thriller', 'Psikologis', 'Gourmet', 'Historis', 
  'Magical Girl', 'Harem', 'Reverse Harem'
];

const nicheGenres = [
  'Steampunk', 'Cyberpunk', 'Post-Apocalyptic', 'Gore', 'Dementia', 'Game', 'Virtual World', 
  'Yuri', 'Shōjo-ai', 'Yaoi', 'Shōnen-ai', 'Ecchi', 'Parody', 'Survival', 'Time Travel', 
  'Military', 'Samurai', 'Kaiju', 'Gakuen'
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
    'gourmet': Utensils,
    'harem': Users,
    'reverse harem': Users,
    'steampunk': Cog,
    'cyberpunk': Dna,
    'post-apocalyptic': Bomb,
    'gore': ShieldAlert,
    'dementia': Microscope,
    'virtual world': Dna,
    'yuri': Heart,
    'shōjo-ai': Heart,
    'yaoi': Heart,
    'shōnen-ai': Heart,
    'ecchi': ShieldAlert,
    'parody': Drama,
    'survival': Anchor,
    'time travel': Clock,
    'military': Shield,
    'samurai': Swords,
    'kaiju': Mountain,
    'gakuen': GraduationCap,
};

function getGenreIcon(genre: string) {
    const iconKey = genre.toLowerCase();
    const Icon = genreIconMap[iconKey];
    return Icon ? <Icon className="h-8 w-8 text-primary" /> : <Tv className="h-8 w-8 text-primary" />;
}

function GenreGrid({ genres, availableGenres }: { genres: string[], availableGenres: Set<string> }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {genres.map(genre => {
              const isAvailable = availableGenres.has(genre.toLowerCase());
              const cardContent = (
                <Card 
                  className={cn(
                    "flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 ease-in-out relative",
                    isAvailable ? "group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50 group-hover:-translate-y-1" : "opacity-50 cursor-not-allowed bg-muted/50"
                  )}
                >
                  {!isAvailable && (
                    <Badge variant="destructive" className="absolute top-2 right-2 text-xs">Coming Soon</Badge>
                  )}
                  {getGenreIcon(genre)}
                  <p className={cn(
                    "mt-3 font-semibold text-center text-sm md:text-base transition-colors",
                    isAvailable && "group-hover:text-primary"
                  )}>{genre}</p>
                </Card>
              );

              if (isAvailable) {
                return (
                  <Link key={genre} href={`/genre/${encodeURIComponent(genre)}`} className="group">
                    {cardContent}
                  </Link>
                );
              }

              return (
                 <div key={genre} className="group">
                    {cardContent}
                 </div>
              );
            })}
        </div>
    );
}

export default async function GenrePage() {
  const animes = await getAnimes();
  const availableGenres = new Set(animes.flatMap(anime => anime.genres.map(g => g.toLowerCase())));

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-12">
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Daftar Genre Umum</h1>
            <p className="text-muted-foreground mt-1">Jelajahi anime berdasarkan kategori paling populer.</p>
        </div>
        <GenreGrid genres={commonGenres} availableGenres={availableGenres} />
      </div>

      <Separator />

      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Niche & Spesifik</h1>
            <p className="text-muted-foreground mt-1">Temukan kategori yang lebih spesifik dan unik.</p>
        </div>
        <GenreGrid genres={nicheGenres} availableGenres={availableGenres} />
      </div>
    </div>
  );
}
