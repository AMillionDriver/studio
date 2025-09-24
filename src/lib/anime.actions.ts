
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase/sdk';
import type { Anime } from '@/types/anime';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in storage to upload the file to.
 * @returns The download URL of the uploaded file.
 */
async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  return getDownloadURL(snapshot.ref);
}

/**
 * Adds a new anime document to Firestore and uploads its cover image to Storage.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: FormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  try {
    const coverImage = formData.get('coverImage') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const streamUrl = formData.get('streamUrl') as string;
    const genres = formData.get('genres') as string;
    const episodes = formData.get('episodes') as string;
    const rating = formData.get('rating') as string | null;

    if (!coverImage || !title || !description || !streamUrl || !genres || !episodes) {
      return { success: false, error: 'Missing required fields.' };
    }

    // 1. Upload Cover Image to Firebase Storage
    const coverImagePath = `anime-covers/${Date.now()}_${coverImage.name}`;
    const coverImageUrl = await uploadFile(coverImage, coverImagePath);

    // 2. Prepare the data for Firestore
    const animeData: Omit<Anime, 'id'> = {
      title,
      description,
      streamUrl,
      coverImageUrl,
      genres: genres.split(',').map(g => g.trim()),
      rating: rating ? parseFloat(rating) : 0,
      episodes: parseInt(episodes, 10),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 3. Add the document to the 'animes' collection in Firestore
    const docRef = await addDoc(collection(firestore, 'animes'), animeData);
    console.log('Document written with ID: ', docRef.id);

    return { success: true, docId: docRef.id };

  } catch (error) {
    console.error('Error adding anime: ', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to add anime: ${errorMessage}` };
  }
}
