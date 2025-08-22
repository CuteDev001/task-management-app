import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId'] as const
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    throw new Error(`Firebase ${field} is required but not provided`)
  }
}

// Initialize Firebase
console.log('Initializing Firebase app...')
const app = initializeApp(firebaseConfig)
console.log('Firebase app initialized successfully')

// Initialize services
console.log('Initializing Firebase services...')

// Initialize Auth
export const auth = getAuth(app)
console.log('Firebase Auth initialized')

// Initialize Firestore with settings
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalAutoDetectLongPolling: true // Use only auto-detect option
})

console.log('Firebase Firestore initialized with custom settings')

// Enable offline persistence
try {
  console.log('Enabling Firestore offline persistence...')
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Offline persistence enabled successfully')
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.')
      }
    })
} catch (error) {
  console.warn('Error enabling Firestore persistence:', error)
}

// Initialize Storage
export const storage = getStorage(app)
console.log('Firebase Storage initialized')

// Initialize Analytics if in browser
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
console.log('Firebase Analytics initialized (if available)')

// Export app instance
export default app 