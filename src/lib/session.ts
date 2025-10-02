
'use server';

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { getAdminApp } from './firebase/admin-sdk';

/**
 * Gets the server-side session information for the current user.
 * @returns A promise that resolves to the decoded ID token (session) or null.
 */
export async function getSession() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid or expired.
    return null;
  }
}
