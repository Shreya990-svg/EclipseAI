import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "assistant-ai-ef181.firebaseapp.com",
  projectId: "assistant-ai-ef181",
  storageBucket: "assistant-ai-ef181.firebasestorage.app",
  messagingSenderId: "508247433326",
  appId: "1:508247433326:web:66b6c335915118df15467f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}

