'use server';

import {
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

export async function signUpWithEmail(
  data: z.infer<typeof emailLoginSchema>
): Promise<FormState> {
  const validatedFields = emailLoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }
  
  const { email, password } = validatedFields.data;
  
  try {
    // This is the function that creates the user in Firebase Auth
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (e: any) {
    console.error("Sign up error:", e.code, e.message);
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
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (e: any) {
    console.error("Sign in error:", e.code, e.message);
    // Provide a generic error to avoid leaking information about which field was wrong.
    return { error: 'Login failed. Please check your email and password.' };
  }
}

export async function signOut(): Promise<FormState> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (e: any) {
    console.error("Sign out error:", e.code, e.message);
    return { error: 'Failed to sign out. Please try again.' };
  }
}
