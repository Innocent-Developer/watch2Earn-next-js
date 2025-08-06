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
  AlertCircle
} from 'lucide-react'
import { getUserData, UserData } from '../utils/userStorage'
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
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: '0.00',
    thisMonth: 0
  })

  useEffect(() => {
    const userData = getUserData()
    if (!userData) {
      router.replace("/login")
      return
    }
    setUser(userData)
    setIsLoading(false)
    
    // TODO: Fetch referral statistics from API
    // For now, using mock data
    setReferralStats({
      totalReferrals: 5,
      activeReferrals: 3,
      totalEarnings: '150.00',
      thisMonth: 2
    })
  }, [router])

  const handleCopyLink = async () => {
    if (!user?.inviteCode) return
    
    try {
      await copyReferralLink(user.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShareLink = async () => {
    if (!user?.inviteCode) return
    
    try {
      setSharing(true)
      await shareReferralLink(user.inviteCode)
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

  const referralLink = user.inviteCode ? generateReferralLink(user.inviteCode) : ''

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Referral Program</h1>
        <p className="text-gray-600">Invite friends and earn rewards together</p>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Gift className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Your Referral Code</h2>
        </div>
        
        {user.inviteCode ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75">Your Code</p>
                  <p className="text-2xl font-bold">{formatReferralCode(user.inviteCode)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Status</p>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Active</span>
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
            <p className="text-gray-600">No referral code available</p>
            <p className="text-sm text-gray-500">Contact support to get your referral code</p>
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
              <p className="text-2xl font-bold text-gray-800">${referralStats.totalEarnings}</p>
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
              <li>• $5 bonus when referral signs up</li>
              <li>• 10% commission on their earnings</li>
              <li>• Level bonuses for active referrals</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">For Your Referral</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• $3 welcome bonus</li>
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