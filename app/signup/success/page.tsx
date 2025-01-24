'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard')
    }, 5000) // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Sign Up Successful!</h1>
      <p className="mb-6">Thank you for signing up to Dirt Marketplace. We're excited to have you on board!</p>
      <p className="mb-6">You will be redirected to your dashboard in 5 seconds.</p>
      <Button onClick={() => router.push('/dashboard')}>
        Go to Dashboard Now
      </Button>
    </div>
  )
}

