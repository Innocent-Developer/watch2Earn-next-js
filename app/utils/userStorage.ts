// User storage utility functions for localStorage

export interface UserData {
  id?: string
  name?: string
  email?: string
  phone?: string
  phoneNumber?: string
  totalBalance?: string
  totalWithdrawals?: string
  inviteCode?: string
  level?: string
  plan?: string
  avatar?: string
  lastLogin?: string
  isActive?: boolean
  preferences?: {
    notifications?: boolean
    theme?: 'light' | 'dark'
    language?: string
  }
  [key: string]: any // Allow for additional properties
}

/**
 * Get user data from localStorage
 * @returns UserData object or null if not found
 */
export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

/**
 * Set user data in localStorage
 * @param userData - User data to store
 */
export const setUserData = (userData: UserData): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('user', JSON.stringify(userData))
  } catch (error) {
    console.error('Error storing user data in localStorage:', error)
  }
}

/**
 * Clear user data from localStorage
 */
export const clearUserData = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error)
  }
}

/**
 * Update specific user data fields
 * @param updates - Object containing fields to update
 */
export const updateUserData = (updates: Partial<UserData>): void => {
  if (typeof window === 'undefined') return
  
  try {
    const currentUser = getUserData()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      setUserData(updatedUser)
    }
  } catch (error) {
    console.error('Error updating user data in localStorage:', error)
  }
}

/**
 * Check if user is logged in
 * @returns boolean indicating if user data exists
 */
export const isUserLoggedIn = (): boolean => {
  return getUserData() !== null
}

/**
 * Get user's display name (name or email fallback)
 * @returns string - user's display name
 */
export const getUserDisplayName = (): string => {
  const user = getUserData()
  if (!user) return 'Guest'
  return user.name || user.email || 'User'
}

/**
 * Get user's initials for avatar display
 * @returns string - user's initials
 */
export const getUserInitials = (): string => {
  const user = getUserData()
  if (!user || !user.name) return 'U'
  return user.name.charAt(0).toUpperCase()
}

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = (): void => {
  updateUserData({ lastLogin: new Date().toISOString() })
}

/**
 * Get user preferences
 * @returns user preferences object
 */
export const getUserPreferences = (): UserData['preferences'] => {
  const user = getUserData()
  return user?.preferences || { notifications: true, theme: 'light', language: 'en' }
}

/**
 * Update user preferences
 * @param preferences - preferences to update
 */
export const updateUserPreferences = (preferences: Partial<UserData['preferences']>): void => {
  const currentUser = getUserData()
  if (currentUser) {
    const currentPreferences = currentUser.preferences || {}
    const updatedPreferences = { ...currentPreferences, ...preferences }
    updateUserData({ preferences: updatedPreferences })
  }
} 