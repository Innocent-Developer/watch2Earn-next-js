"use client"

import React, { useState } from 'react'
import { X, Copy, CreditCard, DollarSign } from 'lucide-react'
import { getUserData } from '../utils/userStorage'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    transactionId: '',
    senderName: '',
    senderPhone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const accountDetails = {
    accountNumber: '03254472055',
    accountName: 'UK ADS Business', 
    bankName: 'EasyPaisa / JazzCash',
    accountType: 'Mobile Account'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const userData = getUserData()
      if (!userData?.uid) {
        setError('Please login to submit a deposit request')
        return
      }

      const response = await fetch('https://watch2earn-vie97.ondigitalocean.app/api/deposite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          uid: userData.uid
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit deposit request')
      }

      alert('Deposit request submitted successfully! We will verify and credit your account within 24 hours.')
      onClose()
      setFormData({
        amount: '',
        bankName: '',
        transactionId: '',
        senderName: '',
        senderPhone: ''
      })
    } catch (err: any) {
      setError(err.message || 'Failed to submit deposit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Deposit Request</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Account Details Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Account Details</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Account Number</span>
                <button
                  onClick={() => copyToClipboard(accountDetails.accountNumber)}
                  className="text-primary hover:text-dark-purple transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-lg font-bold text-gray-800">{accountDetails.accountNumber}</p>
              {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Account Name</p>
                <p className="font-semibold text-gray-800">{accountDetails.accountName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bank</p>
                <p className="font-semibold text-gray-800">{accountDetails.bankName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount (PKR)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="1"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Bank/Payment Method
            </label>
            <select
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option value="">Select your bank</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
              <option value="bank">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID/Reference
            </label>
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter transaction ID or reference number"
            />
          </div>

          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
              Sender Name
            </label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter sender's full name"
            />
          </div>

          <div>
            <label htmlFor="senderPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Sender Phone Number
            </label>
            <input
              type="tel"
              id="senderPhone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter sender's phone number"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Copy our account number above</li>
              <li>2. Send the amount to our account</li>
              <li>3. Fill this form with transaction details</li>
              <li>4. We will verify and credit within 24 hours</li>
            </ol>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Deposit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DepositModal