// Custom React hook for user data management

import { useState, useEffect, useCallback } from 'react'
import { 
  syncUserDataWithAPI, 
  getUserWithdrawalsData, 
  getUserDepositsData, 
  getUserReferralsData, 
  getCompleteUserData
} from './userStorage'
import { 
  type CompleteUserData,
  type WithdrawalData,
  type DepositData,
  type ReferralData
} from './api'
import { getUserData } from './userStorage'

interface UseUserDataReturn {
  // Data
  userData: CompleteUserData | null
  withdrawals: WithdrawalData[]
  deposits: DepositData[]
  referrals: ReferralData | null
  
  // Loading states
  isLoading: boolean
  isRefreshing: boolean
  
  // Error state
  error: string | null
  
  // Actions
  refresh: () => Promise<void>
  refreshWithdrawals: () => Promise<void>
  refreshDeposits: () => Promise<void>
  refreshReferrals: () => Promise<void>
  clearError: () => void
}

interface UseUserDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
  initialRefresh?: boolean
}

/**
 * Custom hook for managing user data from API
 * @param uid - User's unique identifier
 * @param email - User's email address
 * @param options - Hook configuration options
 * @returns Object with user data, loading states, and actions
 */
export const useUserData = (
  uid: string,
  email: string,
  options: UseUserDataOptions = {}
): UseUserDataReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    initialRefresh = true
  } = options

  const [userData, setUserData] = useState<CompleteUserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data
  const fetchUserData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await syncUserDataWithAPI(uid, email, forceRefresh)
      setUserData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      setError(errorMessage)
      console.error('Error fetching user data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [uid, email])

  // Refresh all data
  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchUserData(true)
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchUserData])

  // Refresh specific data sections
  const refreshWithdrawals = useCallback(async () => {
    try {
      const withdrawals = await getUserWithdrawalsData(email, true)
      setUserData((prev: CompleteUserData | null) => prev ? { ...prev, withdrawals } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh withdrawals'
      setError(errorMessage)
    }
  }, [email])

  const refreshDeposits = useCallback(async () => {
    try {
      const deposits = await getUserDepositsData(uid, true)
      setUserData((prev: CompleteUserData | null) => prev ? { ...prev, deposits } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh deposits'
      setError(errorMessage)
    }
  }, [uid])

  const refreshReferrals = useCallback(async () => {
    try {
      const referrals = await getUserReferralsData(uid, true)
      setUserData((prev: CompleteUserData | null) => prev ? { ...prev, referrals } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh referrals'
      setError(errorMessage)
    }
  }, [uid])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (initialRefresh && uid && email) {
      fetchUserData()
    }
  }, [uid, email, initialRefresh, fetchUserData])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !uid || !email) return

    const interval = setInterval(() => {
      fetchUserData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, uid, email, refreshInterval, fetchUserData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setUserData(null)
      setError(null)
    }
  }, [])

  return {
    userData,
    withdrawals: userData?.withdrawals || [],
    deposits: userData?.deposits || [],
    referrals: userData?.referrals || null,
    isLoading,
    isRefreshing,
    error,
    refresh,
    refreshWithdrawals,
    refreshDeposits,
    refreshReferrals,
    clearError
  }
}

/**
 * Hook for withdrawals only
 */
export const useUserWithdrawals = (email: string) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWithdrawals = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserWithdrawalsData(email)
      setWithdrawals(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch withdrawals'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [email])

  useEffect(() => {
    if (email) {
      fetchWithdrawals()
    }
  }, [email, fetchWithdrawals])

  return { withdrawals, isLoading, error, refresh: fetchWithdrawals }
}

/**
 * Hook for deposits only
 */
export const useUserDeposits = (uid: string) => {
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDeposits = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserDepositsData(uid)
      setDeposits(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deposits'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [uid])

  useEffect(() => {
    if (uid) {
      fetchDeposits()
    }
  }, [uid, fetchDeposits])

  return { deposits, isLoading, error, refresh: fetchDeposits }
}

/**
 * Hook for referrals only
 */
export const useUserReferrals = (uid: string) => {
  const [referrals, setReferrals] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReferrals = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserReferralsData(uid)
      setReferrals(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referrals'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [uid])

  useEffect(() => {
    if (uid) {
      fetchReferrals()
    }
  }, [uid, fetchReferrals])

  return { referrals, isLoading, error, refresh: fetchReferrals }
} 