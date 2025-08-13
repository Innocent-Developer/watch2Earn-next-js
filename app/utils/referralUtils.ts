// Referral utility functions

import { getUserReferrals, type ReferralData } from './api'
import { getUserData } from './userStorage'

/**
 * Generate a referral link for a user
 * @param inviteCode - The user's invite code
 * @param baseUrl - The base URL for the application
 * @returns The complete referral link
 */
export const generateReferralLink = (inviteCode: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/signup/ref=${encodeURIComponent(inviteCode)}`
}

/**
 * Extract referral code from URL
 * @param url - The URL to extract from
 * @returns The referral code or null if not found
 */
export const extractReferralCode = (url: string): string | null => {
  // Try to match ref=code pattern
  const refMatch = url.match(/ref=([^&]+)/)
  if (refMatch && refMatch[1]) {
    return decodeURIComponent(refMatch[1])
  }
  
  // Try to match as path parameter
  const pathMatch = url.match(/\/ref\/([^\/\?]+)/)
  if (pathMatch && pathMatch[1]) {
    return decodeURIComponent(pathMatch[1])
  }
  
  return null
}

/**
 * Validate referral code format
 * @param code - The referral code to validate
 * @returns boolean indicating if the code is valid
 */
export const validateReferralCode = (code: string): boolean => {
  // Basic validation - alphanumeric and some special characters, 3-20 characters
  const codeRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return codeRegex.test(code)
}

/**
 * Format referral code for display
 * @param code - The referral code to format
 * @returns Formatted referral code
 */
export const formatReferralCode = (code: string): string => {
  return code.toUpperCase()
}

/**
 * Copy referral link to clipboard
 * @param inviteCode - The user's invite code
 * @returns Promise that resolves when copied
 */
export const copyReferralLink = async (inviteCode: string): Promise<void> => {
  const link = generateReferralLink(inviteCode)
  try {
    await navigator.clipboard.writeText(link)
  } catch (error) {
    console.error('Failed to copy referral link:', error)
    throw error
  }
}

/**
 * Share referral link via Web Share API (mobile)
 * @param inviteCode - The user's invite code
 * @param title - Share title
 * @param text - Share text
 * @returns Promise that resolves when shared
 */
export const shareReferralLink = async (
  inviteCode: string, 
  title: string = 'Join UK ADS', 
  text: string = 'Join UK ADS and start earning with my referral code!'
): Promise<void> => {
  const link = generateReferralLink(inviteCode)
  
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: `${text} Use my referral code: ${inviteCode}`,
        url: link
      })
    } catch (error) {
      console.error('Failed to share referral link:', error)
      throw error
    }
  } else {
    // Fallback to copying to clipboard
    await copyReferralLink(inviteCode)
  }
} 

/**
 * Fetch referral data from API for current user
 * @param uid - User's unique identifier
 * @param forceRefresh - Force refresh from API
 * @returns Promise with referral data
 */
export const fetchUserReferralData = async (
  uid: string, 
  forceRefresh: boolean = false
): Promise<ReferralData | null> => {
  try {
    return await getUserReferrals(uid)
  } catch (error) {
    console.error('Error fetching user referral data:', error)
    return null
  }
}

/**
 * Get referral statistics for current user
 * @param uid - User's unique identifier
 * @returns Promise with referral statistics
 */
export const getReferralStats = async (uid: string): Promise<{
  totalReferrals: number
  totalEarnings: number
  activeReferrals: number
  inactiveReferrals: number
} | null> => {
  try {
    const referralData = await getUserReferrals(uid)
    
    const activeReferrals = referralData.invitedUsers.filter(user => user.status === 'active').length
    const inactiveReferrals = referralData.invitedUsers.filter(user => user.status === 'inactive').length
    
    return {
      totalReferrals: referralData.totalReferrals,
      totalEarnings: referralData.totalEarnings,
      activeReferrals,
      inactiveReferrals
    }
  } catch (error) {
    console.error('Error getting referral stats:', error)
    return null
  }
}

/**
 * Get recent referrals for current user
 * @param uid - User's unique identifier
 * @param limit - Maximum number of recent referrals to return
 * @returns Promise with recent referral data
 */
export const getRecentReferrals = async (
  uid: string, 
  limit: number = 5
): Promise<ReferralData['invitedUsers'] | null> => {
  try {
    const referralData = await getUserReferrals(uid)
    
    // Sort by joined date (most recent first) and limit results
    return referralData.invitedUsers
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting recent referrals:', error)
    return null
  }
}

/**
 * Check if user has any referrals
 * @param uid - User's unique identifier
 * @returns Promise with boolean indicating if user has referrals
 */
export const hasReferrals = async (uid: string): Promise<boolean> => {
  try {
    const referralData = await getUserReferrals(uid)
    return referralData.totalReferrals > 0
  } catch (error) {
    console.error('Error checking if user has referrals:', error)
    return false
  }
} 