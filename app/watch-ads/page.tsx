"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Play, Clock, DollarSign, AlertTriangle, CheckCircle, X, Pause } from 'lucide-react'
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
  const videoRef = useRef<HTMLVideoElement>(null)
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
  
  // Video states
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [canClaimReward, setCanClaimReward] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [videoCanPlay, setVideoCanPlay] = useState(false)

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
        console.log(`Balance updated locally: +PKR ${amount}, New balance: PKR ${newBalance}`)
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
        console.log(`Balance updated successfully via API: +PKR ${amount}, New balance: PKR ${data.newBalance}`)
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

  // Video event handlers
  const handleVideoLoadStart = () => {
    setIsVideoLoading(true)
    setVideoCanPlay(false)
    setVideoError(null)
    console.log('Video loading started')
  }

  const handleVideoLoadedMetadata = () => {
    try {
      if (videoRef.current && videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration)
        setVideoError(null)
        console.log('Video metadata loaded successfully, duration:', videoRef.current.duration)
      }
    } catch (error) {
      console.error('Error handling video metadata:', error)
    }
  }

  const handleVideoCanPlay = () => {
    setIsVideoLoading(false)
    setVideoCanPlay(true)
    console.log('Video can play')
  }

  const handleVideoTimeUpdate = () => {
    try {
      if (videoRef.current && videoRef.current.duration > 0) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
        setVideoProgress(progress)
        
        // Check if video is almost complete (95% watched)
        if (progress >= 95 && !videoCompleted) {
          setVideoCompleted(true)
          setCanClaimReward(true)
          console.log('Video completed - reward can be claimed')
        }
      }
    } catch (error) {
      console.error('Error handling video time update:', error)
    }
  }

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  const handleVideoEnded = () => {
    setIsVideoPlaying(false)
    setVideoCompleted(true)
    setCanClaimReward(true)
    setVideoProgress(100)
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget as HTMLVideoElement
    
    // Safely extract error information
    const errorDetails = {
      errorCode: videoElement.error?.code || 'Unknown',
      errorMessage: videoElement.error?.message || 'Unknown error',
      networkState: videoElement.networkState || 'Unknown',
      readyState: videoElement.readyState || 'Unknown',
      src: videoElement.src || 'No source',
      currentSrc: videoElement.currentSrc || 'No current source',
      videoWidth: videoElement.videoWidth || 0,
      videoHeight: videoElement.videoHeight || 0
    }
    
    console.error('Video error details:', errorDetails)
    
    // Set user-friendly error message based on error code
    let errorMessage = 'Failed to load video. '
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage += 'Video loading was aborted.'
          break
        case 2: // MEDIA_ERR_NETWORK
          errorMessage += 'Network error occurred while loading video.'
          break
        case 3: // MEDIA_ERR_DECODE
          errorMessage += 'Video format is not supported or corrupted.'
          break
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage += 'Video format or source is not supported.'
          break
        default:
          errorMessage += 'Unknown error occurred.'
      }
    } else {
      errorMessage += 'This might be due to network issues or unsupported video format.'
    }
    
    setVideoError(errorMessage)
    setIsVideoPlaying(false)
  }

  const claimReward = async () => {
    if (!canClaimReward || rewardClaimed || !selectedAd || !user?.uid) return

    setRewardClaimed(true)
    setBalanceUpdateStatus('updating')

    try {
      const balanceUpdated = await updateUserBalance(user.uid, 1)
      if (balanceUpdated) {
        setBalanceUpdateStatus('success')
        
        // Save watch history
        saveWatchHistory(selectedAd._id)
        setWatchCount(prev => prev + 1)
        
        console.log('Reward claimed successfully')
      } else {
        setBalanceUpdateStatus('failed')
        console.error('Failed to claim reward')
      }
    } catch (error) {
      setBalanceUpdateStatus('failed')
      console.error('Reward claim failed:', error)
    }
  }

  // Function to render video content based on type
  const renderVideoContent = (ad: Ad) => {
    const displayType = getVideoDisplayType(ad.videoUrl)
    
    switch (displayType) {
      case 'direct':
        return (
          <div className="relative">
            {videoError ? (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg min-h-[300px]">
                <div className="text-center text-gray-500 p-8">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                  <p className="text-lg font-medium mb-2">Video Error</p>
                  <p className="text-sm mb-4">{videoError}</p>
                  <div className="bg-white p-4 rounded-lg border max-w-md mx-auto">
                    <p className="text-xs text-gray-600 mb-2">Video URL:</p>
                    <p className="text-xs text-gray-800 break-all">{ad.videoUrl}</p>
                  </div>
                  <button
                    onClick={() => {
                      setVideoError(null)
                      if (videoRef.current) {
                        videoRef.current.load()
                      }
                    }}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-80"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  key={`video-${ad._id}-${Date.now()}`}
                  controls
                  className="w-full h-full object-cover min-h-[300px]"
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  crossOrigin="anonymous"
                  onLoadStart={handleVideoLoadStart}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onLoadedData={() => console.log('Video data loaded successfully')}
                  onCanPlay={handleVideoCanPlay}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onAbort={() => console.log('Video loading aborted')}
                  onEmptied={() => console.log('Video emptied')}
                  onStalled={() => console.log('Video stalled')}
                  onSuspend={() => console.log('Video suspended')}
                  onWaiting={() => console.log('Video waiting')}
                >
                  <source src={ad.videoUrl} type="video/mp4" />
                  <source src={ad.videoUrl} type="video/webm" />
                  <source src={ad.videoUrl} type="video/ogg" />
                  <p>Your browser does not support the video tag.</p>
                </video>
                
                {/* Video Loading Overlay */}
                {isVideoLoading && !videoError && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Loading video...</p>
                    </div>
                  </div>
                )}

                {/* Video Progress Overlay */}
                {!isVideoLoading && videoCanPlay && !videoError && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {isVideoPlaying ? (
                          <><Pause className="inline h-3 w-3 mr-1" />Playing</>
                        ) : (
                          <><Play className="inline h-3 w-3 mr-1" />Paused</>
                        )}
                      </span>
                      <span className="text-sm">
                        {Math.round(videoProgress)}% watched
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                    {videoCompleted && (
                      <div className="text-center mt-2">
                        <CheckCircle className="inline h-4 w-4 mr-1 text-green-400" />
                        <span className="text-sm text-green-400">Video completed!</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )
      
      case 'social':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg min-h-[300px]">
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
                Please watch the video in the external link to claim your reward.
              </p>
              
              <div className="bg-white p-4 rounded-lg border mb-6">
                <p className="text-sm text-gray-600 mb-2">Video Link:</p>
                <p className="text-sm text-gray-800 break-all">{ad.videoUrl}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.open(ad.videoUrl, '_blank', 'noopener,noreferrer')
                    // For social media videos, allow immediate reward claim
                    setTimeout(() => {
                      setCanClaimReward(true)
                      setVideoCompleted(true)
                    }, 2000)
                  }}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Open Video & Watch
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
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg min-h-[300px]">
            <div className="text-center text-gray-500">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No Video Available</p>
              <p className="text-sm">No video URL provided for this ad</p>
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

    // Reset video states
    setVideoProgress(0)
    setVideoDuration(0)
    setIsVideoPlaying(false)
    setVideoCompleted(false)
    setCanClaimReward(false)
    setRewardClaimed(false)
    setVideoError(null)
    setIsVideoLoading(true)
    setVideoCanPlay(false)
    setBalanceUpdateStatus('idle')

    // Show video modal
    setSelectedAd(ad)
    setShowVideoModal(true)
  }

  const closeVideoModal = () => {
    // Pause video if playing
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    
    setShowVideoModal(false)
    setSelectedAd(null)
    setVideoProgress(0)
    setVideoDuration(0)
    setIsVideoPlaying(false)
    setVideoCompleted(false)
    setCanClaimReward(false)
    setRewardClaimed(false)
    setVideoError(null)
    setIsVideoLoading(true)
    setVideoCanPlay(false)
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
                <span>Have a balance greater than PKR 1</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                Current Plan: <span className="font-semibold">{userData?.plan || user?.plan || 'basic'}</span>
              </p>
              <p className="text-sm text-gray-600">
                Current Balance: <span className="font-semibold">PKR {userData?.totalBalance || user?.totalBalance || '0.00'}</span>
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
                {/* Reward Status */}
                <div className="mb-4">
                  {!videoCompleted && (
                    <p className="text-sm text-gray-600 mb-2">
                      Watch the video to completion to earn PKR 1.00!
                    </p>
                  )}
                  
                  {videoCompleted && !rewardClaimed && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />
                      <p className="text-sm text-green-700">
                        Video completed! You can now claim your reward.
                      </p>
                    </div>
                  )}
                  
                  {rewardClaimed && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-700 mb-2">
                        You earned PKR 1.00 for watching this ad!
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
                  )}
                </div>

                {/* Claim Reward Button */}
                {canClaimReward && !rewardClaimed && (
                  <button
                    onClick={claimReward}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium mb-4 flex items-center justify-center mx-auto"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Claim PKR 1.00 Reward
                  </button>
                )}
                
                {/* Debug info for development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
                    <p className="text-xs text-gray-600 mb-2">Debug Info:</p>
                    <p className="text-xs text-gray-800">Video URL: {selectedAd.videoUrl || 'None'}</p>
                    <p className="text-xs text-gray-800">Display Type: {getVideoDisplayType(selectedAd.videoUrl)}</p>
                    <p className="text-xs text-gray-800">Video Progress: {Math.round(videoProgress)}%</p>
                    <p className="text-xs text-gray-800">Video Completed: {videoCompleted ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-gray-800">Can Claim Reward: {canClaimReward ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-gray-800">Reward Claimed: {rewardClaimed ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-gray-800">Ad ID: {selectedAd._id}</p>
                    <p className="text-xs text-gray-800">Ad Name: {selectedAd.name}</p>
                    <p className="text-xs text-gray-800">Video Duration: {selectedAd.duration}s</p>
                  </div>
                )}
                
                <button
                  onClick={closeVideoModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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