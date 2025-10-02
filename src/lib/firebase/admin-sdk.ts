
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

export class FirebaseAdminInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAdminInitializationError';
  }
}

/**
 * Initializes and/or returns the Firebase Admin App instance.
 * This "lazy" initialization prevents the SDK from being initialized
 * in client-side bundles.
 */
export function getAdminApp(): App {
  const appName = 'firebase-admin-app';
  const existingApp = getApps().find(app => app.name === appName);

  if (existingApp) {
    return existingApp;
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (
    !serviceAccount.projectId ||
    !serviceAccount.privateKey ||
    !serviceAccount.clientEmail
  ) {
    throw new FirebaseAdminInitializationError(
      'Firebase service account credentials are not set in environment variables. Please check your .env file.'
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  }, appName);
}
