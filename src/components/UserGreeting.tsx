import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Skeleton } from './ui/skeleton'

interface Profile {
  fullName?: string
  email: string
  avatarUrl?: string
}

export const UserGreeting: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const profileRef = doc(db, 'profiles', user.uid)
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
          setProfile({
            ...profileSnap.data() as Profile,
            email: user.email || ''
          })
        } else {
          // If no profile exists, use email from auth
          setProfile({
            email: user.email || ''
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        // Use cached data if available
        if (!isOnline) {
          setError('Currently offline. Showing last known data.')
        } else {
          setError('Failed to load profile. Please try again later.')
        }
        // Fallback to basic user info from auth
        if (user.email) {
          setProfile({
            email: user.email
          })
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, isOnline])

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return <Skeleton className="h-8 w-[200px]" />
  }

  if (!user) {
    return <div className="text-muted-foreground">Welcome, Guest!</div>
  }

  const displayName = profile?.fullName || profile?.email?.split('@')[0] || 'User'

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold tracking-tight">
        {getTimeBasedGreeting()}, {displayName}!
      </h2>
      {error && (
        <p className="text-sm text-muted-foreground">
          {error}
        </p>
      )}
      {!isOnline && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          You are currently offline
        </p>
      )}
    </div>
  )
}
