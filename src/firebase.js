import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiLhHdJD7NxUhKRrlNwlracLeKdjHV3mM",
  authDomain: "college-management-syste-3e625.firebaseapp.com",
  projectId: "college-management-syste-3e625",
  storageBucket: "college-management-syste-3e625.firebasestorage.app",
  messagingSenderId: "836681270913",
  appId: "1:836681270913:web:4bf14b03c6c9f5c8ab2f80",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
