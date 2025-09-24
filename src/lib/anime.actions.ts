
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase/sdk';
import type { Anime, AnimeFormData } from '@/types/anime';


/**
 * Adds a new anime document to Firestore.
 * This is a Server Action and should only be called from the server-side.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: AnimeFormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  
  const { title, description, streamUrl, coverImageUrl, genres, episodes, rating } = formData;

  if (!title || !description || !streamUrl || !coverImageUrl || !genres || !episodes) {
    return { success: false, error: 'Missing required fields. Please fill out all parts of the form.' };
  }

  // 1. Prepare the data for Firestore
  let animeData: Omit<Anime, 'id'>;
  try {
    const episodesNum = parseInt(episodes, 10);
    const ratingNum = rating ? parseFloat(rating) : 0;

    if (isNaN(episodesNum) || episodesNum <= 0) {
        return { success: false, error: 'Invalid number for episodes. Must be a positive number.' };
    }
    if (rating && isNaN(ratingNum)) {
        return { success: false, error: 'Invalid number for rating.' };
    }

    animeData = {
      title,
      description,
      streamUrl,
      coverImageUrl,
      genres: genres.split(',').map(g => g.trim()),
      rating: ratingNum,
      episodes: episodesNum,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

  } catch (error: any) {
      console.error('Error preparing data for Firestore: ', error);
      return { success: false, error: `Failed to prepare data: ${error.message}`};
  }

  // 2. Add the document to the 'animes' collection in Firestore
  try {
    const docRef = await addDoc(collection(firestore, 'animes'), animeData);
    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error('Error adding document to Firestore: ', error);
    // This is a generic error message, but the new security rules might be the cause.
    // The developer needs to check the Firestore rules and user's custom claims.
    if (error.code === 'permission-denied') {
        return { success: false, error: 'Permission denied. Make sure you are an admin and the Firestore security rules are configured correctly.' };
    }
    return { success: false, error: `Failed to save data to database: ${error.message}` };
  }
}
