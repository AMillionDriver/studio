
'use server';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin-sdk';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';
import type { Comment } from '@/types/anime';

const firestore = getFirestore(getAdminApp());
const auth = getAuth(getAdminApp());

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
