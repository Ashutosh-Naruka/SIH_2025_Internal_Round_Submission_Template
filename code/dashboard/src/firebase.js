// civic-dashboard/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Copy the EXACT same config from your mobile app's firebase.js
  apiKey: "AIzaSyCwQ2Ol5-hX0NEVLb7-P43Wn-3J4Az9dXI",
  authDomain: "civicreportersih.firebaseapp.com",
  projectId: "civicreportersih",
  storageBucket: "civicreportersih.firebasestorage.app",
  messagingSenderId: "1071915101804",
  appId: "1:1071915101804:web:953c4d5ac2f4c731b17249"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
