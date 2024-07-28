import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxgpWsVXck0X_jXZjCjIaLV_uO0qVZaJU",
  authDomain: "cashcows-4102f.firebaseapp.com",
  projectId: "cashcows-4102f",
  storageBucket: "cashcows-4102f.appspot.com",
  messagingSenderId: "3300826133",
  appId: "1:3300826133:android:7cbd57d9d1e2f3349b821c",
  measurementId: "G-4SHD1K0CC5",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export the Firebase services for use in other files
export { app, auth, db, storage };
