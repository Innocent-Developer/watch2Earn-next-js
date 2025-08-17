"use client"

import React, { useState, useEffect } from 'react'
import { X, Copy, CreditCard, DollarSign, Upload } from 'lucide-react'
import { getUserData } from '../utils/userStorage'
import axios from 'axios'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

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

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const [formData, setFormData] = useState({
    amount: '400',
    bankName: '',
    transactionId: '',
    senderName: '',
    senderPhone: '',
    pic: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAccountInfo()
    }
  }, [isOpen])

  const fetchAccountInfo = async () => {
    try {
      setIsLoadingAccounts(true)
      const response = await fetch('https://watch2earn-vie97.ondigitalocean.app/api/admin/account')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setAccountInfo(data)
      
      // Set the first active account as default selected account
      const activeAccount = data.find((account: AccountInfo) => account.isActive)
      if (activeAccount) {
        setSelectedAccount(activeAccount)
      } else if (data.length > 0) {
        setSelectedAccount(data[0])
      }
      
    } catch (error) {
      console.error('Error fetching account info:', error)
      setError('Failed to load account information. Please try again later.')
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Prevent amount field from being changed
    if (name === 'amount') {
      return
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB for cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }

    setSelectedFile(file)
    await uploadImageToCloudinary(file)
  }

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'blackstome')
    setIsUploadingImage(true)
    setError('')

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dha65z0gy/image/upload',
        formData
      )
      
      setFormData(prev => ({
        ...prev,
        pic: res.data.secure_url
      }))

    } catch (err: any) {
      console.error('Image upload failed:', err)
      setError('Image upload failed')
      setSelectedFile(null)
    } finally {
      setIsUploadingImage(false)
    }
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

  const handleAccountSelect = (account: AccountInfo) => {
    setSelectedAccount(account)
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
          amount: formData.amount,
          bankName: formData.bankName,
          transactionId: formData.transactionId,
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          pic: formData.pic,
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
        amount: '400',
        bankName: '',
        transactionId: '',
        senderName: '',
        senderPhone: '',
        pic: ''
      })
      setSelectedFile(null)
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
              min="400"
              max="400"
              step="1"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              placeholder="Fixed amount: 400"
            />
            <p className="text-xs text-gray-500 mt-1">Deposit amount is fixed at PKR 400</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter sender's phone number"
            />
          </div>

          <div>
            <label htmlFor="pic" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Screenshot (Optional)
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="pic" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> transaction screenshot
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="pic"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              {isUploadingImage && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                  <span className="text-sm text-gray-600">Uploading image...</span>
                </div>
              )}
              
              {selectedFile && formData.pic && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Upload className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                      <p className="text-xs text-green-600">Image uploaded successfully</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Copy our account number above</li>
              <li>2. Send exactly PKR 400 to our account</li>
              <li>3. Take a screenshot of the transaction (optional)</li>
              <li>4. Fill this form with transaction details</li>
              <li>5. We will verify and credit within 24 hours</li>
            </ol>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
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