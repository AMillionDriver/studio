
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase/admin-sdk';
import type { EpisodeFormData, EpisodeUpdateFormData } from '@/types/anime';
import { revalidatePath } from 'next/cache';

const firestore = getFirestore(getAdminApp());

/**
 * Adds a new episode to an anime's subcollection in Firestore.
 * @param animeId The ID of the parent anime.
 * @param formData The form data for the new episode.
 * @returns An object indicating success or failure.
 */
export async function addEpisodeToAnime(
  animeId: string,
  formData: EpisodeFormData
): Promise<{ success: boolean; error?: string }> {
  const { episodeNumber, title, videoUrl } = formData;

  if (!animeId || !episodeNumber || !title || !videoUrl) {
    return { success: false, error: 'Missing required fields.' };
  }

  const episodeNum = parseInt(episodeNumber, 10);
  if (isNaN(episodeNum) || episodeNum <= 0) {
    return { success: false, error: 'Episode number must be a positive integer.' };
  }

  const batch = firestore.batch();

  // 1. Reference to the new episode document in the subcollection
  const episodeRef = firestore.collection('animes').doc(animeId).collection('episodes').doc();

  // 2. Data for the new episode
  const newEpisodeData = {
    animeId,
    episodeNumber: episodeNum,
    title,
    videoUrl,
    createdAt: FieldValue.serverTimestamp(),
  };

  batch.set(episodeRef, newEpisodeData);

  // 3. Reference to the parent anime document
  const animeRef = firestore.collection('animes').doc(animeId);
  
  // 4. Update the `episodes` count on the parent anime document
  // We use `FieldValue.increment` to safely increase the count.
  batch.update(animeRef, { 
    episodes: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  try {
    await batch.commit();
    console.log(`Successfully added episode to anime ${animeId}`);

    // Revalidate relevant paths
    revalidatePath(`/admin-panel/add-episode/${animeId}`);
    revalidatePath(`/watch/${animeId}`);
    revalidatePath(`/admin-panel`); // To update episode count in the list

    return { success: true };
  } catch (error: any) {
    console.error(`Error adding episode to anime ${animeId}:`, error);
    return { success: false, error: `Failed to save episode: ${error.message}` };
  }
}

/**
 * Updates an existing episode document in Firestore.
 * @param animeId The ID of the parent anime.
 * @param episodeId The ID of the episode to update.
 * @param formData The updated form data.
 * @returns An object indicating success or failure.
 */
export async function updateEpisode(
    animeId: string,
    episodeId: string,
    formData: EpisodeUpdateFormData
): Promise<{ success: boolean; error?: string }> {
    const { title, videoUrl } = formData;

    if (!animeId || !episodeId || !title || !videoUrl) {
        return { success: false, error: 'Missing required fields for update.' };
    }

    try {
        const episodeRef = firestore.collection('animes').doc(animeId).collection('episodes').doc(episodeId);

        await episodeRef.update({
            title,
            videoUrl,
        });

        // Revalidate the pages where this episode's data might be displayed
        revalidatePath(`/admin-panel/add-episode/${animeId}`);
        revalidatePath(`/admin-panel`);
        revalidatePath(`/watch/${animeId}`);

        return { success: true };
    } catch (error: any) {
        console.error(`Error updating episode ${episodeId} in anime ${animeId}:`, error);
        return { success: false, error: `Failed to update episode: ${error.message}` };
    }
}


/**
 * Deletes an episode from an anime's subcollection and decrements the episode count.
 * @param animeId The ID of the parent anime.
 * @param episodeId The ID of the episode to delete.
 * @returns An object indicating success or failure.
 */
export async function deleteEpisode(
    animeId: string,
    episodeId: string
): Promise<{ success: boolean; error?: string }> {
    if (!animeId || !episodeId) {
        return { success: false, error: 'Anime ID and Episode ID are required.' };
    }

    const batch = firestore.batch();

    // 1. Reference to the episode to be deleted
    const episodeRef = firestore.collection('animes').doc(animeId).collection('episodes').doc(episodeId);
    batch.delete(episodeRef);

    // 2. Reference to the parent anime document
    const animeRef = firestore.collection('animes').doc(animeId);
    // 3. Decrement the episodes count
    batch.update(animeRef, {
        episodes: FieldValue.increment(-1),
        updatedAt: FieldValue.serverTimestamp(),
    });

    try {
        await batch.commit();
        console.log(`Successfully deleted episode ${episodeId} from anime ${animeId}`);

        // Revalidate paths to reflect the change
        revalidatePath(`/admin-panel/add-episode/${animeId}`);
        revalidatePath('/admin-panel');
        revalidatePath(`/watch/${animeId}`);
        
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting episode ${episodeId}:`, error);
        return { success: false, error: `Failed to delete episode: ${error.message}` };
    }
}
