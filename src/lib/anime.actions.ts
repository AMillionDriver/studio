
'use server';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { adminApp } from './firebase/admin-sdk';
import type { Anime, AnimeFormData } from '@/types/anime';

const firestore = getFirestore(adminApp);

/**
 * Adds a new anime document to Firestore using the Admin SDK.
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

  } catch (error: any) {
      console.error('Error preparing data for Firestore: ', error);
      return { success: false, error: `Failed to prepare data: ${error.message}`};
  }

  // 2. Add the document to the 'animes' collection in Firestore
  try {
    console.log('Attempting to add document with data using Admin SDK:', animeData);
    const docRef = await firestore.collection('animes').add(animeData);
    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error('Error adding document to Firestore with Admin SDK: ', error);
    return { success: false, error: `Failed to save data to database: ${error.message}` };
  }
}
