<<<<<<< HEAD
import SignUpForm from '@/components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up for Dirt Marketplace</h1>
      <SignUpForm />
=======
import SignUpForm from './SignUpForm'
import Logo from '@/components/Logo'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-accent hover:text-accent/90">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpForm />
        </div>
      </div>
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
    </div>
  )
}

