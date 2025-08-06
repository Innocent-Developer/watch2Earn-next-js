// Referral utility functions

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