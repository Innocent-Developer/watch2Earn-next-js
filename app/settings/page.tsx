import React from 'react'
import { Metadata } from 'next'
import { Camera, Lock, LogOut } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings | UK ADS',
}

const SettingsPage = () => {
  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col items-center py-4">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
            {/* Placeholder for user avatar */}
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-dark-purple transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">User Details</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col p-4 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Abubakkar</p>
          <p className="text-sm text-gray-500">abubakkarsajid4@gmail.com</p>
          <p className="text-sm text-gray-500">03254472055</p>
        </div>
        <button className="flex items-center w-full p-4 border-b border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors">
          <Lock className="h-5 w-5 mr-3 text-primary" />
          <span>Change Password</span>
        </button>
        <button className="flex items-center w-full p-4 text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

export default SettingsPage 