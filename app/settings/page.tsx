"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Lock, LogOut, Bell, Moon, Globe, Clock } from 'lucide-react'
import { getUserData, clearUserData, getUserInitials, getUserPreferences, updateUserPreferences, UserData } from '../utils/userStorage'

const SettingsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [preferences, setPreferences] = useState(getUserPreferences())

  useEffect(() => {
    // Get user data from localStorage using utility function
    const userData = getUserData()
    if (userData) {
      setUser(userData)
    } else {
      // If no user data, redirect to login
      router.replace("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    // Clear user data from localStorage using utility function
    clearUserData()
    // Redirect to login page
    router.replace("/login")
  }

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    alert("Change password functionality will be implemented soon!")
  }

  const handlePreferenceChange = (key: 'notifications' | 'theme' | 'language', value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    updateUserPreferences(newPreferences)
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never'
    return new Date(lastLogin).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col items-center py-4">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
            {/* Display user initials as avatar */}
            <span className="text-2xl font-bold text-gray-600">
              {getUserInitials()}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-dark-purple transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">User Details</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col p-4 border-b border-gray-200">
          <p className="font-semibold text-gray-800">{user.name || 'User'}</p>
          <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
          <p className="text-sm text-gray-500">{user.phone || user.phoneNumber || 'No phone provided'}</p>
          {user.level && (
            <p className="text-sm text-gray-500">Level: {user.level}</p>
          )}
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Last login: {formatLastLogin(user.lastLogin)}</span>
          </div>
        </div>
        
        <button 
          onClick={handleChangePassword}
          className="flex items-center w-full p-4 border-b border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <Lock className="h-5 w-5 mr-3 text-primary" />
          <span>Change Password</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-4 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Log out</span>
        </button>
      </div>

      {/* Preferences Section */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferences</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-3 text-primary" />
            <span className="text-gray-800">Notifications</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences?.notifications ?? true}
              onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Moon className="h-5 w-5 mr-3 text-primary" />
            <span className="text-gray-800">Dark Theme</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences?.theme === 'dark'}
              onChange={(e) => handlePreferenceChange('theme', e.target.checked ? 'dark' : 'light')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-3 text-primary" />
            <span className="text-gray-800">Language</span>
          </div>
          <select
            value={preferences?.language ?? 'en'}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 