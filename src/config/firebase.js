import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// REPLACE these values with your own Firebase project credentials
// Get them from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBtGXJ0yX0BwPzEWsaAq9wOIJ05PUP5aqc",
  authDomain: "chathexax.firebaseapp.com",
  projectId: "chathexax",
  storageBucket: "chathexax.firebasestorage.app",
  messagingSenderId: "209235852137",
  appId: "1:209235852137:web:9105669a8da3bdaf339bf8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
