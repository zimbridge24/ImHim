// plugins/firebase.client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyDMIAYJDQ1clhYK2kMkMF7OwX86GdvrYMc",
    authDomain: "i-mhim.firebaseapp.com",
    projectId: "i-mhim",
    storageBucket: "i-mhim.firebasestorage.app",
    messagingSenderId: "30669397626",
    appId: "1:30669397626:web:96e9a5929dd78388a765c3",
    measurementId: "G-6WN7T0BXJB"
    };

  // Firebase 중복 초기화 방지
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);

  return {
    provide: {
      db, // 어디서든 useNuxtApp().$db 로 Firestore 접근 가능
    },
  };
});
