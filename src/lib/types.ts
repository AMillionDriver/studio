export type Anime = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageId: string;
  heroImageId: string;
  genres: string[];
  rating: number;
  episodes: Episode[];
  year: number;
  status: 'Airing' | 'Finished';
};

export type Episode = {
  id: string;
  slug: string;
  title: string;
  episodeNumber: number;
  thumbnailId: string;
  duration: string; // e.g., "24m"
};
