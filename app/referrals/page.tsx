"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Copy, 
  Share2, 
  Users, 
  Gift, 
  TrendingUp, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  CreditCard,
  QrCode
} from 'lucide-react'
import { getUserData, UserData, setUserData } from '../utils/userStorage'
import { 
  generateReferralLink, 
  copyReferralLink, 
  shareReferralLink, 
  formatReferralCode 
} from '../utils/referralUtils'

const ReferralsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showReferralCard, setShowReferralCard] = useState(false)
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: '0.00',
    thisMonth: 0
  })

  // Function to generate a unique referral code
  const generateReferralCode = (identifier: string | number | undefined): string => {
    // Fallback if identifier is undefined or invalid
    const fallbackId = identifier || 'USER'
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    const identifierStr = fallbackId.toString().substring(0, 4)
    const code = `${identifierStr}${timestamp}${randomStr}`.toUpperCase()
    console.log('Generated referral code:', code, 'from identifier:', identifier)
    return code
  }

  useEffect(() => {
    setIsMounted(true)
    const userData = getUserData()
    if (!userData) {
      router.replace("/login")
      return
    }
    
    console.log('User data from storage:', userData)
    
    // Generate referral code if user doesn't have one
    if (!userData.referralCode) {
      console.log('No referral code found, generating new one...')
      const identifier = (userData.uid || userData.id || userData.phoneNumber || userData.email || 'USER').toString()
      console.log('Using identifier for code generation:', identifier)
      
      const generatedCode = generateReferralCode(identifier)
      console.log('Generated code:', generatedCode)
      
      const updatedUser = { ...userData, referralCode: generatedCode }
      setUserData(updatedUser)
      setUser(updatedUser)
      console.log('Updated user data:', updatedUser)
    } else {
      console.log('User already has referral code:', userData.referralCode)
      setUser(userData)
    }
    
    setIsLoading(false)
    
    // TODO: Fetch referral statistics from API
    // For now, using mock data
    setReferralStats({
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: '0',
      thisMonth: 0
    })
  }, [router])

  const handleCopyLink = async () => {
    if (!user?.referralCode) return
    
    try {
      await copyReferralLink(user.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return
    
    try {
      await navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral code:', error)
    }
  }

  const handleShareLink = async () => {
    if (!user?.referralCode) return
    
    try {
      setSharing(true)
    await shareReferralLink(user.referralCode)
    } catch (error) {
      console.error('Failed to share link:', error)
    } finally {
      setSharing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const referralLink = user.referralCode ? generateReferralLink(user.referralCode) : ''

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Referral Program</h1>
        <p className="text-gray-600">Invite friends and earn rewards together</p>
      </div>

      {/* Referral Card Display */}
      {user?.referralCode && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Your Referral Card</h2>
            </div>
            <button
              onClick={() => setShowReferralCard(!showReferralCard)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark-purple transition-colors"
            >
              {showReferralCard ? 'Hide Card' : 'Show Card'}
            </button>
          </div>

          {showReferralCard && (
            <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary text-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">primeWatcher</h3>
                  <p className="text-sm opacity-75">Referral Card</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Gift className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm opacity-75 mb-1">Referral Code</p>
                  <div className="flex items-center space-x-3">
                    <p className="text-3xl font-bold tracking-wider">{formatReferralCode(user.referralCode || '')}</p>
                    <button
                      onClick={handleCopyReferralCode}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                      title="Copy referral code"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs opacity-75 mb-1">Total Referrals</p>
                    <p className="text-xl font-bold">{referralStats.totalReferrals}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs opacity-75 mb-1">Total Earnings</p>
                    <p className="text-xl font-bold">PKR {referralStats.totalEarnings}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-75">Member Since</p>
                  <p className="text-sm font-semibold">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={handleCopyReferralCode}
                  className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Referral Code Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Gift className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Your Referral Code</h2>
        </div>
        
        {user?.referralCode ? (
          <div className="space-y-4">
            {/* Enhanced Referral Code Display */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <p className="text-sm opacity-75 mb-2">Your Unique Referral Code</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <p className="text-4xl font-bold tracking-widest text-white">
                    {formatReferralCode(user.referralCode || '')}
                  </p>
                </div>
                <button
                  onClick={handleCopyReferralCode}
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  {copied ? 'Copied!' : 'Copy Referral Code'}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Active & Ready to Use</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Referral Link</span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-dark-purple transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleShareLink}
                    disabled={sharing}
                    className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    {sharing ? 'Sharing...' : 'Share'}
                  </button>
                </div>
              </div>
              <div className="bg-white p-3 rounded border text-sm text-gray-600 break-all">
                {referralLink}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Generating your referral code...</p>
            <p className="text-sm text-gray-500">Please refresh the page in a moment</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark-purple transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-800">{referralStats.totalReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Referrals</p>
              <p className="text-2xl font-bold text-gray-800">{referralStats.activeReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{referralStats.thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">PKR {referralStats.totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Share Your Code</h3>
            <p className="text-sm text-gray-600">Share your unique referral code with friends and family</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">They Sign Up</h3>
            <p className="text-sm text-gray-600">When they use your code to sign up, you both get rewards</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Earn Together</h3>
            <p className="text-sm text-gray-600">Both you and your referral earn bonuses when they become active</p>
          </div>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Referral Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">For You</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• PKR 5 bonus when referral signs up</li>
              <li>• 10% commission on their earnings</li>
              <li>• Level bonuses for active referrals</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">For Your Referral</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• PKR 3 welcome bonus</li>
              <li>• 5% extra earnings</li>
              <li>• Priority support access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralsPage 