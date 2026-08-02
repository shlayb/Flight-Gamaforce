import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM9yjSG1P_I88Vp2icah7Nnt--P_DescQ",
  authDomain: "gamaforce-flight-report.firebaseapp.com",
  projectId: "gamaforce-flight-report",
  storageBucket: "gamaforce-flight-report.firebasestorage.app",
  messagingSenderId: "836183596154",
  appId: "1:836183596154:web:33ed28940f21111190efc3",
  measurementId: "G-H4CBGPTNQ9"
};

import { getAuth } from "firebase/auth";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
