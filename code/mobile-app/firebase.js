// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwQ2Ol5-hX0NEVLb7-P43Wn-3J4Az9dXI",
  authDomain: "civicreportersih.firebaseapp.com",
  projectId: "civicreportersih",
  storageBucket: "civicreportersih.firebasestorage.app",
  messagingSenderId: "1071915101804",
  appId: "1:1071915101804:web:953c4d5ac2f4c731b17249"
};

const app = initializeApp(firebaseConfig);

// Initialize auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export { auth };
export const storage = getStorage(app);
