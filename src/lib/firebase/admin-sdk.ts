
import { initializeApp, getApps, App, cert, getApp } from "firebase-admin/app";

// IMPORTANT: You must provide your own service account credentials.
// Download your service account JSON file from the Firebase console:
// Project settings > Service accounts > Generate new private key
//
// Then, set the following environment variables in a .env.local file:
// FIREBASE_PROJECT_ID="your-project-id"
// FIREBASE_PRIVATE_KEY="your-private-key" (replace \n with \\n)
// FIREBASE_CLIENT_EMAIL="your-client-email"

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

function getAdminApp(): App {
  if (getApps().length > 0) {
    // Return the default app if it's already initialized
    return getApp();
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
  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminApp = getAdminApp();
