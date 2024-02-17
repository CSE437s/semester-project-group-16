//
// This file is how we connect to my Firebase Authentication project.
// TODO: Note that we need to retrieve apiKey from the backend. We can't store it on the frontend

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import dotenv from "dotenv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// dotenv.config();
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ridealong-413818.firebaseapp.com",
  projectId: "ridealong-413818",
  storageBucket: "ridealong-413818.appspot.com",
  messagingSenderId: "1046114662384",
  appId: "1:1046114662384:web:b88a81b8fcf0595d890f35",
  measurementId: "G-ENDFKDLT1B"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);