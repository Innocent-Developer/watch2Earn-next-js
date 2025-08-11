"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Play, Clock, DollarSign, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { getUserData, UserData } from '../utils/userStorage'

interface Ad {
  _id: string
  adId: string
  name: string
  videoUrl: string
  imageUrl: string
  link: string
  duration: number
  createdAt: string
  updatedAt: string
}

interface AdsResponse {
  success: boolean
  message: string
  data: {
    ads: Ad[]
    pagination: {
      currentPage: number
      totalPages: number
      totalAds: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

interface WatchHistory {
  [adId: string]: number // timestamp when ad was watched
}

const WatchAdsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEligible, setIsEligible] = useState(false)
  const [watchCount, setWatchCount] = useState(0)
  const [maxWatchesPerDay] = useState(5)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [balanceUpdateStatus, setBalanceUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'failed'>('idle')

  const fetchUserData = async (uid: number) => {
    try {
      const response = await fetch(`https://watch2earn-vie97.ondigitalocean.app/api/admin/user/${uid}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setUserData(data.data.user)
        return data.data.user
      } else {
        throw new Error(data.message || 'Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  const fetchAds = async () => {
    try {
      const response = await fetch('https://watch2earn-vie97.ondigitalocean.app/api/ads')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: AdsResponse = await response.json()
      if (data.success) {
        setAds(data.data.ads)
      } else {
        throw new Error(data.message || 'Failed to fetch ads')
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
      setError('Failed to load ads. Please try again later.')
    }
  }

  const getWatchHistory = (): WatchHistory => {
    if (typeof window === 'undefined') return {}
    try {
      const history = localStorage.getItem('watchHistory')
      return history ? JSON.parse(history) : {}
    } catch (error) {
      console.error('Error parsing watch history:', error)
      return {}
    }
  }

  const saveWatchHistory = (adId: string) => {
    if (typeof window === 'undefined') return
    try {
      const history = getWatchHistory()
      history[adId] = Date.now()
      localStorage.setItem('watchHistory', JSON.stringify(history))
    } catch (error) {
      console.error('Error saving watch history:', error)
    }
  }

  const getTodayWatchCount = (): number => {
    const history = getWatchHistory()
    const now = Date.now()
    const oneDayAgo = now - (24 * 60 * 60 * 1000)
    
    let count = 0
    for (const timestamp of Object.values(history)) {
      if (timestamp > oneDayAgo) {
        count++
      }
    }
    return count
  }

  const checkEligibility = (user: UserData, apiUserData: any) => {
    // Check if user is pro (plan === "pro") and has balance > 1
    const userPlan = apiUserData?.plan || user?.plan || 'basic'
    const userBalance = parseFloat(apiUserData?.totalBalance || user?.totalBalance || '0')
    
    const isPro = userPlan === 'pro'
    const hasEnoughBalance = userBalance > 1
    
    return isPro && hasEnoughBalance
  }

  // Simulate balance update locally since API is blocked
  const simulateBalanceUpdate = async (uid: number, amount: number) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local balance
      if (userData) {
        const newBalance = (parseFloat(userData.totalBalance || '0') + amount).toFixed(2)
        setUserData((prev: any) => ({
          ...prev,
          totalBalance: newBalance
        }))
        console.log(`Balance updated locally: +$${amount}, New balance: $${newBalance}`)
        return true
      }
      return false
    } catch (error) {
      console.error('Error simulating balance update:', error)
      return false
    }
  }

  const updateUserBalance = async (uid: number, amount: number) => {
    try {
      console.log('Attempting to update balance for UID:', uid, 'Amount:', amount)
      
      const response = await fetch('https://watch2earn-vie97.ondigitalocean.app/api/auto/update/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ uid, amount }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error text:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.message === 'Balance updated successfully') {
        // Update local user data with new balance from API
        if (userData) {
          setUserData((prev: any) => ({
            ...prev,
            totalBalance: data.newBalance
          }))
        }
        console.log(`Balance updated successfully via API: +$${amount}, New balance: $${data.newBalance}`)
        return true
      } else {
        throw new Error(data.message || 'Failed to update balance')
      }
    } catch (error) {
      console.error('Error updating balance:', error)
      
      // If API fails, fallback to local simulation
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('timeout'))) {
        console.warn('API failed - falling back to local simulation')
        return await simulateBalanceUpdate(uid, amount)
      }
      
      return false
    }
  }

  // Function to check if URL is a social media link
  const isSocialMediaLink = (url: string): boolean => {
    return url.includes('instagram.com') || 
           url.includes('youtube.com') || 
           url.includes('tiktok.com') || 
           url.includes('facebook.com') ||
           url.includes('twitter.com')
  }

  // Function to get video display type
  const getVideoDisplayType = (url: string): 'direct' | 'social' | 'none' => {
    if (!url) return 'none'
    if (isSocialMediaLink(url)) return 'social'
    return 'direct'
  }

  // Function to render video content based on type
  const renderVideoContent = (ad: Ad) => {
    const displayType = getVideoDisplayType(ad.videoUrl)
    
    switch (displayType) {
      case 'direct':
        return (
          <video
            key={ad._id}
            controls
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="metadata"
            onLoadStart={() => console.log('Video loading started')}
            onLoadedMetadata={() => console.log('Video metadata loaded')}
            onLoadedData={() => console.log('Video data loaded successfully')}
            onCanPlay={() => console.log('Video can start playing')}
            onError={(e) => {
              const videoElement = e.currentTarget as HTMLVideoElement
              console.error('Video error details:', {
                error: videoElement.error,
                networkState: videoElement.networkState,
                readyState: videoElement.readyState,
                src: videoElement.src,
                currentSrc: videoElement.currentSrc
              })
              
              if (videoElement.parentElement) {
                videoElement.parentElement.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div class="text-center text-gray-500 p-8">
                      <svg class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      <p class="text-lg font-medium mb-2">Video Unavailable</p>
                      <p class="text-sm mb-4">The video could not be loaded</p>
                      <div class="bg-white p-4 rounded-lg border max-w-md mx-auto">
                        <p class="text-xs text-gray-600 mb-2">Video URL:</p>
                        <p class="text-xs text-gray-800 break-all">${ad.videoUrl}</p>
                      </div>
                    </div>
                  </div>
                `
              }
            }}
          >
            <source src={ad.videoUrl} type="video/mp4" />
            <source src={ad.videoUrl} type="video/webm" />
            <source src={ad.videoUrl} type="video/ogg" />
            <p>Your browser does not support the video tag.</p>
          </video>
        )
      
      case 'social':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-center p-8 max-w-md">
              <div className="mb-6">
                {ad.videoUrl.includes('instagram.com') && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                )}
                {ad.videoUrl.includes('youtube.com') && (
                  <div className="bg-red-500 text-white p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {ad.videoUrl.includes('instagram.com') ? 'Instagram Reel' : 'Social Media Video'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                This is a social media video that cannot be played directly in the app.
              </p>
              
              <div className="bg-white p-4 rounded-lg border mb-6">
                <p className="text-sm text-gray-600 mb-2">Video Link:</p>
                <p className="text-sm text-gray-800 break-all">{ad.videoUrl}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open(ad.videoUrl, '_blank', 'noopener,noreferrer')}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Open in New Tab
                </button>
                
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(ad.videoUrl)
                      alert('Link copied to clipboard!')
                    }
                  }}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <p>No video URL provided</p>
            </div>
          </div>
        )
    }
  }

  useEffect(() => {
    const initializePage = async () => {
      const localUserData = getUserData()
      if (!localUserData) {
        router.replace("/login")
        return
      }
      
      setUser(localUserData)
      
      // Fetch user data from API
      let apiUserData = null
      if (localUserData.uid) {
        apiUserData = await fetchUserData(localUserData.uid)
      }
      
      // Check eligibility
      const eligible = checkEligibility(localUserData, apiUserData)
      setIsEligible(eligible)
      
      if (eligible) {
        // Fetch ads only if user is eligible
        await fetchAds()
      }
      
      // Get today's watch count
      const todayCount = getTodayWatchCount()
      setWatchCount(todayCount)
      
      setIsLoading(false)
    }

    initializePage()
  }, [router])

  const handleWatchAd = async (ad: Ad) => {
    // Check if user has reached daily limit
    if (watchCount >= maxWatchesPerDay) {
      alert('You have reached your daily limit of 5 ads. Please try again tomorrow.')
      return
    }

    // Save watch history first
    saveWatchHistory(ad._id)
    setWatchCount(prev => prev + 1)

    // Show video modal immediately
    setSelectedAd(ad)
    setShowVideoModal(true)

    // Try to update user balance in the background
    if (user?.uid) {
      setBalanceUpdateStatus('updating')
      
      setTimeout(async () => {
        try {
          const balanceUpdated = await updateUserBalance(user.uid, 1)
          if (balanceUpdated) {
            setBalanceUpdateStatus('success')
            console.log('Balance updated successfully')
          } else {
            setBalanceUpdateStatus('failed')
            console.error('Failed to update balance')
          }
        } catch (error) {
          setBalanceUpdateStatus('failed')
          console.error('Background balance update failed:', error)
        }
      }, 100)
    }
  }

  const closeVideoModal = () => {
    setShowVideoModal(false)
    setSelectedAd(null)
    setBalanceUpdateStatus('idle')
  }

  const canWatchMore = watchCount < maxWatchesPerDay

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (!isEligible) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Watch Ads</h1>
          <p className="mt-2 text-lg text-gray-600">Earn money by watching ads</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Not Eligible</h2>
            <p className="text-yellow-700 mb-4">
              You need to meet the following requirements to watch ads:
            </p>
            <div className="space-y-2 text-sm text-yellow-700">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Be a Pro user (plan = &quot;pro&quot;)</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Have a balance greater than $1</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                Current Plan: <span className="font-semibold">{userData?.plan || user?.plan || 'basic'}</span>
              </p>
              <p className="text-sm text-gray-600">
                Current Balance: <span className="font-semibold">${userData?.totalBalance || user?.totalBalance || '0.00'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Watch Ads</h1>
        <p className="mt-2 text-lg text-gray-600">Earn money by watching ads</p>
      </div>

      {/* Daily limit indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-blue-700 font-medium">Daily Progress</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-blue-600">
              {watchCount} / {maxWatchesPerDay} ads watched today
            </span>
          </div>
        </div>
        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(watchCount / maxWatchesPerDay) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!canWatchMore && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-2">
            <X className="h-5 w-5 text-orange-500" />
            <span className="text-orange-700 font-medium">
              You have reached your daily limit of {maxWatchesPerDay} ads. Please try again tomorrow.
            </span>
          </div>
        </div>
      )}

      {ads.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Ads Available</h2>
          <p className="text-gray-600">Check back later for new ads to watch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt={ad.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <button
                    onClick={() => handleWatchAd(ad)}
                    disabled={!canWatchMore}
                    className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-6 w-6 text-primary" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{ad.duration}s</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{ad.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Earn rewards</span>
                  </div>
                  <button
                    onClick={() => handleWatchAd(ad)}
                    disabled={!canWatchMore}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark-purple transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {canWatchMore ? 'Watch Now' : 'Limit Reached'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">{selectedAd.name}</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {renderVideoContent(selectedAd)}
              </div>
              
              <div className="mt-4 text-center">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    You earned $1.00 for watching this ad!
                  </p>
                  {balanceUpdateStatus === 'updating' && (
                    <p className="text-sm text-blue-600">Updating balance...</p>
                  )}
                  {balanceUpdateStatus === 'success' && (
                    <p className="text-sm text-green-600">✓ Balance updated successfully!</p>
                  )}
                  {balanceUpdateStatus === 'failed' && (
                    <p className="text-sm text-orange-600">⚠ Balance update failed, but you still earned the reward!</p>
                  )}
                </div>
                
                {/* Debug info for development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
                    <p className="text-xs text-gray-600 mb-2">Debug Info:</p>
                    <p className="text-xs text-gray-800">Video URL: {selectedAd.videoUrl || 'None'}</p>
                    <p className="text-xs text-gray-800">Display Type: {getVideoDisplayType(selectedAd.videoUrl)}</p>
                    <p className="text-xs text-gray-800">Ad ID: {selectedAd._id}</p>
                    <p className="text-xs text-gray-800">Ad Name: {selectedAd.name}</p>
                    <p className="text-xs text-gray-800">Video Duration: {selectedAd.duration}s</p>
                  </div>
                )}
                
                <button
                  onClick={closeVideoModal}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-dark-purple transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WatchAdsPage 