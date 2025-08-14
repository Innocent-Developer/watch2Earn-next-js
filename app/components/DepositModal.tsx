"use client"

import React, { useState, useEffect } from 'react'
import { X, Copy, CreditCard, DollarSign, Upload } from 'lucide-react'
import { getUserData } from '../utils/userStorage'

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
    amount: '',
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

    // Validate file size (max 2MB to avoid 413 error)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB')
      return
    }

    setSelectedFile(file)
    await uploadImageToR2(file)
  }

  const uploadImageToR2 = async (file: File) => {
    try {
      setIsUploadingImage(true)
      setError('')

      // Compress image before converting to base64
      const compressedFile = await compressImage(file, 0.7) // 70% quality
      const base64 = await convertFileToBase64(compressedFile)
      
      setFormData(prev => ({
        ...prev,
        pic: base64
      }))

    } catch (err: any) {
      setError(err.message || 'Failed to process image')
      setSelectedFile(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Helper function to compress image
  const compressImage = (file: File, quality: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = error => reject(error)
    })
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

        {/* Account Details Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Account Details</h3>
          
          {isLoadingAccounts ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Loading account information...</span>
            </div>
          ) : accountInfo.length > 0 ? (
            <div className="space-y-4">
              {/* Account Selection */}
              {accountInfo.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account
                  </label>
                  <select
                    value={selectedAccount?.id || ''}
                    onChange={(e) => {
                      const account = accountInfo.find(acc => acc.id === e.target.value)
                      if (account) setSelectedAccount(account)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {accountInfo.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} - {account.accountHolderName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected Account Details */}
              {selectedAccount && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Account Number</span>
                      <button
                        onClick={() => copyToClipboard(selectedAccount.accountNumber)}
                        className="text-primary hover:text-dark-purple transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{selectedAccount.accountNumber}</p>
                    {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Account Holder Name</p>
                      <p className="font-semibold text-gray-800">{selectedAccount.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bank Name</p>
                      <p className="font-semibold text-gray-800">{selectedAccount.bankName}</p>
                    </div>
                    {selectedAccount.isActive && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                        Active Account
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No account information available</p>
            </div>
          )}
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
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
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
                  <span className="text-sm text-gray-600">Processing image...</span>
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
                      <p className="text-xs text-green-600">Image processed successfully</p>
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
              <li>2. Send the amount to our account</li>
              <li>3. Take a screenshot of the transaction (optional)</li>
              <li>4. Fill this form with transaction details</li>
              <li>5. We will verify and credit within 24 hours</li>
            </ol>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedAccount || isUploadingImage}
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