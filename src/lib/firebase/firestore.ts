
import { collection, getDocs, query, where, limit, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from './sdk';
import type { Anime, AnimeSerializable } from '@/types/anime';

/**
 * Fetches all anime documents from the 'animes' collection in Firestore,
 * ordered by creation date.
 * @returns A promise that resolves to an array of serializable anime objects.
 */
export async function getAnimes(): Promise<AnimeSerializable[]> {
    try {
        const animesCollection = collection(firestore, 'animes');
        const q = query(animesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No animes found in the collection.");
            return [];
        }

        const animes: AnimeSerializable[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as Anime;
            
            // Convert Firestore Timestamps to serializable strings
            const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
            const updatedAt = (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();

            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                streamUrl: data.streamUrl,
                coverImageUrl: data.coverImageUrl,
                genres: data.genres,
                rating: data.rating,
                episodes: data.episodes,
                createdAt: createdAt,
                updatedAt: updatedAt,
            };
        });
        
        return animes;

    } catch (error) {
        console.error("Error fetching animes: ", error);
        // In case of an error, return an empty array to prevent the page from crashing.
        return [];
    }
}
