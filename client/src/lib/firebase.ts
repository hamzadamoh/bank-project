// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTCs01b9j754L_d4y4Brp18VL3U_t0IuE",
    authDomain: "bank-abe75.firebaseapp.com",
    projectId: "bank-abe75",
    storageBucket: "bank-abe75.firebasestorage.app",
    messagingSenderId: "1040772365399",
    appId: "1:1040772365399:web:80f4dc63e93c1aa66db712",
    measurementId: "G-2ENKZ04ZGZ"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
