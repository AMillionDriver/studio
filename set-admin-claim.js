
// This script uses the Firebase Admin SDK to set a custom user claim.
// You must run this script in a Node.js environment (e.g., your local machine), not in the browser.

// --- SETUP ---
// 1. Make sure you have Node.js installed on your computer.
// 2. Open a terminal in your project directory.
// 3. Run 'npm install firebase-admin dotenv' to install the required packages.
// 4. IMPORTANT: Make sure your .env file is correctly filled with your Firebase service account credentials.

const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// --- VERIFY ENVIRONMENT VARIABLES ---
const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
  console.error('ERROR: Missing Firebase credentials in .env file.');
  console.error('Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.');
  process.exit(1);
}

// Get the email of the user you want to make an admin from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('ERROR: Please provide the user\'s email address as an argument.');
  console.log('Usage: node set-admin-claim.js <user-email@example.com>');
  process.exit(1);
}

// --- INITIALIZE FIREBASE ADMIN SDK ---
const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix for newline characters in .env
  clientEmail: FIREBASE_CLIENT_EMAIL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('ERROR: Firebase Admin SDK initialization failed.');
  console.error('Please ensure your .env file has the correct Firebase service account credentials.');
  console.error('Original Error:', error.message);
  process.exit(1);
}


// --- MAIN FUNCTION ---
async function setAdminClaim(email) {
  try {
    // 1. Find the user by their email address
    console.log(`Searching for user with email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.uid}`);

    // 2. Check if the user is already an admin
    if (user.customClaims && user.customClaims.admin === true) {
      console.log(`SUCCESS: User ${email} is already an admin.`);
      return;
    }

    // 3. Set the custom claim { admin: true }
    console.log('Setting custom claim { admin: true } for the user...');
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`SUCCESS: Custom claim set for ${email}.`);
    console.log('\nIMPORTANT: The user must log out and log back in for the changes to take effect on their token.');

  } catch (error) {
    console.error(`ERROR: Failed to set custom claim for ${email}.`);
    if (error.code === 'auth/user-not-found') {
        console.error('Reason: The email address does not correspond to any user in Firebase Authentication.');
    } else {
        console.error('Reason:', error.message);
    }
  }
}

// --- RUN SCRIPT ---
setAdminClaim(userEmail);
