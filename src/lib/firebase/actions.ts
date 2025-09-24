'use server';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { z } from 'zod';
import { auth } from './sdk';

const emailLoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormState = {
  error?: string;
  success?: boolean;
};

// This helper function deals with the Firebase Auth object instance.
// It's a workaround for a known issue with Next.js Server Actions and Firebase SDK.
async function getAuthForAction(): Promise<Auth> {
  // In a real app, you might use the Firebase Admin SDK here for server-side operations.
  // For this client-action-like server action, we re-use the client auth object.
  return auth;
}

export async function signUpWithEmail(
  data: z.infer<typeof emailLoginSchema>
): Promise<FormState> {
  const validatedFields = emailLoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }
  
  const { email, password } = validatedFields.data;
  
  try {
    const auth = await getAuthForAction();
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (e: any) {
    console.error(e);
    // Firebase often returns complex error objects. We simplify them for the user.
    if (e.code === 'auth/email-already-in-use') {
        return { error: 'This email is already registered. Please login instead.' };
    }
    return { error: 'An unexpected error occurred during sign up. Please try again.' };
  }
}

export async function signInWithEmail(
  data: z.infer<typeof emailLoginSchema>
): Promise<FormState> {
    const validatedFields = emailLoginSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid email or password format.' };
    }

    const { email, password } = validatedFields.data;

  try {
    const auth = await getAuthForAction();
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (e: any) {
    console.error(e);
    // Provide a generic error to avoid leaking information about which field was wrong.
    return { error: 'Login failed. Please check your email and password.' };
  }
}

export async function signOut(): Promise<FormState> {
  try {
    const auth = await getAuthForAction();
    await firebaseSignOut(auth);
    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { error: 'Failed to sign out. Please try again.' };
  }
}
