import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { firestore } from './sdk';
import type { Anime } from '@/lib/types';

// Helper function to convert Firestore doc to Anime type
const toAnime = (doc: any): Anime => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as Anime;
};

// Fetch all animes
export async function getAnimes(count?: number): Promise<Anime[]> {
    const animeCollection = collection(firestore, 'animes');
    const q = count ? query(animeCollection, limit(count)) : query(animeCollection);
    const animeSnapshot = await getDocs(q);
    return animeSnapshot.docs.map(toAnime);
}


// Fetch a single anime by its slug
export async function getAnimeBySlug(slug: string): Promise<Anime | null> {
    const q = query(collection(firestore, 'animes'), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    return toAnime(querySnapshot.docs[0]);
}

// Fetch all anime slugs for generating static paths
export async function getAllAnimeSlugs(): Promise<string[]> {
    const animeSnapshot = await getDocs(collection(firestore, 'animes'));
    return animeSnapshot.docs.map(doc => doc.data().slug);
}

// Fetch featured anime (e.g., the first one for simplicity)
export async function getFeaturedAnime(): Promise<Anime | null> {
    const animes = await getAnimes(1);
    return animes[0] || null;
}

// Fetch trending anime (e.g., latest year, limited count)
export async function getTrendingAnime(count: number): Promise<Anime[]> {
    const q = query(collection(firestore, 'animes'), orderBy('year', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(toAnime);
}

// Fetch popular anime (e.g., highest rated, limited count)
export async function getPopularAnime(count: number): Promise<Anime[]> {
    const q = query(collection(firestore, 'animes'), orderBy('rating', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(toAnime);
}
