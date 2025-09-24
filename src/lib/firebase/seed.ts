// src/lib/firebase/seed.ts
import { collection, writeBatch, getDocs, query } from 'firebase/firestore';
import { firestore } from './sdk';
import type { Anime } from '@/lib/types';

const animes: Omit<Anime, 'id'>[] = [
  {
    slug: 'cyber-ronin',
    title: 'Cyber Ronin',
    description: 'In a neon-drenched future, a lone cyborg samurai wanders the data-highways, seeking revenge for his fallen master.',
    coverImageId: 'anime-1',
    heroImageId: 'hero-1',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    rating: 8.8,
    year: 2024,
    status: 'Airing',
    episodes: [
      { id: 'ep1', slug: 'cyber-ronin-ep-1', title: 'The Ghost in the Code', episodeNumber: 1, thumbnailId: 'episode-thumb-1', duration: '24m' },
      { id: 'ep2', slug: 'cyber-ronin-ep-2', title: 'Digital Steel', episodeNumber: 2, thumbnailId: 'episode-thumb-2', duration: '23m' },
      { id: 'ep3', slug: 'cyber-ronin-ep-3', title: 'Memory of a Blade', episodeNumber: 3, thumbnailId: 'episode-thumb-3', duration: '25m' },
    ],
  },
  {
    slug: 'astral-chronicles',
    title: 'Astral Chronicles',
    description: 'A young mage discovers a hidden library containing the history of the cosmos, embarking on a quest to prevent a celestial war.',
    coverImageId: 'anime-2',
    heroImageId: 'hero-3',
    genres: ['Fantasy', 'Adventure', 'Magic'],
    rating: 9.2,
    year: 2023,
    status: 'Finished',
    episodes: [
      { id: 'ep4', slug: 'astral-chronicles-ep-1', title: 'The Star-Woven Tome', episodeNumber: 1, thumbnailId: 'episode-thumb-4', duration: '22m' },
      { id: 'ep5', slug: 'astral-chronicles-ep-2', title: 'Whispers of a Dying Star', episodeNumber: 2, thumbnailId: 'episode-thumb-1', duration: '24m' },
    ],
  },
  {
    slug: 'ghost-of-yokohama',
    title: 'Ghost of Yokohama',
    description: 'A cynical detective partners with a mischievous spirit to solve supernatural crimes haunting the port city of Yokohama.',
    coverImageId: 'anime-3',
    heroImageId: 'hero-2',
    genres: ['Mystery', 'Supernatural', 'Detective'],
    rating: 8.5,
    year: 2022,
    status: 'Finished',
    episodes: [
       { id: 'ep6', slug: 'ghost-of-yokohama-ep-1', title: 'The Phantom of the Pier', episodeNumber: 1, thumbnailId: 'episode-thumb-2', duration: '25m' },
    ],
  },
  {
    slug: 'mech-cadets',
    title: 'Mech Cadets',
    description: 'In the face of an alien invasion, a group of underdog teens are chosen to pilot giant, ancient robots to defend Earth.',
    coverImageId: 'anime-4',
    heroImageId: 'hero-4',
    genres: ['Mecha', 'Sci-Fi', 'Action'],
    rating: 8.9,
    year: 2024,
    status: 'Airing',
    episodes: [
       { id: 'ep7', slug: 'mech-cadets-ep-1', title: 'First Sortie', episodeNumber: 1, thumbnailId: 'episode-thumb-3', duration: '24m' },
    ],
  },
   {
    slug: 'the-last-spellbinder',
    title: 'The Last Spellbinder',
    description: 'In a world where magic is fading, a girl who can still hear the whispers of ancient spells must find the source before silence consumes all.',
    coverImageId: 'anime-5',
    heroImageId: 'hero-3',
    genres: ['Fantasy', 'Magic', 'Drama'],
    rating: 9.1,
    year: 2021,
    status: 'Finished',
    episodes: [
      { id: 'ep8', slug: 'the-last-spellbinder-ep-1', title: 'An Echo of Magic', episodeNumber: 1, thumbnailId: 'episode-thumb-1', duration: '23m' },
      { id: 'ep9', slug: 'the-last-spellbinder-ep-2', title: 'The Silent Forest', episodeNumber: 2, thumbnailId: 'episode-thumb-4', duration: '24m' },
    ],
  },
  {
    slug: 'tokyo-neon-hustle',
    title: 'Tokyo Neon Hustle',
    description: 'A small-time courier in near-future Tokyo gets entangled in a corporate conspiracy after a delivery goes wrong.',
    coverImageId: 'anime-6',
    heroImageId: 'hero-1',
    genres: ['Cyberpunk', 'Thriller', 'Action'],
    rating: 8.6,
    year: 2023,
    status: 'Airing',
    episodes: [
       { id: 'ep10', slug: 'tokyo-neon-hustle-ep-1', title: 'The Package', episodeNumber: 1, thumbnailId: 'episode-thumb-2', duration: '22m' },
    ],
  },
];

export async function seedDatabase() {
  const animeCollection = collection(firestore, 'animes');

  const q = query(animeCollection);
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error('Database is not empty. Seeding aborted to prevent data overwrite.');
  }

  const batch = writeBatch(firestore);

  animes.forEach(anime => {
    // Firestore will auto-generate an ID for the document
    const docRef = collection(firestore, 'animes').doc();
    batch.set(docRef, anime);
  });

  await batch.commit();

  return { count: animes.length };
}
