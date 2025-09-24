
import { collection, getDocs, query, where, limit, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { firestore } from './sdk';
import type { Anime, AnimeSerializable } from '@/types/anime';

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
        rating: data.rating,
        episodes: data.episodes,
        createdAt: createdAt,
        updatedAt: updatedAt,
        releaseDate: releaseDate
    };
}
