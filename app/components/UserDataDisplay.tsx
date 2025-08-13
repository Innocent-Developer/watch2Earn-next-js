'use client'

import React from 'react'
import { useUserData } from '../utils/useUserData'
import { getUserData } from '../utils/userStorage'

interface UserDataDisplayProps {
  uid?: string
  email?: string
}

export const UserDataDisplay: React.FC<UserDataDisplayProps> = ({ uid, email }) => {
  // Get user data from localStorage if not provided as props
  const localUser = getUserData()
  const userId = uid || localUser?.id || ''
  const userEmail = email || localUser?.email || ''

  const {
    userData,
    withdrawals,
    deposits,
    referrals,
    isLoading,
    isRefreshing,
    error,
    refresh,
    refreshWithdrawals,
    refreshDeposits,
    refreshReferrals,
    clearError
  } = useUserData(userId, userEmail, {
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    initialRefresh: true
  })

  if (!userId || !userEmail) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please provide UID and email or ensure user is logged in</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">Loading user data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={clearError}
          className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Clear Error
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Data Dashboard</h2>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Withdrawals Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Withdrawals</h3>
          <button
            onClick={refreshWithdrawals}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        
        {withdrawals.length === 0 ? (
          <p className="text-gray-500">No withdrawals found</p>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">PKR {withdrawal.amount}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                    withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                    withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(withdrawal.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposits Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Deposits</h3>
          <button
            onClick={refreshDeposits}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        
        {deposits.length === 0 ? (
          <p className="text-gray-500">No deposits found</p>
        ) : (
          <div className="space-y-2">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">PKR {deposit.amount}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                    deposit.status === 'completed' ? 'bg-green-100 text-green-800' :
                    deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {deposit.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(deposit.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referrals Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Referrals</h3>
          <button
            onClick={refreshReferrals}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        
        {!referrals ? (
          <p className="text-gray-500">No referral data found</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{referrals.totalReferrals}</div>
                <div className="text-sm text-blue-800">Total Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">PKR {referrals.totalEarnings}</div>
                <div className="text-sm text-green-800">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{referrals.inviteCode}</div>
                <div className="text-sm text-purple-800">Invite Code</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Invited Users</h4>
              {referrals.invitedUsers.length === 0 ? (
                <p className="text-gray-500">No invited users yet</p>
              ) : (
                <div className="space-y-2">
                  {referrals.invitedUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{user.name || user.email}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Summary */}
      {userData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Withdrawals:</span>
              <span className="ml-2 font-medium">
                PKR {withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Deposits:</span>
              <span className="ml-2 font-medium">
                PKR {deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pending Withdrawals:</span>
              <span className="ml-2 font-medium">
                {withdrawals.filter(w => w.status === 'pending').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Active Referrals:</span>
              <span className="ml-2 font-medium">
                {referrals?.invitedUsers.filter(u => u.status === 'active').length || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 