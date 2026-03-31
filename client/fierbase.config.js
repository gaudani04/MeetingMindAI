// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0vnpJEwi-77rlVcCwbgFMoLnbVIWfcGA",
  authDomain: "meetingmind-bea90.firebaseapp.com",
  projectId: "meetingmind-bea90",
  storageBucket: "meetingmind-bea90.firebasestorage.app",
  messagingSenderId: "60727618856",
  appId: "1:60727618856:web:449e5a926ce6536fb8741d",
  measurementId: "G-PZG76GM14E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);