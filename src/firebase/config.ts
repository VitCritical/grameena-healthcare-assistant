import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEFRrd28RN2TpI-c93zyOJhpu9F4ZSLtw",
  authDomain: "grameena-healthcare-assistant.firebaseapp.com",
  projectId: "grameena-healthcare-assistant",
  messagingSenderId: "1075838137231",
  appId: "1:1075838137231:web:01c06008ce3811a0d011fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;