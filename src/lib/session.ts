
'use server';

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { getAdminApp } from './firebase/admin-sdk';
import { AppUser } from '@/contexts/auth-context';

/**
 * Gets the server-side session information for the current user.
 * This now also fetches custom claims like `isAdmin`.
 * @returns A promise that resolves to the user session object or null.
 */
export async function getSession(): Promise<AppUser | null> {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Construct the AppUser object
    const sessionUser: AppUser = {
      ...(decodedClaims as any), // Cast to any to satisfy base User properties
      isAdmin: decodedClaims.admin === true,

      // Mock required User properties that are not in DecodedIdToken
      emailVerified: decodedClaims.email_verified || false,
      isAnonymous: decodedClaims.firebase.sign_in_provider === 'anonymous',
      providerData: [], // This is client-side data, not available in session cookie
      metadata: {}, // This is also client-side
      // Dummy methods to satisfy the type, they won't be called on the server
      getIdToken: async () => sessionCookie,
      getIdTokenResult: async () => ({ token: sessionCookie, claims: decodedClaims, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
      reload: async () => {},
      delete: async () => {},
      toJSON: () => ({ ...decodedClaims }),
      providerId: decodedClaims.firebase.sign_in_provider,
    };
    
    return sessionUser;
  } catch (error) {
    // Session cookie is invalid or expired.
    console.error("Error verifying session cookie:", error);
    return null;
  }
}
