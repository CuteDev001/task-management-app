import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth'
import { auth } from '../lib/firebase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

const getAuthErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing. Please try again.'
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.'
    case 'auth/cancelled-popup-request':
      return 'Another sign-in attempt is in progress. Please wait.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.'
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getAuthErrorMessage(error as AuthError))
      }
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getAuthErrorMessage(error as AuthError))
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getAuthErrorMessage(error as AuthError))
      }
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 