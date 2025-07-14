// This file is gitignored. You must create this file in your project.
// Go to your Firebase project settings, and under "General", find your web app.
// Click on "Config" to get your Firebase configuration object.
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxjH-4J2qZ_ePnYs1CIWOJZ0we6FODM0k",
  authDomain: "shear-geniu.firebaseapp.com",
  projectId: "shear-geniu",
  storageBucket: "shear-geniu.firebasestorage.app",
  messagingSenderId: "215757153302",
  appId: "1:215757153302:web:0516d63981d2d471cdc137",
  measurementId: "G-87M71P4ERQ"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { db };
