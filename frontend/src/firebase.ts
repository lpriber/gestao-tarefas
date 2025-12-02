// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDMeLHHJUfOQxwT8pFuuSNMdj8LO5UUKuU",
  authDomain: "gestao-99e4a.firebaseapp.com",
  projectId: "gestao-99e4a",
  storageBucket: "gestao-99e4a.firebasestorage.app",
  messagingSenderId: "986324797412",
  appId: "1:986324797412:web:c324c57c7fcadd04c7e9f1"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function logout() {
  await signOut(auth)
}

export function watchAuth(callback: (user: any) => void) {
  onAuthStateChanged(auth, callback)
}