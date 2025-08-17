"use client"

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const SignupWithReferralCode = () => {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Get referral code from URL parameter
    const referralCode = params.referralCode as string
    
    console.log('Referral code from URL:', referralCode)
    
    if (referralCode && referralCode.trim()) {
      // Redirect to signup page with referral code as query parameter
      router.replace(`/signup?ref=${encodeURIComponent(referralCode.trim())}`)
    } else {
      // If no referral code, redirect to regular signup
      router.replace('/signup')
    }
  }, [params, router])

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Processing referral invitation...</p>
      </div>
    </div>
  )
}

export default SignupWithReferralCode 