// Firebase configuration and initialization
// Replace the config object below with your own Firebase project config
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDy1sa3p7WUflkA5yPv4P4-_gSyaWlrQhs",
    authDomain: "vudo-ef51e.firebaseapp.com",
    projectId: "vudo-ef51e",
    storageBucket: "vudo-ef51e.firebasestorage.app",
    messagingSenderId: "88334805749",
    appId: "1:88334805749:web:8d25c08445b0ee3527b3bc"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, db, onAuthStateChanged, provider, signInWithPopup, signOut }
