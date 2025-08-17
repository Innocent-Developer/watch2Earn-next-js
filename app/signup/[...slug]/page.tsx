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
      console.log('Signup slug path:', path)
      
      // Handle different referral URL patterns:
      // 1. signup/ref=ABC123
      // 2. signup/ABC123
      // 3. signup/referral/ABC123
      
      let referralCode = null
      
      // Pattern 1: ref=CODE
      const refMatch = path.match(/ref=([^&\/]+)/)
      if (refMatch && refMatch[1]) {
        referralCode = refMatch[1]
      }
      // Pattern 2: Direct code (first segment)
      else if (slug[0] && slug[0] !== 'ref' && slug[0] !== 'referral') {
        referralCode = slug[0]
      }
      // Pattern 3: referral/CODE
      else if (slug[0] === 'referral' && slug[1]) {
        referralCode = slug[1]
      }
      // Pattern 4: ref/CODE
      else if (slug[0] === 'ref' && slug[1]) {
        referralCode = slug[1]
      }
      
      if (referralCode) {
        console.log('Found referral code:', referralCode)
        // Redirect to signup page with referral code as query parameter
        router.replace(`/signup?ref=${encodeURIComponent(referralCode)}`)
        return
      }
    }
    
    console.log('No valid referral code found, redirecting to regular signup')
    // If no valid referral code found, redirect to regular signup
    router.replace('/signup')
  }, [params, router])

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Processing referral link...</p>
      </div>
    </div>
  )
}

export default SignupWithReferral 