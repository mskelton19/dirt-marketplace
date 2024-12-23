'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from 'lucide-react'

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          company,
          role,
          zipCode: parseInt(zipCode, 10),
          phone
        }),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Signup failed')
      }

      router.push('/login')
    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  if (!isClient) {
    return null // or a loading indicator
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
        <p className="mt-2 text-sm text-gray-500">
          Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
        </p>
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <Input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <Select onValueChange={setRole} required>
          <SelectTrigger id="role" className="w-full mt-1 bg-white text-gray-900">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="site_supervisor">Site Supervisor</SelectItem>
            <SelectItem value="procurement_officer">Procurement Officer</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
        <Input
          id="zipCode"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          className="mt-1 text-gray-900"
          maxLength={5}
          title="Five digit zip code"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 text-gray-900"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
      >
        Sign Up
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </form>
  )
}

