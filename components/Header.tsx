'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Menu, UserCircle } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, role')
          .eq('user_id', authUser.id)
          .single()

        if (profile) {
          setUser({
            name: `${profile.first_name} ${profile.last_name}`,
            role: profile.role
          })
        }
      }
    }

    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
          Dirt Market
        </Link>
        <div className="flex items-center">
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full mr-2"
              onClick={() => router.push('/account')}
            >
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Go to account page</span>
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={() => router.push('/signup')} variant="outline">
                Sign Up
              </Button>
              <Button onClick={() => router.push('/login')} variant="default">
                Login
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/listings')}>
                    Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/messages')}>
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => router.push('/about')}>
                    About
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/contact')}>
                    Contact
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header

