"use client"

import React, { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'

/**
 * Renders the Deposit page component.
 * This page displays information about a digital business card and a 'Buy Now' button.
 */
const DepositPage = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mock data for the business card. This would typically come from an API or state management.
  const cardData = {
    cardNumber: '03254472055',
    price: '699 PKR',
    validity: 'Life Time',
    referralBonus: 'Upto 5 Level',
    dailyLimit: '5 Ads',
  }

  const handleBuyNow = () => {
    // For now, just show an alert instead of opening modal
    alert('Deposit functionality will be implemented soon! Please contact support for deposits.')
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Deposit</h1>
        <p className="mt-2 text-lg text-gray-600">Activate Your Digital Business Card</p>
      </div>
      
      {/* The main business card section, styled with a gradient background */}
      <div className="bg-primary text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center">
            {/* Icon for the business card */}
            <CreditCard className="h-10 w-10 text-white opacity-75 mr-4" />
            <h2 className="text-2xl font-bold">UK ADS Business Card</h2>
          </div>
          {/* Grid to display the card details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-light opacity-75">Card Number</p>
              <p className="font-semibold">{cardData.cardNumber}</p>
            </div>
            <div>
              <p className="text-sm font-light opacity-75">Price</p>
              <p className="font-semibold">{cardData.price}</p>
            </div>
            <div>
              <p className="text-sm font-light opacity-75">Validity</p>
              <p className="font-semibold">{cardData.validity}</p>
            </div>
            <div>
              <p className="text-sm font-light opacity-75">Referral Bonus</p>
              <p className="font-semibold">{cardData.referralBonus}</p>
            </div>
            <div>
              <p className="text-sm font-light opacity-75">Daily Limit</p>
              <p className="font-semibold">{cardData.dailyLimit}</p>
            </div>
          </div>
        </div>
        {/* 'Buy Now' button - Only render when mounted */}
        {isMounted && (
          <button 
            onClick={handleBuyNow}
            className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-light-purple focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Note about deposit method */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Note: Deposit Only With Your Registered Number.</p>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Number:</span>
            <span className="font-semibold">{cardData.cardNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Name:</span>
            <span className="font-semibold">UK ADS Business</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold">EasyPaisa / JazzCash</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositPage 