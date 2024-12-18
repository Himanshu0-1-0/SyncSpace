import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsB6XJSDmpVJWcLiLU5ua28duqEOtWJQo",
  authDomain: "syncspace-3f2a0.firebaseapp.com",
  projectId: "syncspace-3f2a0",
  storageBucket: "syncspace-3f2a0.appspot.com",
  messagingSenderId: "285818247885",
  appId: "1:285818247885:web:a6e78d224a0b5cae1ca784",
  measurementId: "G-EY1TW1KG04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
