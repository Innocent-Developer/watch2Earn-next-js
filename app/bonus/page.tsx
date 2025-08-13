import React from 'react'
import { Metadata } from 'next'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bonus | UK ADS',
}

const BonusPage = () => {
  const bonusTasks = [
    {
      description: 'Add 2 Users and Get PKR 1',
      inputs: [1, 2],
    },
    {
      description: 'Add 2 Users and Get PKR 1',
      inputs: [3, 4],
    },
    {
      description: 'Add 1 Users and Get PKR 1',
      inputs: [5],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Bonus</h1>
      </div>
      
      {/* Motivational banner */}
      <div className="bg-primary text-white p-4 rounded-xl shadow-lg text-center">
        <p className="font-semibold">Complete Your Easy Target Daily To Earn Exciting Bonus!</p>
      </div>

      {/* Bonus task cards */}
      <div className="space-y-4">
        {bonusTasks.map((task, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-lg font-semibold text-gray-800">{task.description}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {task.inputs.map((inputNumber) => (
                <div key={inputNumber}>
                  <label htmlFor={`input-${inputNumber}`} className="sr-only">Input {inputNumber}</label>
                  <input
                    id={`input-${inputNumber}`}
                    type="text"
                    placeholder={`${inputNumber}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BonusPage 