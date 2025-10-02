
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase/admin-sdk';
import type { Anime, AnimeRating } from '@/types/anime';
import { revalidatePath } from 'next/cache';
import { uploadAnimeCover } from './firebase/storage';

const firestore = getFirestore(getAdminApp());

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
  const rating = formData.get('rating') as AnimeRating | null;
  const releaseDateStr = formData.get('releaseDate') as string | null;
  
  const coverImageUrl = formData.get('coverImageUrl') as string | null;
  const coverImageFile = formData.get('coverImageFile') as File | null;
  const uploadMethod = formData.get('coverImageUploadMethod') as 'url' | 'upload';

  const creatorName = formData.get('creatorName') as string | null;
  const creatorYoutube = formData.get('creatorYoutube') as string | null;
  const creatorInstagram = formData.get('creatorInstagram') as string | null;
  const creatorTwitter = formData.get('creatorTwitter') as string | null;
  const creatorFacebook = formData.get('creatorFacebook') as string | null;


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
    
    const releaseDate = releaseDateStr ? Timestamp.fromDate(new Date(releaseDateStr)) : FieldValue.serverTimestamp();

    const animeData: Omit<Anime, 'id'> = {
      title,
      description,
      streamUrl,
      coverImageUrl: finalCoverImageUrl,
      genres: genres.split(',').map(g => g.trim()),
      rating: rating || 'G',
      episodes: 1, // Default to 1 episode on creation
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      releaseDate: releaseDate,
      views: 0,
      likes: 0,
      dislikes: 0,
    };

    if (creatorName) {
        animeData.creator = {
            name: creatorName,
            socials: {
                ...(creatorYoutube && { youtube: creatorYoutube }),
                ...(creatorInstagram && { instagram: creatorInstagram }),
                ...(creatorTwitter && { twitter: creatorTwitter }),
                ...(creatorFacebook && { facebook: creatorFacebook }),
            }
        }
    }
    
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
export async function updateAnime(animeId: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  if (!animeId) {
    return { success: false, error: 'Anime ID is required for an update.' };
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const streamUrl = formData.get('streamUrl') as string;
  const genres = formData.get('genres') as string;
  const rating = formData.get('rating') as AnimeRating | null;
  const releaseDateStr = formData.get('releaseDate') as string | null;
  
  const coverImageUploadMethod = formData.get('coverImageUploadMethod') as 'url' | 'upload';
  const coverImageUrl = formData.get('coverImageUrl') as string | null;
  const coverImageFile = formData.get('coverImageFile') as File | null;

  const creatorName = formData.get('creatorName') as string | null;
  const creatorYoutube = formData.get('creatorYoutube') as string | null;
  const creatorInstagram = formData.get('creatorInstagram') as string | null;
  const creatorTwitter = formData.get('creatorTwitter') as string | null;
  const creatorFacebook = formData.get('creatorFacebook') as string | null;


  if (!title || !description || !streamUrl || !genres) {
    return { success: false, error: 'Title, description, stream URL and genres are required.' };
  }

  try {
    const animeRef = firestore.collection('animes').doc(animeId);
    const updateData: { [key: string]: any } = {
        updatedAt: FieldValue.serverTimestamp(),
    };
    
    // Simple fields
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (streamUrl) updateData.streamUrl = streamUrl;
    if (genres) updateData.genres = genres.split(',').map(g => g.trim());

    // Optional fields
    if (rating) {
        updateData.rating = rating;
    }
    if (releaseDateStr) {
        updateData.releaseDate = Timestamp.fromDate(new Date(releaseDateStr));
    }

    // Handle cover image
    if (coverImageUploadMethod === 'upload' && coverImageFile && coverImageFile.size > 0) {
        updateData.coverImageUrl = await uploadAnimeCover(animeId, coverImageFile);
    } else if (coverImageUploadMethod === 'url' && coverImageUrl) {
        updateData.coverImageUrl = coverImageUrl;
    }

    // Handle creator info
    if (creatorName) {
        updateData['creator.name'] = creatorName;
        updateData['creator.socials.youtube'] = creatorYoutube || FieldValue.delete();
        updateData['creator.socials.instagram'] = creatorInstagram || FieldValue.delete();
        updateData['creator.socials.twitter'] = creatorTwitter || FieldValue.delete();
        updateData['creator.socials.facebook'] = creatorFacebook || FieldValue.delete();
    } else {
        // If creator name is removed, delete the whole creator object
        updateData.creator = FieldValue.delete();
    }
    
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

/**
 * Increments the view count for a specific anime.
 * @param animeId The ID of the anime to update.
 */
export async function incrementAnimeViews(animeId: string): Promise<void> {
  if (!animeId) return;
  const animeRef = firestore.collection('animes').doc(animeId);
  try {
    await animeRef.update({ views: FieldValue.increment(1) });
    // No need to revalidate here as it's a non-critical counter update
  } catch (error) {
    console.error(`Error incrementing views for anime ${animeId}:`, error);
    // Fail silently, not critical for user experience
  }
}

/**
 * Increments the like count for a specific anime.
 * @param animeId The ID of the anime to update.
 */
export async function likeAnime(animeId: string): Promise<void> {
  if (!animeId) return;
  const animeRef = firestore.collection('animes').doc(animeId);
  try {
    await animeRef.update({ likes: FieldValue.increment(1) });
    revalidatePath(`/watch/${animeId}`); // Revalidate the page to show new count
  } catch (error) {
    console.error(`Error liking anime ${animeId}:`, error);
    // Fail silently
  }
}

/**
 * Increments the dislike count for a specific anime.
 * @param animeId The ID of the anime to update.
 */
export async function dislikeAnime(animeId: string): Promise<void> {
  if (!animeId) return;
  const animeRef = firestore.collection('animes').doc(animeId);
  try {
    await animeRef.update({ dislikes: FieldValue.increment(1) });
    revalidatePath(`/watch/${animeId}`); // Revalidate the page to show new count
  } catch (error) {
    console.error(`Error disliking anime ${animeId}:`, error);
    // Fail silently
  }
}
