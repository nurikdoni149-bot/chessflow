import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB0pFtQSjrkJ0bCVG3bbYt4-zlbdJPY9HM",
    authDomain: "chess-app-6b953.firebaseapp.com",
    projectId: "chess-app-6b953",
    storageBucket: "chess-app-6b953.firebasestorage.app",
    messagingSenderId: "347009963006",
    appId: "1:347009963006:web:6b2bb6f7730cd0202966af"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);