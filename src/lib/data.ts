
import { collection, getDocs, query, orderBy, limit, doc, getDoc, OrderByDirection, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase/sdk';
import type { Anime, AnimeSerializable, Episode, EpisodeSerializable } from '@/types/anime';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Converts a Firestore document snapshot to a serializable Anime object.
 * @param doc The document snapshot to convert.
 * @returns A serializable Anime object.
 */
function docToAnimeSerializable(doc: any): AnimeSerializable {
    const data = doc.data() as Anime;
            
    // Convert Firestore Timestamps to serializable strings
    const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
    const updatedAt = (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
    const releaseDate = (data.releaseDate as Timestamp)?.toDate().toISOString() || undefined;

    return {
        id: doc.id,
        title: data.title,
        description: data.description,
        streamUrl: data.streamUrl,
        coverImageUrl: data.coverImageUrl,
        genres: data.genres,
        creator: data.creator,
        rating: data.rating,
        episodes: data.episodes,
        createdAt: createdAt,
        updatedAt: updatedAt,
        releaseDate: releaseDate
    };
}


/**
 * Fetches anime documents from the 'animes' collection in Firestore.
 * This function is designed to be called from Server Components.
 * @param count Optional number of documents to limit.
 * @param sortField Optional field to order by.
 * @param sortDirection Optional direction to order by ('asc' or 'desc').
 * @returns A promise that resolves to an array of serializable anime objects.
 */
export async function getAnimes(
    count?: number,
    sortField: keyof Anime = 'createdAt',
    sortDirection: OrderByDirection = 'desc'
): Promise<AnimeSerializable[]> {
    noStore(); // Opt out of caching for dynamic data
    try {
        const animesCollection = collection(firestore, 'animes');
        let q = query(animesCollection, orderBy(sortField, sortDirection));
        
        if (count) {
            q = query(q, limit(count));
        }
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No animes found in the collection.");
            return [];
        }

        const animes: AnimeSerializable[] = querySnapshot.docs.map(doc => {
            return docToAnimeSerializable(doc);
        });
        
        return animes;

    } catch (error) {
        console.error("Error fetching animes: ", error);
        // In a real app, you might want to throw the error
        // or return a more specific error state.
        return [];
    }
}


/**
 * Fetches a single anime document by its ID from Firestore.
 * @param id The ID of the anime document to fetch.
 * @returns A promise that resolves to a serializable anime object or null if not found.
 */
export async function getAnimeById(id: string): Promise<AnimeSerializable | null> {
    noStore();
    try {
        if (!id) {
            console.log("getAnimeById called with no ID.");
            return null;
        }
        const docRef = doc(firestore, 'animes', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`No anime found with ID: ${id}`);
            return null;
        }

        return docToAnimeSerializable(docSnap);

    } catch (error) {
        console.error(`Error fetching anime with ID ${id}: `, error);
        return null;
    }
}

/**
 * Fetches all episodes for a specific anime.
 * @param animeId The ID of the anime.
 * @returns A promise that resolves to an array of serializable episode objects.
 */
export async function getEpisodesForAnime(animeId: string): Promise<EpisodeSerializable[]> {
    noStore();
    try {
        if (!animeId) return [];

        const episodesCollection = collection(firestore, 'animes', animeId, 'episodes');
        const q = query(episodesCollection, orderBy('episodeNumber', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        const episodes: EpisodeSerializable[] = querySnapshot.docs.map(doc => {
             const data = doc.data() as Episode;
             const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
             return {
                 id: doc.id,
                 animeId: data.animeId,
                 episodeNumber: data.episodeNumber,
                 title: data.title,
                 videoUrl: data.videoUrl,
                 createdAt: createdAt
             };
        });

        return episodes;

    } catch (error) {
        console.error(`Error fetching episodes for anime ${animeId}:`, error);
        return [];
    }
}


/**
 * Fetches a single episode by its ID from an anime's subcollection.
 * @param animeId The ID of the parent anime.
 * @param episodeId The ID of the episode to fetch.
 * @returns A promise that resolves to a serializable episode object or null.
 */
export async function getEpisodeById(animeId: string, episodeId: string): Promise<EpisodeSerializable | null> {
    noStore();
    try {
        if (!animeId || !episodeId) return null;

        const episodeRef = doc(firestore, 'animes', animeId, 'episodes', episodeId);
        const docSnap = await getDoc(episodeRef);

        if (!docSnap.exists()) {
            console.log(`Episode with ID ${episodeId} not found in anime ${animeId}`);
            return null;
        }

        const data = docSnap.data() as Episode;
        const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
        
        return {
            id: docSnap.id,
            animeId: data.animeId,
            episodeNumber: data.episodeNumber,
            title: data.title,
            videoUrl: data.videoUrl,
            createdAt: createdAt,
        };

    } catch (error) {
        console.error(`Error fetching episode ${episodeId} for anime ${animeId}: `, error);
        return null;
    }
}
