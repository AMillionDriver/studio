
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

  const missingVariables = Object.entries({
    FIREBASE_PROJECT_ID: serviceAccount.projectId,
    FIREBASE_PRIVATE_KEY: serviceAccount.privateKey,
    FIREBASE_CLIENT_EMAIL: serviceAccount.clientEmail,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVariables.length > 0) {
    const message = `Missing Firebase Admin environment variables: ${missingVariables.join(', ')}`;
    console.error(message);
    throw new FirebaseAdminInitializationError(message);
  }

  return initializeApp({
    credential: cert(serviceAccount),
  }, appName);
}
