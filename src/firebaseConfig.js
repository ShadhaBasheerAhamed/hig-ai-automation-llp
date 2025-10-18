// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2EUlekk2zLR236qAxvmDBteFLNXnZuy8",
  authDomain: "hig-ai.firebaseapp.com",
  projectId: "hig-ai",
  storageBucket: "hig-ai.firebasestorage.app",
  messagingSenderId: "434266635027",
  appId: "1:434266635027:web:f64338e1806487239538e6",
  measurementId: "G-11RLWG6QW1"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);


// Initialize services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// Initialize Analytics (optional, but good to have)
const analytics = getAnalytics(app);

// Sign in the user anonymously when the app first loads
signInAnonymously(auth).catch((error) => {
    console.error("Anonymous sign-in failed:", error);
});

console.log("Firebase initialized and user signed in anonymously.");