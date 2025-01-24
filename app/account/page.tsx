'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from 'lucide-react'
import type { Database } from '@/lib/database.types'

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  contactPreference: string;
  company: string;
  role: string;
}

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error('Authentication error:', authError)
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return
      }

      setUser({
        id: authUser.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone_number,
        zipCode: profile.zip_code,
        contactPreference: profile.contact_preference,
        company: profile.company_name,
        role: profile.role
      })
      setIsLoading(false)
    }

    fetchUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Account</h1>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Company:</p>
                  <p>{user.company}</p>
                </div>
                <div>
                  <p className="font-semibold">Role:</p>
                  <p>{user.role}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{user.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Zip Code:</p>
                  <p>{user.zipCode}</p>
                </div>
                <div>
                  <p className="font-semibold">Contact Preference:</p>
                  <p>{user.contactPreference}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </main>
    </div>
  )
}

export default AccountPage

