"use client"

import React, { useState, useEffect } from 'react'
import { Users, Trophy, DollarSign, UserPlus, Calendar, Phone, Mail, Crown, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { getUserData } from '../utils/userStorage'
import { getTeamMembers, TeamData, TeamMember } from '../utils/api'

const TeamPage = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getUserData()
    if (!user) {
      setError('Please login to view team information')
      setIsLoading(false)
      return
    }
    setCurrentUser(user)
    
    if (user.referralCode) {
      fetchTeamMembersData(user.referralCode)
    } else {
      setError('No referral code found. You need to be a team leader to view team members.')
      setIsLoading(false)
    }
  }, [])

  const fetchTeamMembersData = async (inviteCode: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await getTeamMembers(inviteCode)
      setTeamData(data)
    } catch (err: any) {
      console.error('Error fetching team members:', err)
      setError(err.message || 'Failed to load team information')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'premium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getLevelBadgeColor = (level: number) => {
    if (level >= 10) return 'bg-gradient-to-r from-purple-600 to-purple-800'
    if (level >= 5) return 'bg-gradient-to-r from-blue-600 to-blue-800'
    if (level >= 1) return 'bg-gradient-to-r from-green-600 to-green-800'
    return 'bg-gray-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Load Team</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!teamData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Team Data</h2>
          <p className="text-gray-600">No team information available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Management</h1>
        <p className="text-lg text-gray-600">Manage and view your team members</p>
      </div>

      {/* Team Leader Info */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center mb-4">
          <Crown className="h-8 w-8 mr-3 text-yellow-300" />
          <h2 className="text-2xl font-bold">Team Leader</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Name</p>
            <p className="font-bold text-lg">{teamData.teamLeader.name}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">UID</p>
            <p className="font-bold text-lg">{teamData.teamLeader.uid}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Referral Code</p>
            <p className="font-bold text-lg">{teamData.teamLeader.referralCode}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Total Balance</p>
            <p className="font-bold text-lg">PKR {teamData.teamLeader.totalBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Members</p>
              <p className="text-2xl font-bold">{teamData.teamStats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Members</p>
              <p className="text-2xl font-bold">{teamData.teamStats.activeMembers}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Team Balance</p>
              <p className="text-2xl font-bold">PKR {teamData.teamStats.totalTeamBalance.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Withdrawals</p>
              <p className="text-2xl font-bold">PKR {teamData.teamStats.totalTeamWithdrawals.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Average Level</p>
              <p className="text-2xl font-bold">{teamData.teamStats.averageLevel}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Team Members ({teamData.teamMembers.length})
        </h2>

        {teamData.teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Team Members Yet</h3>
            <p className="text-gray-500">Start inviting people to build your team!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Balance</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Invites</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {teamData.teamMembers.map((member, index) => (
                  <tr key={member._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-500">UID: {member.uid}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phoneNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(member.plan)}`}>
                        {member.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLevelBadgeColor(member.level)}`}>
                        Level {member.level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-green-600">PKR {member.totalBalance.toFixed(2)}</p>
                        <p className="text-xs text-red-500">Withdrawn: PKR {member.totalWithdrawals.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <UserPlus className="h-3 w-3 mr-1" />
                        {member.totalInvites}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => window.location.href = '/referrals'}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-purple transition-colors shadow-lg flex items-center justify-center"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Invite More Members
        </button>
        <button 
          onClick={() => fetchTeamMembersData(currentUser?.referralCode)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center"
        >
          <Users className="h-5 w-5 mr-2" />
          Refresh Team Data
        </button>
      </div>
    </div>
  )
}

export default TeamPage 