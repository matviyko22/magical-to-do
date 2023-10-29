import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCHKxw9EjzuMHHLW83Gyd3k3hSTQYBV3Qs",
    authDomain: "magical-to-do.firebaseapp.com",
    projectId: "magical-to-do",
    storageBucket: "magical-to-do.appspot.com",
    messagingSenderId: "723402215672",
    appId: "1:723402215672:web:7f36c5d4d6a6e25da62b0d",
    measurementId: "G-F8P5Y883NS"
  };

// Initialize Firebase
let app;
let analytics;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };