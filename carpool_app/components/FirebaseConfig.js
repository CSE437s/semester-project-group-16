// This file is how we connect to my Firebase Authentication project. 
// I believe `firebaseConfig` is intended to be public.

import firebase, { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1wkqjWJtmPd46bWwyw28Oc0k-kVpfWcE",
  authDomain: "ridealong-413818.firebaseapp.com",
  projectId: "ridealong-413818",
  storageBucket: "ridealong-413818.appspot.com",
  messagingSenderId: "1046114662384",
  appId: "1:1046114662384:web:b88a81b8fcf0595d890f35",
  measurementId: "G-ENDFKDLT1B"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);