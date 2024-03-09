import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCTQkpY3wRCAbxh2GLCZXmYEIzUg8-yhXI",
  authDomain: "rent-flats.firebaseapp.com",
  projectId: "rent-flats",
  storageBucket: "rent-flats.appspot.com",
  messagingSenderId: "754214812724",
  appId: "1:754214812724:web:e7eb519e5282b7dba91e61"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)