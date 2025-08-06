"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const TestSignupPage = () => {
  const router = useRouter()
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    inviteCode: 'TEST123'
  })
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTestSignup = async () => {
    setIsLoading(true)
    setError('')
    setResponse(null)

    try {
      const apiResponse = await fetch("https://watch2earn-vie97.ondigitalocean.app/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const data = await apiResponse.json()
      
      setResponse({
        status: apiResponse.status,
        ok: apiResponse.ok,
        data: data
      })

      if (!apiResponse.ok) {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestLogin = async () => {
    setIsLoading(true)
    setError('')
    setResponse(null)

    try {
      const apiResponse = await fetch("https://watch2earn-vie97.ondigitalocean.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testData.email,
          password: testData.password
        }),
      })

      const data = await apiResponse.json()
      
      setResponse({
        status: apiResponse.status,
        ok: apiResponse.ok,
        data: data
      })

      if (!apiResponse.ok) {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Signup API Test</h1>
      
      {/* Test Data */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Test Data</h2>
        <pre className="text-sm overflow-auto bg-white p-3 rounded border">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>

      {/* API Endpoints */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">API Endpoints</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Signup:</strong> POST https://watch2earn-vie97.ondigitalocean.app/api/signup</p>
          <p><strong>Login:</strong> POST https://watch2earn-vie97.ondigitalocean.app/api/login</p>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleTestSignup}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Signup'}
        </button>
        <button
          onClick={handleTestLogin}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Login'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-800 font-semibold mb-2">API Response</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {response.status}</p>
            <p><strong>Success:</strong> {response.ok ? 'Yes' : 'No'}</p>
            <p><strong>Response Data:</strong></p>
            <pre className="bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/signup')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Go to Signup Page
        </button>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Go to Login Page
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">Instructions</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Click "Test Signup" to test the signup API</li>
          <li>2. Click "Test Login" to test the login API</li>
          <li>3. Check the response data for any errors</li>
          <li>4. Use the navigation buttons to test the actual pages</li>
        </ol>
      </div>
    </div>
  )
}

export default TestSignupPage 