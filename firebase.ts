import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCzvn_dGHkbD23AkTCRqGm2eXrxfV7N0u4",
  authDomain: "cicryp-test.firebaseapp.com",
  projectId: "cicryp-test",
  storageBucket: "cicryp-test.appspot.com",
  messagingSenderId: "14395736740",
  appId: "1:14395736740:web:af9b49e2b83c63f8391c31",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
