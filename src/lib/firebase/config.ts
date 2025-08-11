// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYt9h2tnERoXCeic3y2rWBvGpta3zErmM",
  authDomain: "barbershop-85c50.firebaseapp.com",
  projectId: "barbershop-85c50",
  storageBucket: "barbershop-85c50.firebasestorage.app",
  messagingSenderId: "475868017335",
  appId: "1:475868017335:web:2302ae04e26e910bfa9332",
  measurementId: "G-VG5FMVK4CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);