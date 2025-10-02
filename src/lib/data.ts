
'use server';

import { getFirestore, Timestamp, FieldValue, OrderByDirection } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase/admin-sdk';
import type { Anime, AnimeSerializable, Episode, EpisodeSerializable, UserInteraction, UserInteractionSerializable } from '@/types/anime';

// Use the Admin SDK's firestore instance
const firestore = getFirestore(getAdminApp());

/**
 * Converts a Firestore document snapshot from the Admin SDK to a serializable Anime object.
 * @param doc The document snapshot to convert.
 * @returns A serializable Anime object.
 */
function docToAnimeSerializable(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): AnimeSerializable {
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
        releaseDate: releaseDate,
        views: data.views || 0,
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
    };
}


/**
 * Fetches anime documents from the 'animes' collection in Firestore using the Admin SDK.
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
    const animesCollection = firestore.collection('animes');
    let q: FirebaseFirestore.Query = animesCollection.orderBy(sortField, sortDirection);
    
    if (count) {
        q = q.limit(count);
    }
    
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return [];
    }

    const animes: AnimeSerializable[] = querySnapshot.docs.map(doc => {
        return docToAnimeSerializable(doc);
    });
    
    return animes;
}


/**
 * Fetches a single anime document by its ID from Firestore using the Admin SDK.
 * @param id The ID of the anime document to fetch.
 * @returns A promise that resolves to a serializable anime object or null if not found.
 */
export async function getAnimeById(id: string): Promise<AnimeSerializable | null> {
    if (!id) {
        return null;
    }
    const docRef = firestore.collection('animes').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return null;
    }

    return docToAnimeSerializable(docSnap);
}

/**
 * Fetches all episodes for a specific anime using the Admin SDK.
 * @param animeId The ID of the anime.
 * @returns A promise that resolves to an array of serializable episode objects.
 */
export async function getEpisodesForAnime(animeId: string): Promise<EpisodeSerializable[]> {
    if (!animeId) return [];

    const episodesCollection = firestore.collection('animes').doc(animeId).collection('episodes');
    const q = episodesCollection.orderBy('episodeNumber', 'asc');
    const querySnapshot = await q.get();

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
}


/**
 * Fetches a single episode by its ID from an anime's subcollection using the Admin SDK.
 * @param animeId The ID of the parent anime.
 * @param episodeId The ID of the episode to fetch.
 * @returns A promise that resolves to a serializable episode object or null.
 */
export async function getEpisodeById(animeId: string, episodeId: string): Promise<EpisodeSerializable | null> {
    if (!animeId || !episodeId) return null;

    const episodeRef = firestore.collection('animes').doc(animeId).collection('episodes').doc(episodeId);
    const docSnap = await episodeRef.get();

    if (!docSnap.exists) {
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
}

/**
 * Fetches the interaction data for a specific user and anime.
 * @param animeId The ID of the anime.
 * @param userId The ID of the user.
 * @returns A promise resolving to the user's interaction data or null if not found.
 */
export async function getUserInteraction(animeId: string, userId: string): Promise<UserInteractionSerializable | null> {
    if (!animeId || !userId) {
        return null;
    }
    const interactionRef = firestore.collection('animes').doc(animeId).collection('interactions').doc(userId);
    const docSnap = await interactionRef.get();

    if (!docSnap.exists) {
        return null;
    }

    const data = docSnap.data() as UserInteraction;
    
    return {
        vote: data.vote || null,
        lastViewed: (data.lastViewed as Timestamp)?.toDate().toISOString() || null,
    };
}
