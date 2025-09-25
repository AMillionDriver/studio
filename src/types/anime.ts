
import type { FieldValue, Timestamp } from 'firebase/firestore';

export interface Creator {
    name: string;
    socials: {
        youtube?: string;
        instagram?: string;
        twitter?: string;
        facebook?: string;
    };
}

// Type for data coming from/going to Firestore
export interface Anime {
    id: string;
    title: string;
    description: string;
    streamUrl: string;
    coverImageUrl: string;
    genres: string[];
    creator?: Creator;
    rating?: number;
    episodes: number; // This will now represent the total number of episodes
    createdAt: FieldValue | Timestamp;
    updatedAt: FieldValue | Timestamp;
    releaseDate?: FieldValue | Timestamp;
}

// Type for a single episode document
export interface Episode {
    id: string;
    animeId: string;
    episodeNumber: number;
    title: string;
    videoUrl: string;
    createdAt: FieldValue | Timestamp;
}


// Type for data used in client components (serializable)
export interface AnimeSerializable extends Omit<Anime, 'createdAt' | 'updatedAt' | 'releaseDate'> {
    createdAt: string;
    updatedAt: string;
    releaseDate?: string;
}

export interface EpisodeSerializable extends Omit<Episode, 'createdAt'> {
    createdAt: string;
}


export interface AnimeFormData {
    title: string;
    description: string;
    streamUrl: string;
    genres: string;
    rating?: string;
    releaseDate?: Date;
    coverImageUploadMethod: 'url' | 'upload';
    coverImageUrl?: string;
    coverImageFile?: FileList;
    creatorName?: string;
    creatorYoutube?: string;
    creatorInstagram?: string;
    creatorTwitter?: string;
    creatorFacebook?: string;
}

export interface EpisodeFormData {
    episodeNumber: string;
    title: string;
    videoUrl: string;
}

export interface AnimeUpdateFormData {
    title: string;
    description: string;
    streamUrl: string;
    genres: string;

    rating?: string;
    releaseDate?: Date;

    // Fields for creator
    creatorName?: string;
    creatorYoutube?: string;
    creatorInstagram?: string;
    creatorTwitter?: string;
    creatorFacebook?: string;

    // Fields for cover image update
    coverImageUploadMethod: 'url' | 'upload';
    coverImageUrl?: string;
    coverImageFile?: FileList;
}

export interface EpisodeUpdateFormData {
    title: string;
    videoUrl: string;
}
