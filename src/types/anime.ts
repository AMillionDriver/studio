
import type { FieldValue } from 'firebase/firestore';

export interface Anime {
    id: string;
    title: string;
    description: string;
    streamUrl: string;
    coverImageUrl: string;
    genres: string[];
    rating?: number;
    episodes: number;
    createdAt: FieldValue;
    updatedAt: FieldValue;
}

export interface AnimeFormData {
    title: string;
    description: string;
    streamUrl: string;
    coverImageUrl: string;
    genres: string;
    rating?: string;
    episodes: string;
}
