"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, Gift } from 'lucide-react'
import { setUserData, isUserLoggedIn, getUserData } from '../utils/userStorage'

const SignupPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  const [isInviteCodeFromUrl, setIsInviteCodeFromUrl] = useState(false)
  const [isNameFromUserData, setIsNameFromUserData] = useState(false)

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isUserLoggedIn()) {
      router.replace("/")
    }

    // Get referral code from URL parameter
    const refCode = searchParams.get('ref')
    if (refCode) {
      setFormData(prev => ({
        ...prev,
        inviteCode: refCode
      }))
      setIsInviteCodeFromUrl(true)
    }

    // Try to get user data from localStorage for auto-filling name
    const userData = getUserData()
    if (userData?.name) {
      setFormData(prev => ({
        ...prev,
        name: userData.name
      }))
      setIsNameFromUserData(true)
    }
  }, [router, searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    // Prevent editing invite code if it came from URL
    if (name === 'inviteCode' && isInviteCodeFromUrl) {
      return
    }
    
    // Prevent editing name if it came from user data
    if (name === 'name' && isNameFromUserData) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage("Name is required")
      return false
    }
    if (!formData.email.trim()) {
      setMessage("Email is required")
      return false
    }
    if (!formData.phone.trim()) {
      setMessage("Phone number is required")
      return false
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match")
      return false
    }
    if (!formData.agreeToTerms) {
      setMessage("You must agree to the terms and conditions")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("https://watch2earn-vie97.ondigitalocean.app/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          inviteCode: formData.inviteCode || undefined
        }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setMessageType('success')
        setMessage(data.message || "Registration successful! Please log in.")
        
        // Auto-login after successful registration
        setTimeout(() => {
          setUserData(data.user)
          router.replace("/")
        }, 2000)
      } else {
        setMessageType('error')
        setMessage(data.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      setMessageType('error')
      setMessage("Registration failed. Please check your connection and try again.")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 mb-6 relative">
            <Image 
              src="/app/favicon.ico" 
              alt="UK ADS Logo" 
              width={80} 
              height={80} 
              className="rounded-full shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Join UK ADS and start earning
          </p>
          {formData.inviteCode && isInviteCodeFromUrl && (
            <div className="mt-2 flex items-center justify-center text-sm text-primary">
              <Gift className="h-4 w-4 mr-1" />
              <span>Referred by: {formData.inviteCode}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  required
                  readOnly={isNameFromUserData}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    isNameFromUserData ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your full name"
                />
                {isNameFromUserData && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Auto-filled</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Invite Code Field */}
            <div className="relative">
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                Invite Code {isInviteCodeFromUrl ? '(Auto-filled)' : '(Optional)'}
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="inviteCode"
                  name="inviteCode"
                  type="text"
                  value={formData.inviteCode}
                  onChange={handleInputChange}
                  readOnly={isInviteCodeFromUrl}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    isInviteCodeFromUrl ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder={isInviteCodeFromUrl ? "Referral code applied" : "Enter invite code (optional)"}
                />
                {isInviteCodeFromUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Applied</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:text-dark-purple">
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:text-dark-purple">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:text-dark-purple font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage