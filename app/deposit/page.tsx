"use client"

import React, { useState, useEffect } from 'react'
import { CreditCard, Building2, User, Phone, Building, X, DollarSign, CheckCircle } from 'lucide-react'
import DepositModal from '../components/DepositModal'

interface AccountInfo {
  _id: string
  accountNumber: string
  accountHolderName: string
  bankName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}

const DepositPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchAccountInfo()
  }, [])

  const fetchAccountInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://watch2earn-vie97.ondigitalocean.app/api/admin/account')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setAccountInfo(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching account info:', error)
      setError('Failed to load account information. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for the business card. This would typically come from an API or state management.
  const cardData = {
    cardNumber: '03254472055',
    price: '400 PKR',
    validity: 'Life Time',
    referralBonus: 'Upto 5 Level',
    dailyLimit: '5 Ads',
  }

  const handleBuyNow = () => {
    setShowDepositModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Deposit</h1>
        <p className="mt-2 text-lg text-gray-600">Activate Your Digital Business Card</p>
      </div>
      
      {/* The main business card section with enhanced animations */}
      <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 ease-in-out hover:shadow-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center animate-pulse">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4 animate-bounce">
                <CreditCard className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-wider">primeWatcher Business Card</h2>
            </div>
            
            {/* Enhanced card details with animations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-sm font-light opacity-90 mb-2">Card Number</p>
                <p className="font-bold text-lg tracking-wider">{cardData.cardNumber}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-sm font-light opacity-90 mb-2">Price</p>
                <p className="font-bold text-lg text-yellow-300">{cardData.price}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-sm font-light opacity-90 mb-2">Validity</p>
                <p className="font-bold text-lg">{cardData.validity}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-sm font-light opacity-90 mb-2">Referral Bonus</p>
                <p className="font-bold text-lg text-green-300">{cardData.referralBonus}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-sm font-light opacity-90 mb-2">Daily Limit</p>
                <p className="font-bold text-lg text-blue-300">{cardData.dailyLimit}</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Buy Now button */}
          {isMounted && (
            <div className="flex-shrink-0">
              <button 
                onClick={handleBuyNow}
                className="group relative bg-white text-primary font-bold py-4 px-10 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <span className="relative z-10 flex items-center">
                  <DollarSign className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Buy Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Information from API */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center mb-6">
          {/* <Bank className="h-6 w-6 text-primary mr-3" /> */}
          <h3 className="text-xl font-semibold text-gray-800">Bank Account Information</h3>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading account information...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && accountInfo && accountInfo.length > 0 ? (
          <div className="space-y-4">
            {accountInfo.map((account) => (
              <div key={account._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-semibold text-gray-800">{account.bankName}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="font-medium text-gray-800">{account.accountHolderName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-800">{account.accountNumber}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(account.createdAt)}</span>
                    <span>Updated: {formatDate(account.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && !error && (!accountInfo || accountInfo.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            {/* <Bank className="h-12 w-12 mx-auto mb-4 text-gray-400" /> */}
            <p>No account information available</p>
          </div>
        ) : null}
      </div>

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  )
}

export default DepositPage 