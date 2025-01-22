// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMJZWHMKcrRY8By822vmR8a83Tubk1SUQ",
  authDomain: "socialfly-97397.firebaseapp.com",
  projectId: "socialfly-97397",
  storageBucket: "socialfly-97397.firebasestorage.app",
  messagingSenderId: "290842946823",
  appId: "1:290842946823:web:e144026c005ce3abf8a9a2",
  measurementId: "G-KKGT6MT313"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH= getAuth(FIREBASE_APP);
export const FIRESTORE_DB= getFirestore(FIREBASE_APP);