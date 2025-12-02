import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  onAuthStateChanged, signOut,
  setPersistence, browserLocalPersistence
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDMeLHHJUfOQxwT8pFuuSNMdj8LO5UUKuU",
  authDomain: "gestao-99e4a.firebaseapp.com",
  projectId: "gestao-99e4a",
  storageBucket: "gestao-99e4a.firebasestorage.app",
  messagingSenderId: "986324797412",
  appId: "1:986324797412:web:c324c57c7fcadd04c7e9f1"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as null | { uid: string; displayName: string; email: string; photoURL?: string },
    token: '' as string,
    loading: true as boolean,
  }),
  actions: {
    async init() {
      await setPersistence(auth, browserLocalPersistence)

      onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user)
        if (user) {
          const token = await user.getIdToken()
          console.log("Token recebido:", token)
          this.user = {
            uid: user.uid,
            displayName: user.displayName ?? '',
            email: user.email ?? '',
            photoURL: user.photoURL ?? '',
          }
          this.token = token
        } else {
          this.user = null
          this.token = ''
        }
        this.loading = false
      })
    },
    async login() {
      await signInWithPopup(auth, provider)
    },
    async logout() {
      await signOut(auth)
      this.user = null
      this.token = ''
    },
  },
})