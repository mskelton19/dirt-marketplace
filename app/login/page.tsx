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
}

