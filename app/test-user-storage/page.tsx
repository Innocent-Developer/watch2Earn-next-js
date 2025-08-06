"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getUserData, 
  setUserData, 
  clearUserData, 
  updateUserData, 
  isUserLoggedIn,
  getUserDisplayName,
  getUserInitials,
  updateLastLogin,
  getUserPreferences,
  updateUserPreferences,
  UserData 
} from '../utils/userStorage'

const TestUserStoragePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [preferences, setPreferences] = useState(getUserPreferences())
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userData = getUserData()
    setUser(userData)
    setIsLoggedIn(isUserLoggedIn())
  }, [])

  const handleSetSampleUser = () => {
    const sampleUser: UserData = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      totalBalance: '150.00',
      totalWithdrawals: '50.00',
      inviteCode: 'JOHN123',
      level: 'VIP1',
      lastLogin: new Date().toISOString(),
      isActive: true,
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    }
    setUserData(sampleUser)
    setUser(sampleUser)
    setIsLoggedIn(true)
  }

  const handleUpdateUser = () => {
    if (user) {
      const updatedUser = { ...user, totalBalance: '200.00' }
      updateUserData(updatedUser)
      setUser(updatedUser)
    }
  }

  const handleUpdatePreferences = () => {
    const newPreferences = {
      notifications: !preferences?.notifications,
      theme: (preferences?.theme === 'light' ? 'dark' : 'light') as 'light' | 'dark',
      language: 'es'
    }
    updateUserPreferences(newPreferences)
    setPreferences(newPreferences)
  }

  const handleClearUser = () => {
    clearUserData()
    setUser(null)
    setIsLoggedIn(false)
  }

  const handleUpdateLastLogin = () => {
    updateLastLogin()
    const updatedUser = getUserData()
    setUser(updatedUser)
  }

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Storage Test Page</h1>
      
      {/* Current Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Status</h2>
        <p><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
        <p><strong>Display Name:</strong> {getUserDisplayName()}</p>
        <p><strong>User Initials:</strong> {getUserInitials()}</p>
      </div>

      {/* User Data Display */}
      {user && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current User Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      {/* Preferences Display */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Preferences</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleSetSampleUser}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Set Sample User
        </button>
        
        <button
          onClick={handleUpdateUser}
          disabled={!user}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          Update User Balance
        </button>
        
        <button
          onClick={handleUpdatePreferences}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Toggle Preferences
        </button>
        
        <button
          onClick={handleUpdateLastLogin}
          disabled={!user}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          Update Last Login
        </button>
        
        <button
          onClick={handleClearUser}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear User Data
        </button>
        
        <button
          onClick={() => router.push('/settings')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Go to Settings
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Set Sample User" to create a test user in localStorage</li>
          <li>Use "Update User Balance" to modify user data</li>
          <li>Use "Toggle Preferences" to change user preferences</li>
          <li>Use "Update Last Login" to update the login timestamp</li>
          <li>Use "Clear User Data" to remove all user data</li>
          <li>Go to Settings page to see the user data in action</li>
        </ol>
      </div>

      {/* localStorage Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">localStorage Info</h2>
        <p className="text-sm">
          <strong>Key:</strong> "user"<br/>
          <strong>Type:</strong> JSON string<br/>
          <strong>Persistence:</strong> Survives browser restarts<br/>
          <strong>Scope:</strong> Per domain
        </p>
      </div>
    </div>
  )
}

export default TestUserStoragePage 