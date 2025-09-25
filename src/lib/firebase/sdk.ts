
// src/lib/firebase/sdk.ts
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  projectId: "studio-9770915359-588c5",
  appId: "1:312456334974:web:99452a88485bc0698ad22f",
  apiKey: "AIzaSyDYCo9d5uxtTYNKXj8njYKmh91aV9x-bcI",
  authDomain: "studio-9770915359-588c5.firebaseapp.com",
  messagingSenderId: "312456334974",
  storageBucket: "studio-9770915359-588c5.appspot.com"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, auth, storage, firebaseConfig };
