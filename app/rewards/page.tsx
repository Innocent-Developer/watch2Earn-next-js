import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rewards | UK ADS',
}

const RewardsPage = () => {
  const rewardsData = [
    { level: 'VIP1', reward: 2, membersNeeded: 10 },
    { level: 'VIP2', reward: 3, membersNeeded: 25 },
    { level: 'VIP3', reward: 6, membersNeeded: 50 },
    { level: 'VIP4', reward: 15, membersNeeded: 100 },
    { level: 'VIP5', reward: 25, membersNeeded: 200 },
  ]

  const currentLevel = 'VIP0'

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Rewards</h1>
        <p className="mt-2 text-lg text-gray-600">Current Level: <span className="font-semibold text-primary">{currentLevel}</span></p>
      </div>

      <div className="space-y-4">
        {rewardsData.map((reward) => (
          <div key={reward.level} className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-primary">{reward.level}</h2>
              <p className="text-2xl font-bold text-gray-800">${reward.reward}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Need {reward.membersNeeded} members</p>
              <button className="mt-2 bg-primary text-white text-sm font-semibold py-2 px-6 rounded-full hover:bg-dark-purple transition-colors">
                Claim Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RewardsPage 