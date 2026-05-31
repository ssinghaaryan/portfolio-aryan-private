import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD25F5026KFhWT8TyfjPWuWTD5ZL3OwNig",
  authDomain: "iaryan.firebaseapp.com",
  projectId: "iaryan",
  storageBucket: "iaryan.firebasestorage.app",
  messagingSenderId: "460157992343",
  appId: "1:460157992343:web:eb8479a61e96ed2607d8d2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);