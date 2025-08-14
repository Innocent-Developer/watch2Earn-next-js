"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import WithdrawModal from '../components/WithdrawModal'
import DepositModal from '../components/DepositModal'
import { getUserData, setUserData } from '../utils/userStorage'
import { useUserData } from '../utils/useUserData'
import { getUserProfile, getUserAdsEarnings, type AdsEarningData } from '../utils/api'

const WalletPageContent = () => {
  const searchParams = useSearchParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [adsEarnings, setAdsEarnings] = useState<AdsEarningData[]>([])
  const [isLoadingAdsEarnings, setIsLoadingAdsEarnings] = useState(false)

  // Get current user from localStorage
  const currentUser = getUserData()
  
  // Use the user data hook to fetch transaction data
  const { userData, deposits, withdrawals, isLoading } = useUserData(
    currentUser?.id || '',
    currentUser?.email || '',
    { initialRefresh: true }
  )

  // Fetch user profile data with balance information
  const fetchUserProfile = async () => {
    if (!currentUser?.uid) {
      setIsLoadingProfile(false)
      return
    }
    
    try {
      setIsLoadingProfile(true)
      const profile = await getUserProfile(currentUser.uid)
      setProfileData(profile)
      
      // Update localStorage with fresh data
      if (profile) {
        const updatedUser = { ...currentUser, ...profile }
        setUserData(updatedUser)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Use local data as fallback
      setProfileData(currentUser)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Fetch ads earning history
  const fetchAdsEarnings = async () => {
    if (!currentUser?.uid) return
    
    try {
      setIsLoadingAdsEarnings(true)
      const earnings = await getUserAdsEarnings(currentUser.uid)
      setAdsEarnings(earnings)
    } catch (error) {
      console.error('Error fetching ads earnings:', error)
      setAdsEarnings([])
    } finally {
      setIsLoadingAdsEarnings(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
    fetchAdsEarnings()
  }, [currentUser?.uid])

  // Check for withdraw or deposit action in URL
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'withdraw') {
      setIsWithdrawModalOpen(true)
    } else if (action === 'deposit') {
      setIsDepositModalOpen(true)
    }
  }, [searchParams])

  const [activeTab, setActiveTab] = useState('withdraw')

  // Calculate balance data from real API data
  const calculateBalanceData = () => {
    // Use fresh profile data first, then fallback to localStorage
    const userToUse = profileData || currentUser
    
    if (!userToUse) {
      return {
        currentBalance: '0',
        totalBalance: '0',
        totalWithdraw: '0',
      }
    }

    // Get values directly from user object
    const totalBalance = parseFloat(userToUse.totalBalance?.toString() || '0')
    const totalWithdrawals = parseFloat(userToUse.totalWithdrawals?.toString() || '0')
    
    // Current balance = total balance - total withdrawals
    const currentBalance = totalWithdrawals - totalBalance
    const totalWithdraw = totalWithdrawals 

    return {
      currentBalance: currentBalance.toFixed(2),
      totalBalance: totalBalance.toFixed(2),
      totalWithdraw: totalWithdraw.toFixed(2),
    }
  }

  const balanceData = calculateBalanceData()
  const isBalanceLoading = isLoadingProfile || isLoading

  return (
    <div className="space-y-8">
      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <CreditCard className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">Total Balance</p>
          <h3 className="text-2xl font-bold">
            {isBalanceLoading ? '...' : `PKR ${balanceData.currentBalance}`}
          </h3>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <TrendingUp className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">  Current Balance</p>
          <h3 className="text-2xl font-bold">
            {isBalanceLoading ? '...' : `PKR ${balanceData.totalBalance}`}
          </h3>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <TrendingDown className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">Total Withdraw</p>
          <h3 className="text-2xl font-bold">
            {isBalanceLoading ? '...' : `PKR ${balanceData.totalWithdraw}`}
          </h3>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-dark-purple transition-colors shadow-lg"
        >
          Request Withdrawal
        </button>
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
        >
          Make Deposit
        </button>
      </div>

      {/* History section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">History</h2>
        <div className="flex justify-between items-center bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab('ads-earning')}
            className={`flex-1 text-center py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'ads-earning' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
            }`}
          >
            Ads Earning
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 text-center py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'withdraw' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex-1 text-center py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'deposits' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
            }`}
          >
            Deposits
          </button>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'ads-earning' && (
            <div>
              {isLoadingAdsEarnings ? (
                <div className="text-center text-gray-500 py-10">
                  <p>Loading ads earning history...</p>
                </div>
              ) : adsEarnings && adsEarnings.length > 0 ? (
                <div className="space-y-3">
                  {adsEarnings.map((earning, index) => (
                    <div key={`${earning.adId}-${earning.watchedAt}-${index}`} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">PKR {earning.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          Ad watched: {earning.adId}
                        </p>
                        <p className="text-sm text-gray-500">
                          {earning.watchedAt ? new Date(earning.watchedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date not available'}
                        </p>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Earned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <p>No ads earning yet. Start watching ads to earn money!</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'withdraw' && (
            <div>
              {isLoading ? (
                <div className="text-center text-gray-500 py-10">
                  <p>Loading withdrawal history...</p>
                </div>
              ) : withdrawals && withdrawals.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">PKR {withdrawal.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : withdrawal.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <p>No withdrawal history.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'deposits' && (
            <div>
              {isLoading ? (
                <div className="text-center text-gray-500 py-10">
                  <p>Loading deposit history...</p>
                </div>
              ) : deposits && deposits.length > 0 ? (
                <div className="space-y-3">
                  {deposits.map((deposit) => (
                    <div key={deposit.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">PKR {deposit.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(deposit.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          deposit.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : deposit.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <p>No deposit history.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
      />

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
      />
    </div>
  )
}

const WalletPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <WalletPageContent />
  </Suspense>
)

export default WalletPage