<<<<<<< HEAD
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from '@/lib/database.types'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log('Login: Attempting to sign in with email:', email);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      console.log('Login: Sign in successful, redirecting to dashboard');
      router.push('/dashboard')
    } catch (error) {
      console.error('Login: Sign in failed', error);
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
=======
import LoginForm from './LoginForm'
import Logo from '@/components/Logo'
import Link from 'next/link'

export default function LoginPage() {
 return (
   <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
     <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <div className="flex justify-center">
         <Logo />
       </div>
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
         Log in to your account
       </h2>
       <p className="mt-2 text-center text-sm text-gray-600">
         Or{' '}
         <Link href="/signup" className="font-medium text-accent hover:text-accent/90">
           create a new account
         </Link>
       </p>
     </div>

     <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
       <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
         <LoginForm />
       </div>
     </div>
   </div>
 )
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
}

