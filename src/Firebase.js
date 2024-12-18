// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAsB6XJSDmpVJWcLiLU5ua28duqEOtWJQo",
  authDomain: "syncspace-3f2a0.firebaseapp.com",
  projectId: "syncspace-3f2a0",
  storageBucket: "syncspace-3f2a0.firebasestorage.app",
  messagingSenderId: "285818247885",
  appId: "1:285818247885:web:a6e78d224a0b5cae1ca784",
  measurementId: "G-EY1TW1KG04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);