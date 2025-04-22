import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

export interface Profile {
  id: string
  fullName: string
  bio?: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const profileRef = doc(db, 'profiles', userId)
    const profileSnap = await getDoc(profileRef)
    
    if (!profileSnap.exists()) {
      return null
    }
    
    return {
      id: profileSnap.id,
      ...profileSnap.data()
    } as Profile
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}

export const createProfile = async (userId: string, profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> => {
  try {
    const profileData = {
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await setDoc(doc(db, 'profiles', userId), profileData)
    
    return {
      id: userId,
      ...profileData
    }
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

export const updateProfile = async (userId: string, updates: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', userId)
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  try {
    const fileRef = ref(storage, `avatars/${userId}/${file.name}`)
    await uploadBytes(fileRef, file)
    const downloadUrl = await getDownloadURL(fileRef)
    
    // Update the profile with the new avatar URL
    await updateProfile(userId, { avatarUrl: downloadUrl })
    
    return downloadUrl
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
} 