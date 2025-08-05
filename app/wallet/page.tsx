"use client"

import React, { useState, useEffect } from 'react'
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import WithdrawModal from '../components/WithdrawModal'
import DepositModal from '../components/DepositModal'

const WalletPage = () => {
  const searchParams = useSearchParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  // Check for withdraw or deposit action in URL
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'withdraw') {
      setIsWithdrawModalOpen(true)
    } else if (action === 'deposit') {
      setIsDepositModalOpen(true)
    }
  }, [searchParams])

  const [activeTab, setActiveTab] = useState('ads-earning')

  const balanceData = {
    currentBalance: '0',
    totalBalance: '0',
    totalWithdraw: '0',
  }

  return (
    <div className="space-y-8">
      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <CreditCard className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">Current Balance</p>
          <h3 className="text-2xl font-bold">${balanceData.currentBalance}</h3>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <TrendingUp className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">Total Balance</p>
          <h3 className="text-2xl font-bold">${balanceData.totalBalance}</h3>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
          <TrendingDown className="h-10 w-10 mb-2 opacity-75" />
          <p className="text-sm font-light">Total Withdraw</p>
          <h3 className="text-2xl font-bold">${balanceData.totalWithdraw}</h3>
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
            onClick={() => setActiveTab('bonus')}
            className={`flex-1 text-center py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'bonus' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
            }`}
          >
            Bonus
          </button>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'ads-earning' && (
            <div className="text-center text-gray-500 py-10">
              <p>No Ads Earning yet.</p>
            </div>
          )}
          {activeTab === 'withdraw' && (
            <div className="text-center text-gray-500 py-10">
              <p>No withdrawal history.</p>
            </div>
          )}
          {activeTab === 'bonus' && (
            <div className="text-center text-gray-500 py-10">
              <p>No bonus history.</p>
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

export default WalletPage 