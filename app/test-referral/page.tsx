"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  generateReferralLink, 
  extractReferralCode, 
  validateReferralCode, 
  formatReferralCode,
  copyReferralLink,
  shareReferralLink
} from '../utils/referralUtils'

const TestReferralPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [testCode, setTestCode] = useState('TEST123')
  const [testUrl, setTestUrl] = useState('')
  const [extractedCode, setExtractedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  // Get referral code from URL if present
  const urlRefCode = searchParams.get('ref')

  const handleGenerateLink = () => {
    const link = generateReferralLink(testCode)
    setTestUrl(link)
  }

  const handleExtractCode = () => {
    const code = extractReferralCode(testUrl)
    setExtractedCode(code || 'No code found')
  }

  const handleValidateCode = () => {
    const isValid = validateReferralCode(testCode)
    alert(`Code "${testCode}" is ${isValid ? 'valid' : 'invalid'}`)
  }

  const handleCopyLink = async () => {
    try {
      await copyReferralLink(testCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShareLink = async () => {
    try {
      setSharing(true)
      await shareReferralLink(testCode)
    } catch (error) {
      console.error('Failed to share:', error)
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Referral System Test</h1>
      
      {/* Current URL Referral Code */}
      {urlRefCode && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Referral Code from URL</h2>
          <p className="text-green-700">Code: <strong>{urlRefCode}</strong></p>
          <p className="text-sm text-green-600 mt-1">This code was extracted from the current URL</p>
        </div>
      )}

      {/* Test Referral Code */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Test Referral Code</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter test referral code"
          />
          <button
            onClick={handleValidateCode}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Validate
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Formatted: <strong>{formatReferralCode(testCode)}</strong>
        </p>
      </div>

      {/* Generate Referral Link */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-purple-800 mb-2">Generate Referral Link</h2>
        <div className="space-y-3">
          <button
            onClick={handleGenerateLink}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Generate Link
          </button>
          {testUrl && (
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Generated Link:</p>
              <p className="text-sm break-all">{testUrl}</p>
            </div>
          )}
        </div>
      </div>

      {/* Extract Referral Code */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-orange-800 mb-2">Extract Referral Code</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter URL with referral code"
          />
          <button
            onClick={handleExtractCode}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Extract Code
          </button>
          {extractedCode && (
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Extracted Code:</p>
              <p className="text-sm font-semibold">{extractedCode}</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy and Share */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Copy & Share</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleShareLink}
            disabled={sharing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {sharing ? 'Sharing...' : 'Share Link'}
          </button>
        </div>
      </div>

      {/* Test Links */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Test Links</h2>
        <div className="space-y-2">
          <button
            onClick={() => router.push('/signup?ref=TEST123')}
            className="block w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50"
          >
            /signup?ref=TEST123
          </button>
          <button
            onClick={() => router.push('/signup/ref=JOHN456')}
            className="block w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50"
          >
            /signup/ref=JOHN456
          </button>
          <button
            onClick={() => router.push('/referrals')}
            className="block w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50"
          >
            /referrals (Referral Management)
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">How to Test</h2>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Enter a referral code and test validation</li>
          <li>2. Generate a referral link</li>
          <li>3. Test extracting codes from URLs</li>
          <li>4. Try copying and sharing links</li>
          <li>5. Click test links to see how they work</li>
          <li>6. Visit /referrals to see the full referral page</li>
        </ol>
      </div>
    </div>
  )
}

export default TestReferralPage 