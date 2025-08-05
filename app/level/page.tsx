import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Level Income | UK ADS',
}

const LevelPage = () => {
  const dollarRate = 278
  const levelData = [
    { level: '1st Level', pkr: 125, usd: 0.45 },
    { level: '2nd Level', pkr: 65, usd: 0.23 },
    { level: '3rd Level', pkr: 30, usd: 0.11 },
    { level: '4th Level', pkr: 15, usd: 0.05 },
    { level: '5th Level', pkr: 10, usd: 0.04 },
  ]

  return (
    <div className="space-y-8">
      {/* Title and dollar rate */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Level Income</h1>
        <p className="mt-2 text-sm text-gray-600">Dollar Rate = <span className="font-semibold">{dollarRate}</span></p>
      </div>

      {/* Level earning chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Level Earning Chart</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-primary text-white rounded-t-lg">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl text-left font-semibold">Level</th>
              <th className="px-4 py-3 text-right font-semibold">PKR</th>
              <th className="px-4 py-3 rounded-tr-xl text-right font-semibold">USD</th>
            </tr>
          </thead>
          <tbody>
            {levelData.map((row, index) => (
              <tr key={row.level} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-3 font-medium text-gray-800">{row.level}</td>
                <td className="px-4 py-3 text-right text-gray-600">{row.pkr}</td>
                <td className="px-4 py-3 text-right text-gray-600">${row.usd.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LevelPage 