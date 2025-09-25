
import { collection, getDocs, query, where, limit, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { firestore } from './sdk';
import type { Anime, AnimeSerializable, Episode, EpisodeSerializable } from '@/types/anime';

/**
 * Fetches all anime documents from the 'animes' collection in Firestore,
 * ordered by creation date.
 * @returns A promise that resolves to an array of serializable anime objects.
 */
export async function getAnimes(count?: number): Promise<AnimeSerializable[]> {
    try {
        const animesCollection = collection(firestore, 'animes');
        let q = query(animesCollection, orderBy('createdAt', 'desc'));
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
        return [];
    }
}


/**
 * Fetches a single anime document by its ID from Firestore.
 * @param id The ID of the anime document to fetch.
 * @returns A promise that resolves to a serializable anime object or null if not found.
 */
export async function getAnimeById(id: string): Promise<AnimeSerializable | null> {
    try {
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
    try {
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
    try {
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
