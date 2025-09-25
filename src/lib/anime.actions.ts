
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminApp } from './firebase/admin-sdk';
import type { Anime, AnimeFormData, AnimeUpdateFormData } from '@/types/anime';
import { revalidatePath } from 'next/cache';
import { uploadAnimeCover } from './firebase/storage';

const firestore = getFirestore(adminApp);

/**
 * Adds a new anime document to Firestore using the Admin SDK.
 * This is a Server Action and should only be called from the server-side.
 * It now also creates a default "Episode 1" for the new anime.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: FormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const streamUrl = formData.get('streamUrl') as string;
  const genres = formData.get('genres') as string;
  const rating = formData.get('rating') as string | null;
  const releaseDateStr = formData.get('releaseDate') as string | null;
  
  const coverImageUrl = formData.get('coverImageUrl') as string | null;
  const coverImageFile = formData.get('coverImageFile') as File | null;
  const uploadMethod = formData.get('coverImageUploadMethod') as 'url' | 'upload';

  if (!title || !description || !streamUrl || !genres) {
    return { success: false, error: 'Missing required fields. Please fill out all parts of the form.' };
  }

  if (uploadMethod === 'url' && !coverImageUrl) {
    return { success: false, error: 'Cover Image URL is required when using URL method.' };
  }
  if (uploadMethod === 'upload' && (!coverImageFile || coverImageFile.size === 0)) {
    return { success: false, error: 'Cover Image File is required when using upload method.' };
  }
  
  const batch = firestore.batch();

  const animeRef = firestore.collection('animes').doc();
  let finalCoverImageUrl: string;

  try {
    if (uploadMethod === 'upload' && coverImageFile) {
      finalCoverImageUrl = await uploadAnimeCover(animeRef.id, coverImageFile);
    } else if (coverImageUrl) {
      finalCoverImageUrl = coverImageUrl;
    } else {
      return { success: false, error: 'No cover image provided.' };
    }

    const ratingNum = rating ? parseFloat(rating) : 0;
    if (rating && isNaN(ratingNum)) {
        return { success: false, error: 'Invalid number for rating.' };
    }
    
    const releaseDate = releaseDateStr ? Timestamp.fromDate(new Date(releaseDateStr)) : FieldValue.serverTimestamp();

    const animeData: Omit<Anime, 'id'> = {
      title,
      description,
      streamUrl,
      coverImageUrl: finalCoverImageUrl,
      genres: genres.split(',').map(g => g.trim()),
      rating: ratingNum,
      episodes: 1, // Default to 1 episode on creation
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      releaseDate: releaseDate,
    };
    
    batch.set(animeRef, animeData);

    const firstEpisodeRef = animeRef.collection('episodes').doc();
    const firstEpisodeData = {
        animeId: animeRef.id,
        episodeNumber: 1,
        title: "Episode 1",
        videoUrl: streamUrl,
        createdAt: FieldValue.serverTimestamp(),
    };
    batch.set(firstEpisodeRef, firstEpisodeData);

    await batch.commit();
    
    revalidatePath('/admin-panel');
    revalidatePath('/');
    
    return { success: true, docId: animeRef.id };

  } catch (error: any) {
    console.error('Error adding document to Firestore: ', error);
    return { success: false, error: `Failed to save data: ${error.message}` };
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
        const animeEpisodesQuery = firestore.collection('animes').doc(animeId).collection('episodes');
        const episodesSnapshot = await animeEpisodesQuery.get();
        const batch = firestore.batch();
        episodesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        await firestore.collection('animes').doc(animeId).delete();
        
        revalidatePath('/admin-panel');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting anime ${animeId}:`, error);
        return { success: false, error: `Failed to delete anime: ${error.message}` };
    }
}
