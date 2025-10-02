
'use server';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { FirebaseAdminInitializationError, getAdminApp } from '@/lib/firebase/admin-sdk';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';
import type { Auth } from 'firebase-admin/auth';
import type { Comment } from '@/types/anime';

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

// This server action is kept for potential future use where admin-level operations might be needed.
// The primary comment submission logic has been moved to the client for detailed error handling.
export async function addComment(animeId: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const commentText = formData.get('comment') as string;
  const idToken = formData.get('idToken') as string;

  if (!commentText || commentText.trim() === '') {
    return { success: false, error: 'Komentar tidak boleh kosong.' };
  }

  if (!idToken) {
    return { success: false, error: 'Pengguna tidak terautentikasi.' };
  }

  const firestore = getFirestoreInstance();
  const auth = getAuthInstance();

  if (!firestore || !auth) {
    return { success: false, error: FIREBASE_CONFIG_ERROR };
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const user = await auth.getUser(userId);

    const commentData: Omit<Comment, 'id'> = {
      text: commentText,
      authorId: userId,
      authorName: user.displayName || 'Pengguna Anonim',
      authorPhotoURL: user.photoURL || '',
      createdAt: FieldValue.serverTimestamp(),
    };

    const commentsCollection = firestore.collection('animes').doc(animeId).collection('comments');
    await commentsCollection.add(commentData);

    revalidatePath(`/watch/${animeId}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error adding comment via server action:', error);
    if (error.code === 'permission-denied') {
         return { success: false, error: `Gagal menambahkan komentar: Izin ditolak oleh aturan keamanan Firestore.` };
    }
    return { success: false, error: `Gagal menambahkan komentar: ${error.message}` };
  }
}
