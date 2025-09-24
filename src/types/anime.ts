
import type { FieldValue, Timestamp } from 'firebase/firestore';

// Type for data coming from/going to Firestore
export interface Anime {
    id: string;
    title: string;
    description: string;
    streamUrl: string;
    coverImageUrl: string;
    genres: string[];
    rating?: number;
    episodes: number;
    createdAt: FieldValue | Timestamp;
    updatedAt: FieldValue | Timestamp;
    releaseDate?: FieldValue | Timestamp;
}

// Type for data used in client components (serializable)
export interface AnimeSerializable extends Omit<Anime, 'createdAt' | 'updatedAt' | 'releaseDate'> {
    createdAt: string;
    updatedAt: string;
    releaseDate?: string;
}


export interface AnimeFormData {
    title: string;
    description: string;
    streamUrl: string;
    coverImageUrl: string;
    genres: string;
    rating?: string;
    episodes: string;
    releaseDate?: Date;
}
