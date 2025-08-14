// API utility functions for user data

const API_BASE_URL = 'https://watch2earn-vie97.ondigitalocean.app/api'

// API response interfaces
export interface WithdrawalData {
  id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  [key: string]: any
}

export interface DepositData {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  [key: string]: any
}

export interface ReferralData {
  inviteCode: string
  totalReferrals: number
  totalEarnings: number
  invitedUsers: Array<{
    id: string
    email: string
    name?: string
    joinedAt: string
    status: 'active' | 'inactive'
    [key: string]: any
  }>
  [key: string]: any
}

export interface CompleteUserData {
  withdrawals: WithdrawalData[]
  deposits: DepositData[]
  referrals: ReferralData
  [key: string]: any
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Get user withdrawals by email
 * @param email - User's email address
 * @returns Promise with withdrawal data array
 */
export const getUserWithdrawals = async (email: string): Promise<WithdrawalData[]> => {
  return apiRequest<WithdrawalData[]>(`/user/withdrawals/${encodeURIComponent(email)}`)
}

/**
 * Get user deposits by UID
 * @param uid - User's unique identifier
 * @returns Promise with deposit data array
 */
export const getUserDeposits = async (uid: string): Promise<DepositData[]> => {
  return apiRequest<DepositData[]>(`/user/deposits/${encodeURIComponent(uid)}`)
}

/**
 * Get user referral information and invited users
 * @param uid - User's unique identifier
 * @returns Promise with referral data
 */
export const getUserReferrals = async (uid: string): Promise<ReferralData> => {
  return apiRequest<ReferralData>(`/user/referrals/${encodeURIComponent(uid)}`)
}

/**
 * Get user profile data with balance information
 * @param uid - User's unique identifier (number)
 * @returns Promise with user profile data including balances
 */
export const getUserProfile = async (uid: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/user/${uid}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.success) {
      return data.data.user
    } else {
      throw new Error(data.message || 'Failed to fetch user profile')
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Submit withdrawal request
 * @param withdrawalData - Withdrawal request data
 * @returns Promise with withdrawal request response
 */
export interface WithdrawalRequestData {
  amount: number
  paymentMethod: string
  bankName?: string
  accountHolderName?: string
  accountNumber?: string
  emailAddress: string
}

export const submitWithdrawalRequest = async (withdrawalData: WithdrawalRequestData): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/withdrawal/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withdrawalData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error submitting withdrawal request:', error)
    throw error
  }
}

/**
 * Update user balance after watching ads
 * @param uid - User's unique identifier (number)
 * @param amount - Amount to add to balance
 * @returns Promise with balance update response
 */
export interface BalanceUpdateData {
  uid: number
  amount: number
}

export const updateUserBalance = async (uid: number, amount: number): Promise<any> => {
  try {
    console.log('Updating balance for UID:', uid, 'Amount:', amount)

    // Validate inputs before sending
    if (!uid || typeof amount !== 'number') {
      throw new Error('Invalid UID or amount provided')
    }

    const response = await fetch(`${API_BASE_URL}/auto/update/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ uid, amount }),
    })

    console.log('Balance update response status:', response.status)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
      }
      console.error('Balance update error:', errorMessage)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Balance update response:', data)

    // Validate response format
    if (data.message === 'Balance updated successfully') {
      return {
        success: true,
        message: data.message,
        uid: data.uid,
        newBalance: data.newBalance
      }
    } else {
      throw new Error(data.message || 'Unexpected response format')
    }
  } catch (error) {
    console.error('Error updating user balance:', error)
    throw error
  }
}

/**
 * Auto update user balance when they visit ads page (daily bonus)
 * @param uid - User's unique identifier (number)
 * @param amount - Amount to add to balance (default 1)
 * @returns Promise with auto balance update response
 */
export const autoUpdateUserBalance = async (uid: number, amount: number = 1): Promise<any> => {
  try {
    console.log('Auto updating balance for UID:', uid, 'Amount:', amount)

    // Validate inputs before sending
    if (!uid || typeof amount !== 'number') {
      throw new Error('Invalid UID or amount provided')
    }

    const response = await fetch(`${API_BASE_URL}/auto/update/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ uid, amount }),
    })

    console.log('Auto balance update response status:', response.status)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
      }
      console.error('Auto balance update error:', errorMessage)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Auto balance update response:', data)

    // Validate response format
    if (data.message === 'Balance updated successfully') {
      return {
        success: true,
        message: data.message,
        uid: data.uid,
        newBalance: data.newBalance
      }
    } else {
      throw new Error(data.message || 'Unexpected response format')
    }
  } catch (error) {
    console.error('Error auto updating user balance:', error)
    throw error
  }
}

/**
 * Record ads earning for user (tracking purposes)
 * @param uid - User's unique identifier
 * @param adId - Advertisement ID
 * @param amount - Amount earned
 * @returns Promise with ads earning record response
 */
export interface AdsEarningData {
  uid: number
  adId: string
  amount: number
  watchedAt?: string
}

export const recordAdsEarning = async (earningData: AdsEarningData): Promise<any> => {
  const enhancedEarningData = {
    ...earningData,
    watchedAt: earningData.watchedAt || new Date().toISOString()
  }

  try {
    console.log('Recording ads earning:', enhancedEarningData)
    const response = await fetch(`${API_BASE_URL}/ads/earning/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(enhancedEarningData),
    })

    if (!response.ok) {
      console.warn(`Ads earning record API not available: ${response.status} ${response.statusText}`)
      // Save to local storage as fallback
      saveLocalAdsEarning(earningData.uid, enhancedEarningData)
      return { success: true, message: 'Recorded locally (API not available)' }
    }

    const data = await response.json()
    console.log('Ads earning recorded successfully:', data)

    // Also save to local storage for backup
    saveLocalAdsEarning(earningData.uid, enhancedEarningData)

    return data
  } catch (error) {
    console.warn('Ads earning record API not available, saving locally:', error)
    // Save to local storage as fallback
    saveLocalAdsEarning(earningData.uid, enhancedEarningData)
    return { success: true, message: 'Recorded locally (API not available)' }
  }
}

/**
 * Get user ads earning history
 * @param uid - User's unique identifier
 * @returns Promise with ads earning history
 */
export const getUserAdsEarnings = async (uid: number): Promise<AdsEarningData[]> => {
  try {
    console.log('Fetching ads earnings for UID:', uid)
    const response = await fetch(`${API_BASE_URL}/ads/earnings/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn(`Ads earnings API not available: ${response.status} ${response.statusText}`)
      // Fallback to local storage
      return getLocalAdsEarnings(uid)
    }

    const data = await response.json()
    return data.success ? data.data : getLocalAdsEarnings(uid)
  } catch (error) {
    console.warn('Ads earnings API not available, using local storage:', error)
    // Fallback to local storage instead of empty array
    return getLocalAdsEarnings(uid)
  }
}

/**
 * Get ads earnings from local storage
 * @param uid - User's unique identifier
 * @returns Array of ads earnings from local storage
 */
export const getLocalAdsEarnings = (uid: number): AdsEarningData[] => {
  if (typeof window === 'undefined') return []

  try {
    const key = `adsEarnings_${uid}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading local ads earnings:', error)
    return []
  }
}

/**
 * Save ads earning to local storage
 * @param uid - User's unique identifier
 * @param earning - Ads earning data to save
 */
export const saveLocalAdsEarning = (uid: number, earning: AdsEarningData): void => {
  if (typeof window === 'undefined') return

  try {
    const key = `adsEarnings_${uid}`
    const existing = getLocalAdsEarnings(uid)
    const updated = [...existing, earning]
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving local ads earning:', error)
  }
}

/**
 * Get comprehensive user data (withdrawals, deposits, referrals)
 * @param uid - User's unique identifier
 * @returns Promise with complete user data
 */
export const getUserCompleteData = async (uid: string): Promise<CompleteUserData> => {
  return apiRequest<CompleteUserData>(`/user/complete/${encodeURIComponent(uid)}`)
}

/**
 * Get all user data for a specific user
 * @param uid - User's unique identifier
 * @param email - User's email address
 * @returns Promise with all user data
 */
export const getAllUserData = async (uid: string, email: string): Promise<CompleteUserData> => {
  try {
    // Fetch all data in parallel for better performance
    const [withdrawals, deposits, referrals] = await Promise.all([
      getUserWithdrawals(email),
      getUserDeposits(uid),
      getUserReferrals(uid)
    ])

    return {
      withdrawals,
      deposits,
      referrals
    }
  } catch (error) {
    console.error('Error fetching all user data:', error)
    throw error
  }
}

/**
 * Refresh user data from API and update local storage
 * @param uid - User's unique identifier
 * @param email - User's email address
 * @returns Promise with updated user data
 */
export const refreshUserDataFromAPI = async (uid: string, email: string): Promise<CompleteUserData> => {
  try {
    const userData = await getAllUserData(uid, email)

    // Store the fresh data in localStorage for offline access
    if (typeof window !== 'undefined') {
      localStorage.setItem('userApiData', JSON.stringify({
        ...userData,
        lastUpdated: new Date().toISOString()
      }))
    }

    return userData
  } catch (error) {
    console.error('Error refreshing user data from API:', error)
    throw error
  }
}

/**
 * Get cached user data from localStorage
 * @returns Cached user data or null if not found
 */
export const getCachedUserData = (): CompleteUserData | null => {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem('userApiData')
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Error parsing cached user data:', error)
    return null
  }
}

/**
 * Check if cached data is stale (older than 5 minutes)
 * @returns boolean indicating if data should be refreshed
 */
export const isCachedDataStale = (): boolean => {
  const cached = getCachedUserData()
  if (!cached?.lastUpdated) return true

  const lastUpdated = new Date(cached.lastUpdated)
  const now = new Date()
  const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

  return (now.getTime() - lastUpdated.getTime()) > fiveMinutes
} 