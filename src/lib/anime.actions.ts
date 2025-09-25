
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminApp } from './firebase/admin-sdk';
import type { Anime, AnimeFormData, AnimeUpdateFormData } from '@/types/anime';
import { revalidatePath } from 'next/cache';

const firestore = getFirestore(adminApp);

/**
 * Adds a new anime document to Firestore using the Admin SDK.
 * This is a Server Action and should only be called from the server-side.
 * It now also creates a default "Episode 1" for the new anime.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: AnimeFormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  
  const { title, description, streamUrl, coverImageUrl, genres, rating, releaseDate } = formData;

  if (!title || !description || !streamUrl || !coverImageUrl || !genres) {
    return { success: false, error: 'Missing required fields. Please fill out all parts of the form.' };
  }

  const batch = firestore.batch();

  // 1. Create a reference for the new anime document
  const animeRef = firestore.collection('animes').doc();

  // 2. Prepare the anime data
  let animeData: Omit<Anime, 'id'>;
  try {
    const ratingNum = rating ? parseFloat(rating) : 0;

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
      episodes: 1, // Default to 1 episode on creation
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      releaseDate: releaseDate ? Timestamp.fromDate(releaseDate) : FieldValue.serverTimestamp(),
    };

  } catch (error: any) {
      console.error('Error preparing data for Firestore: ', error);
      return { success: false, error: `Failed to prepare data: ${error.message}`};
  }
  
  batch.set(animeRef, animeData);

  // 3. Create a default "Episode 1" in a subcollection
  const firstEpisodeRef = animeRef.collection('episodes').doc();
  const firstEpisodeData = {
      animeId: animeRef.id,
      episodeNumber: 1,
      title: "Episode 1", // Default title
      videoUrl: streamUrl, // Use the main stream URL for the first episode
      createdAt: FieldValue.serverTimestamp(),
  };
  batch.set(firstEpisodeRef, firstEpisodeData);


  // 4. Commit the batch transaction
  try {
    console.log('Attempting to add anime and first episode in a batch transaction...');
    await batch.commit();
    console.log('Document written with ID: ', animeRef.id);
    
    revalidatePath('/admin-panel'); // Revalidate the admin page to show the new anime
    revalidatePath('/'); // Revalidate the home page
    
    return { success: true, docId: animeRef.id };
  } catch (error: any) {
    console.error('Error adding document to Firestore with Admin SDK: ', error);
    return { success: false, error: `Failed to save data to database: ${error.message}` };
  }
}

/**
 * Updates an existing anime document in Firestore.
 * @param animeId The ID of the anime to update.
 * @param formData The form data with the updated values.
 * @returns An object indicating success or failure.
 */
export async function updateAnime(animeId: string, formData: AnimeUpdateFormData): Promise<{ success: boolean; error?: string }> {
  if (!animeId) {
    return { success: false, error: 'Anime ID is required for an update.' };
  }

  const { title, description, coverImageUrl } = formData;

  if (!title || !description || !coverImageUrl) {
    return { success: false, error: 'Title, description, and cover image URL are required.' };
  }

  try {
    const animeRef = firestore.collection('animes').doc(animeId);

    const updateData = {
      title,
      description,
      coverImageUrl,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await animeRef.update(updateData);

    // Revalidate paths to reflect changes across the site
    revalidatePath('/admin-panel');
    revalidatePath(`/admin-panel/edit/${animeId}`);
    revalidatePath('/');
    revalidatePath(`/watch/${animeId}`);

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating anime ${animeId}:`, error);
    return { success: false, error: `Failed to update anime: ${error.message}` };
  }
}


/**
 * Deletes an anime document from Firestore.
 * @param animeId The ID of the anime to delete.
 * @returns An object indicating success or failure.
 */
export async function deleteAnime(animeId: string): Promise<{ success: boolean; error?: string }> {
    if (!animeId) {
        return { success: false, error: 'Anime ID is required.' };
    }
    try {
        await firestore.collection('animes').doc(animeId).delete();
        revalidatePath('/admin-panel'); // Revalidate the admin page
        revalidatePath('/'); // Revalidate the home page
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting anime ${animeId}:`, error);
        return { success: false, error: `Failed to delete anime: ${error.message}` };
    }
}
