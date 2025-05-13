// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXiWAT1nezEoigsHsXRXyFSa9XqCVL068",
  authDomain: "auth-firebase-projeto-au-30690.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-30690",
  storageBucket: "auth-firebase-projeto-au-30690.firebasestorage.app",
  messagingSenderId: "1040509526380",
  appId: "1:1040509526380:web:1311da784462da756c1349",
  measurementId: "G-WZ6DBP504P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };