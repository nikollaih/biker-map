// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCoUTjNqmYqsdqWQdrBIqkqEkFMgLQYJNg",
    authDomain: "biker-map-3f802.firebaseapp.com",
    projectId: "biker-map-3f802",
    storageBucket: "biker-map-3f802.firebasestorage.app",
    messagingSenderId: "546743257407",
    appId: "1:546743257407:web:96023870a8a05446206b8a",
    measurementId: "G-ZDPN54WKV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
