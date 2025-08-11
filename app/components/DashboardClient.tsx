"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Wallet, Gift, Download, Video, Award, Users, Share2 } from 'lucide-react'
import { getUserData, UserData } from '../utils/userStorage'

const DashboardClient = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async (uid: number) => {
    try {
      setError(null)
      const response = await fetch(`https://watch2earn-vie97.ondigitalocean.app/api/admin/user/${uid}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setUserData(data.data.user)
      } else {
        throw new Error(data.message || 'Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load user data. Using local data.')
      // Use local user data as fallback
      const localUserData = getUserData()
      if (localUserData) {
        setUserData(localUserData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const localUserData = getUserData()
    if (!localUserData) {
      router.replace("/login")
      return
    }
    
    setUser(localUserData)
    
    // Use local data as initial fallback
    setUserData(localUserData)
    
    if (localUserData.uid) {
      fetchUserData(localUserData.uid)
    } else {
      setIsLoading(false)
    }
  }, [router])

  // Remove the interval to prevent infinite loops
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (user?.uid) {
  //       fetchUserData(user.uid)
  //     }
  //   }, 30000)
  //   return () => clearInterval(interval)
  // }, [user?.uid])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Use real user data from API or fallback to local data
  const dashboardData = {
    currentIncome: userData?.totalBalance ?? user?.totalBalance ?? '0.00',
    totalWithdraw: userData?.totalWithdrawals ?? user?.totalWithdrawals ?? '0.00',
    upliner: userData?.inviteCode ?? user?.inviteCode ?? '',
    recentWithdrawal: `User ${userData?.name ?? user?.name ?? 'User'} Withdraw $${userData?.totalWithdrawals ?? user?.totalWithdrawals ?? '0'} USDT.`,
  }

  const mainActions = [
    { name: 'Withdraw', icon: DollarSign, color: 'text-pink-500', href: '/wallet?action=withdraw' },
    { name: 'Deposit', icon: Wallet, color: 'text-indigo-500', href: '/deposit' },
    { name: 'Wallet', icon: Wallet, color: 'text-green-500', href: '/wallet' },
    { name: 'Reward', icon: Gift, color: 'text-yellow-500', href: '/rewards' },
    { name: 'Download', icon: Download, color: 'text-blue-500', href: '/download' },
  ]

  const bottomActions = [
    { name: 'Watch Ads', icon: Video, color: 'text-red-500', href: '/watch-ads' },
    { name: 'Bonus', icon: Award, color: 'text-yellow-500', href: '/bonus' },
    { name: 'View Team', icon: Users, color: 'text-purple-500', href: '/team' },
    { name: 'Socials', icon: Share2, color: 'text-green-500', href: '/socials' },
  ]

  return (
    <div className="space-y-8">
      {/* Error message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Top income/withdrawals section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col items-center p-4">
          <h3 className="text-lg font-medium text-gray-500">Current Income</h3>
          <p className="text-3xl font-bold text-gray-900">${dashboardData.currentIncome}</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <h3 className="text-lg font-medium text-gray-500">Total Withdraw</h3>
          <p className="text-3xl font-bold text-gray-900">${dashboardData.totalWithdraw}</p>
        </div>
        <div className="md:col-span-2 text-center text-sm text-gray-600 border-t pt-4 mt-4">
          Upliner: <span className="font-semibold text-primary">{dashboardData.upliner}</span>
        </div>
      </div>

      {/* Main action icons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {mainActions.map((action) => (
          <Link key={action.name} href={action.href} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className={`p-4 rounded-full bg-gray-100 mb-2`}>
              <action.icon className={`h-8 w-8 ${action.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.name}</span>
          </Link>
        ))}
      </div>

      {/* Ticker banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl shadow-lg text-center overflow-hidden">
        <span className="animate-pulse">{dashboardData.recentWithdrawal}</span>
      </div>

      {/* Bottom action icons grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bottomActions.map((action) => (
          <Link key={action.name} href={action.href} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className={`p-4 rounded-full bg-gray-100 mb-2`}>
              <action.icon className={`h-8 w-8 ${action.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardClient