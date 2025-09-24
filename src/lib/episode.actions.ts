
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminApp } from './firebase/admin-sdk';
import type { EpisodeFormData } from '@/types/anime';
import { revalidatePath } from 'next/cache';

const firestore = getFirestore(adminApp);

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
