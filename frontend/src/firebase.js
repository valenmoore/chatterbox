import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAVkq4kVPNQgkiTc3cyIf1SoJKVg6RKwMs",
    authDomain: "language-site-9c3af.firebaseapp.com",
    projectId: "language-site-9c3af",
    storageBucket: "language-site-9c3af.appspot.com",
    messagingSenderId: "793082472035",
    appId: "1:793082472035:web:5a26014dd5acfa8a07fa56",
    measurementId: "G-H28WVZ7RD7"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Return a collection with a string key
export const getCollection = colName => collection(db, colName);
export default app;