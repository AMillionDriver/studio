
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase/sdk';
import type { Anime } from '@/types/anime';


/**
 * Adds a new anime document to Firestore and uploads its cover image to Storage.
 * This is a Server Action and should only be called from the server-side.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure.
 */
export async function addAnime(formData: FormData): Promise<{ success: boolean; docId?: string; error?: string }> {
  
  const coverImage = formData.get('coverImage') as File | null;
  const title = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const streamUrl = formData.get('streamUrl') as string | null;
  const genres = formData.get('genres') as string | null;
  const episodesStr = formData.get('episodes') as string | null;
  const ratingStr = formData.get('rating') as string | null;

  if (!coverImage || !title || !description || !streamUrl || !genres || !episodesStr) {
    return { success: false, error: 'Missing required fields. Please fill out all parts of the form.' };
  }

  // 1. Upload Cover Image to Firebase Storage
  let coverImageUrl: string;
  try {
    const coverImagePath = `anime-covers/${Date.now()}_${coverImage.name}`;
    const storageRef = ref(storage, coverImagePath);
    const uploadTask = await uploadBytes(storageRef, coverImage, { contentType: coverImage.type });
    coverImageUrl = await getDownloadURL(uploadTask.ref);
  } catch (error: any) {
    console.error('Error uploading cover image: ', error);
    return { success: false, error: `Failed to upload cover image: ${error.message}` };
  }

  // 2. Prepare the data for Firestore
  let animeData: Omit<Anime, 'id'>;
  try {
    animeData = {
      title,
      description,
      streamUrl,
      coverImageUrl,
      genres: genres.split(',').map(g => g.trim()),
      rating: ratingStr ? parseFloat(ratingStr) : 0,
      episodes: parseInt(episodesStr, 10),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
     // Validate that episodes and rating are valid numbers
    if (isNaN(animeData.episodes)) {
        return { success: false, error: 'Invalid number for episodes.' };
    }
    if (ratingStr && isNaN(animeData.rating as number)) {
        return { success: false, error: 'Invalid number for rating.' };
    }

  } catch (error: any) {
      console.error('Error preparing data for Firestore: ', error);
      return { success: false, error: `Failed to prepare data: ${error.message}`};
  }

  // 3. Add the document to the 'animes' collection in Firestore
  try {
    const docRef = await addDoc(collection(firestore, 'animes'), animeData);
    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error('Error adding document to Firestore: ', error);
    return { success: false, error: `Failed to save data to database: ${error.message}` };
  }
}
