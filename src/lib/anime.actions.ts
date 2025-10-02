
'use server';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { FirebaseAdminInitializationError, getAdminApp } from './firebase/admin-sdk';
import type { Anime, AnimeRating, UserInteraction } from '@/types/anime';
import { revalidatePath } from 'next/cache';
import { uploadAnimeCover } from './firebase/storage';
import { getAuth } from 'firebase-admin/auth';
import type { Auth } from 'firebase-admin/auth';


let firestore: Firestore | null = null;
let auth: Auth | null = null;

function getFirestoreInstance(): Firestore | null {
  if (firestore) {
    return firestore;
  }

  try {
    firestore = getFirestore(getAdminApp());
    return firestore;
  } catch (error) {
    if (error instanceof FirebaseAdminInitializationError) {
      console.warn('[firebase-admin] Firestore is not available:', error.message);
      return null;
    }
    throw error;
  }
}

function getAuthInstance(): Auth | null {
  if (auth) {
    return auth;
  }

  try {
    auth = getAuth(getAdminApp());
    return auth;
  } catch (error) {
    if (error instanceof FirebaseAdminInitializationError) {
      console.warn('[firebase-admin] Auth is not available:', error.message);
      return null;
    }
    throw error;
  }
}

const FIREBASE_CONFIG_ERROR = 'Firebase Admin SDK is not configured. Please set the required environment variables.';

/**
 * Adds a new anime document to Firestore using the Admin SDK.
 * This is a Server Action and should only be called from the server-side.
 * It now also creates a default "Episode 1" for the new anime.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: FormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  const firestore = getFirestoreInstance();

  if (!firestore) {
    return { success: false, error: FIREBASE_CONFIG_ERROR };
  }

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

  const firestore = getFirestoreInstance();
  if (!firestore) {
    return { success: false, error: FIREBASE_CONFIG_ERROR };
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

    const firestore = getFirestoreInstance();
    if (!firestore) {
        return { success: false, error: FIREBASE_CONFIG_ERROR };
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
 * Increments the view count for an anime if it hasn't been viewed by the user recently.
 * @param animeId The ID of the anime.
 * @param userId The ID of the user.
 */
export async function incrementAnimeViews(animeId: string, userId: string): Promise<void> {
  if (!animeId || !userId) return;

  const firestore = getFirestoreInstance();
  if (!firestore) {
    console.warn('[firebase-admin] Skipping view increment because Firestore is not available.');
    return;
  }

  const interactionRef = firestore.collection('animes').doc(animeId).collection('interactions').doc(userId);
  const animeRef = firestore.collection('animes').doc(animeId);
  const viewCooldown = 60 * 60 * 1000; // 1 hour in milliseconds

  try {
    await firestore.runTransaction(async (transaction) => {
      const interactionDoc = await transaction.get(interactionRef);
      const now = Timestamp.now();

      if (interactionDoc.exists) {
        const data = interactionDoc.data() as UserInteraction;
        const lastViewed = data.lastViewed as Timestamp | undefined;
        
        if (lastViewed && (now.toMillis() - lastViewed.toMillis()) < viewCooldown) {
          // Cooldown active, don't increment views
          return;
        }
        // Cooldown expired, update lastViewed
        transaction.update(interactionRef, { lastViewed: now });
      } else {
        // First interaction, set lastViewed
        transaction.set(interactionRef, { lastViewed: now }, { merge: true });
      }

      // If we got this far, increment views
      transaction.update(animeRef, { views: FieldValue.increment(1) });
    });
    revalidatePath(`/watch/${animeId}`);
  } catch (error) {
    console.error(`Error incrementing views for anime ${animeId}:`, error);
  }
}

/**
 * Handles a user's vote (like or dislike) on an anime.
 * @param animeId The ID of the anime being voted on.
 * @param newVote The new vote type, 'like' or 'dislike'.
 * @param idToken The user's ID token for authentication.
 */
export async function voteOnAnime(animeId: string, newVote: 'like' | 'dislike', idToken: string): Promise<{success: boolean, error?: string}> {
  const firestore = getFirestoreInstance();
  const auth = getAuthInstance();

  if (!firestore || !auth) {
    return { success: false, error: FIREBASE_CONFIG_ERROR };
  }

  let userId: string;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    userId = decodedToken.uid;
  } catch (error) {
    console.error("Invalid ID Token:", error);
    return { success: false, error: 'User not authenticated.' };
  }

  const animeRef = firestore.collection('animes').doc(animeId);
  const interactionRef = firestore.collection('animes').doc(animeId).collection('interactions').doc(userId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const interactionDoc = await transaction.get(interactionRef);
      const currentVote = interactionDoc.exists ? (interactionDoc.data() as UserInteraction).vote : null;

      const updates: { [key: string]: FieldValue } = {};
      let finalVote: 'like' | 'dislike' | null = newVote;

      if (currentVote === newVote) {
        // User is undoing their vote
        updates[`${newVote}s`] = FieldValue.increment(-1);
        finalVote = null; // Clear the vote
      } else {
        // New vote or changing vote
        updates[`${newVote}s`] = FieldValue.increment(1);
        if (currentVote) {
          // Changing vote, so decrement the old one
          updates[`${currentVote}s`] = FieldValue.increment(-1);
        }
      }

      // Update the anime document with new like/dislike counts
      transaction.update(animeRef, updates);
      
      // Update the user's interaction document
      transaction.set(interactionRef, { vote: finalVote }, { merge: true });
    });

    revalidatePath(`/watch/${animeId}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Error processing vote for anime ${animeId}:`, error);
    return { success: false, error: 'Failed to process vote.' };
  }
}
