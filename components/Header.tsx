'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handlePopState = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => {
    if (!isMenuOpen) {
      // Push a new state to the history when opening the menu
      window.history.pushState({ menuOpen: true }, '');
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Logo />
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-accent ml-2">The Dirt Marketplace</span>
          </Link>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8 mr-4">
              <Link href="/features" className={`text-sm lg:text-base ${isActive('/features') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Features</Link>
              <Link href="/pricing" className={`text-sm lg:text-base ${isActive('/pricing') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Pricing</Link>
              <Link href="/about" className={`text-sm lg:text-base ${isActive('/about') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>About</Link>
              {session ? (
                <>
                  <Link href="/dashboard" className={`text-sm lg:text-base ${isActive('/dashboard') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Dashboard</Link>
                  <button onClick={handleLogout} className="text-sm lg:text-base text-gray-600 hover:text-primary">Log Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className={`text-sm lg:text-base ${isActive('/login') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Login</Link>
                  <Link href="/signup">
                    <Button className="bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-accent focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/features" onClick={() => setIsMenuOpen(false)} className={`text-base ${isActive('/features') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Features</Link>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className={`text-base ${isActive('/pricing') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Pricing</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className={`text-base ${isActive('/about') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>About</Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className={`text-base ${isActive('/dashboard') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-base text-gray-600 hover:text-primary text-left">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className={`text-base ${isActive('/login') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>Login</Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

