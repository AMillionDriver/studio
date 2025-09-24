
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase/sdk';
import type { Anime, AnimeFormData } from '@/types/anime';

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
 * @param formData The anime data from the form.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: AnimeFormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  try {
    // 1. Upload Cover Image to Firebase Storage
    const coverImagePath = `anime-covers/${Date.now()}_${formData.coverImage.name}`;
    const coverImageUrl = await uploadFile(formData.coverImage, coverImagePath);

    // 2. Prepare the data for Firestore
    const animeData: Omit<Anime, 'id'> = {
      title: formData.title,
      description: formData.description,
      streamUrl: formData.streamUrl,
      coverImageUrl: coverImageUrl,
      genres: formData.genres,
      rating: formData.rating ?? 0,
      episodes: formData.episodes,
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
