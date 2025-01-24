'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roles = [
  "Project Manager",
  "Site Manager",
  "Procurement Manager",
  "Inventory Manager",
  "Estimator",
  "Sustainability Officer",
  "Other"
]

const contactPreferences = [
  "Email",
  "Phone",
  "Text"
]

const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    companyName: '',
    role: '',
    password: '',
    contactPreference: 'Email',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'email') {
      setError(isValidEmail(value) ? '' : 'Please enter a valid email address.')
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleContactPreferenceChange = (value: string) => {
    setFormData(prev => ({ ...prev, contactPreference: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      console.log('User created:', data.user)
      console.log('User profile created:', data.profile)
      router.push('/signup/success')
    } catch (error) {
      console.error('Error during signup:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during signup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        {error && error.includes('email') && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={handleRoleChange} value={formData.role}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contactPreference">Preferred Contact Method</Label>
        <Select onValueChange={handleContactPreferenceChange} value={formData.contactPreference}>
          <SelectTrigger>
            <SelectValue placeholder="Select contact preference" />
          </SelectTrigger>
          <SelectContent>
            {contactPreferences.map((preference) => (
              <SelectItem key={preference} value={preference}>{preference}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>
      {error && !error.includes('email') && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  )
}

