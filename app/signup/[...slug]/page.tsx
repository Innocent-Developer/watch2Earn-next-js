"use client"

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SignupPage from '../page'

const SignupWithReferral = () => {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Extract referral code from the URL path
    const slug = params.slug as string[]
    if (slug && slug.length > 0) {
      const path = slug.join('/')
      
      // Check if the path contains a referral code pattern
      const refMatch = path.match(/ref=([^&]+)/)
      if (refMatch && refMatch[1]) {
        const referralCode = refMatch[1]
        
        // Redirect to signup page with referral code as query parameter
        router.replace(`/signup?ref=${encodeURIComponent(referralCode)}`)
        return
      }
    }
    
    // If no valid referral code found, redirect to regular signup
    router.replace('/signup')
  }, [params, router])

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to signup...</p>
      </div>
    </div>
  )
}

export default SignupWithReferral 