"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Wallet, Gift, Download, Video, Award, Users, Share2 } from 'lucide-react'
import { getUserData, UserData } from '../utils/userStorage'

const DashboardClient = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const userData = getUserData()
    if (!userData) {
      router.replace("/login")
    } else {
      setUser(userData)
    }
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  // Use real user data from localStorage
  const dashboardData = {
    currentIncome: user.totalBalance ?? '0.00',
    totalWithdraw: user.totalWithdrawals ?? '0.00',
    upliner: user.inviteCode ?? '',
    recentWithdrawal: `User ${user.name} Withdraw $${user.totalWithdrawals} USDT.`,
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