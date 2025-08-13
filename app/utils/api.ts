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