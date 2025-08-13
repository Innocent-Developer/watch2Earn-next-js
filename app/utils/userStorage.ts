// User storage utility functions for localStorage

import { 
  getUserWithdrawals, 
  getUserDeposits, 
  getUserReferrals, 
  getUserCompleteData,
  getAllUserData,
  refreshUserDataFromAPI,
  getCachedUserData,
  isCachedDataStale,
  type CompleteUserData,
  type WithdrawalData,
  type DepositData,
  type ReferralData
} from './api'

export interface UserData {
  id?: string
  name?: string
  email?: string
  phone?: string
  phoneNumber?: string
  totalBalance?: string
  totalWithdrawals?: string
  inviteCode?: string
  referralCode?:string
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

/**
 * Sync user data with API and update local storage
 * @param uid - User's unique identifier
 * @param email - User's email address
 * @param forceRefresh - Force refresh even if cache is not stale
 * @returns Promise with updated user data
 */
export const syncUserDataWithAPI = async (
  uid: string, 
  email: string, 
  forceRefresh: boolean = false
): Promise<CompleteUserData> => {
  try {
    // Check if we have cached data and if it's fresh
    const cachedData = getCachedUserData()
    const shouldRefresh = forceRefresh || isCachedDataStale()
    
    if (!shouldRefresh && cachedData) {
      return cachedData
    }
    
    // Fetch fresh data from API
    const freshData = await refreshUserDataFromAPI(uid, email)
    
    // Update local user data with API data
    const currentUser = getUserData()
    if (currentUser) {
      // Update user data with API information
      const updatedUser = {
        ...currentUser,
        totalWithdrawals: freshData.withdrawals
          .filter(w => w.status === 'approved')
          .reduce((sum, w) => sum + w.amount, 0)
          .toString(),
        inviteCode: freshData.referrals.inviteCode,
        referralCode: freshData.referrals.inviteCode
      }
      setUserData(updatedUser)
    }
    
    return freshData
  } catch (error) {
    console.error('Error syncing user data with API:', error)
    
    // Fallback to cached data if available
    const cachedData = getCachedUserData()
    if (cachedData) {
      return cachedData
    }
    
    throw error
  }
}

/**
 * Get user withdrawals from API or cache
 * @param email - User's email address
 * @param forceRefresh - Force refresh from API
 * @returns Promise with withdrawal data
 */
export const getUserWithdrawalsData = async (
  email: string, 
  forceRefresh: boolean = false
): Promise<WithdrawalData[]> => {
  try {
    if (forceRefresh) {
      return await getUserWithdrawals(email)
    }
    
    const cachedData = getCachedUserData()
    if (cachedData && !isCachedDataStale()) {
      return cachedData.withdrawals
    }
    
    return await getUserWithdrawals(email)
  } catch (error) {
    console.error('Error getting user withdrawals:', error)
    throw error
  }
}

/**
 * Get user deposits from API or cache
 * @param uid - User's unique identifier
 * @param forceRefresh - Force refresh from API
 * @returns Promise with deposit data
 */
export const getUserDepositsData = async (
  uid: string, 
  forceRefresh: boolean = false
): Promise<DepositData[]> => {
  try {
    if (forceRefresh) {
      return await getUserDeposits(uid)
    }
    
    const cachedData = getCachedUserData()
    if (cachedData && !isCachedDataStale()) {
      return cachedData.deposits
    }
    
    return await getUserDeposits(uid)
  } catch (error) {
    console.error('Error getting user deposits:', error)
    throw error
  }
}

/**
 * Get user referrals from API or cache
 * @param uid - User's unique identifier
 * @param forceRefresh - Force refresh from API
 * @returns Promise with referral data
 */
export const getUserReferralsData = async (
  uid: string, 
  forceRefresh: boolean = false
): Promise<ReferralData> => {
  try {
    if (forceRefresh) {
      return await getUserReferrals(uid)
    }
    
    const cachedData = getCachedUserData()
    if (cachedData && !isCachedDataStale()) {
      return cachedData.referrals
    }
    
    return await getUserReferrals(uid)
  } catch (error) {
    console.error('Error getting user referrals:', error)
    throw error
  }
}

/**
 * Get complete user data from API or cache
 * @param uid - User's unique identifier
 * @param email - User's email address
 * @param forceRefresh - Force refresh from API
 * @returns Promise with complete user data
 */
export const getCompleteUserData = async (
  uid: string, 
  email: string, 
  forceRefresh: boolean = false
): Promise<CompleteUserData> => {
  try {
    if (forceRefresh) {
      return await getUserCompleteData(uid)
    }
    
    const cachedData = getCachedUserData()
    if (cachedData && !isCachedDataStale()) {
      return cachedData
    }
    
    return await getUserCompleteData(uid)
  } catch (error) {
    console.error('Error getting complete user data:', error)
    throw error
  }
}

/**
 * Clear API cache data
 */
export const clearAPICache = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('userApiData')
  } catch (error) {
    console.error('Error clearing API cache:', error)
  }
} 