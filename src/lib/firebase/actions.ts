'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { z } from 'zod';
import { auth } from './sdk'; 


const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type FormState = {
  error?: string;
  success?: boolean;
};

// Sign Up with Email and Password
export async function signUpWithEmail(
  data: z.infer<typeof emailLoginSchema>
): Promise<FormState> {
  const result = emailLoginSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid data provided.' };
  }

  try {
    await createUserWithEmailAndPassword(auth, result.data.email, result.data.password);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// Sign In with Email and Password
export async function signInWithEmail(
  data: z.infer<typeof emailLoginSchema>
): Promise<FormState> {
  const result = emailLoginSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid data provided.' };
  }
  
  try {
    await signInWithEmailAndPassword(auth, result.data.email, result.data.password);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// Sign Out
export async function signOut(): Promise<FormState> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (e: any)
{
    return { error: e.message };
  }
}
