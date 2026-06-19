// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlpYjUeH6BqqblO1NnERUh-81S4_BX-LI",
  authDomain: "svtsort.firebaseapp.com",
  projectId: "svtsort",
  storageBucket: "svtsort.firebasestorage.app",
  messagingSenderId: "784523905337",
  appId: "1:784523905337:web:045bd0e31608eac0a4c0e8",
  measurementId: "G-MXBLTWH7TW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);