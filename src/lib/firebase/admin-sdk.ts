
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

let _app: App | null = null;

// IMPORTANT: You must provide your own service account credentials.
// Download your service account JSON file from the Firebase console:
// Project settings > Service accounts > Generate new private key
//
// Then, set the following environment variables in a .env file:
// FIREBASE_PROJECT_ID="your-project-id"
// FIREBASE_PRIVATE_KEY="your-private-key" (replace \n with \\n)
// FIREBASE_CLIENT_EMAIL="your-client-email"

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

/**
 * Initializes and/or returns the Firebase Admin App instance.
 * This "lazy" initialization prevents the SDK from being initialized
 * in client-side bundles.
 */
export function getAdminApp(): App {
  if (_app) {
    return _app;
  }

  // Check if the default app is already initialized
  if (getApps().some(app => app.name === '[DEFAULT]')) {
    _app = getApps().find(app => app.name === '[DEFAULT]')!;
    return _app;
  }
  
  // Ensure all required service account properties are present
  if (
    !serviceAccount.projectId ||
    !serviceAccount.privateKey ||
    !serviceAccount.clientEmail
  ) {
    throw new Error(
      "Firebase service account credentials are not set in environment variables. Please check your .env file."
    );
  }

  // Initialize the Firebase Admin SDK
  _app = initializeApp({
    credential: cert(serviceAccount),
  });

  return _app;
}
