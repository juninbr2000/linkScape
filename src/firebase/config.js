// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF5PfS29Tnddmj4rhjBTfP84R4Elak_80",
  authDomain: "linkscape-a4158.firebaseapp.com",
  projectId: "linkscape-a4158",
  storageBucket: "linkscape-a4158.appspot.com",
  messagingSenderId: "585888113886",
  appId: "1:585888113886:web:274b3a3ab7e96c12990e4f",
  measurementId: "G-NR4ES4MJKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }