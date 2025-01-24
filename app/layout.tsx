<<<<<<< HEAD
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
title: 'Dirt Marketplace - Construction Materials Exchange',
description: 'Connect directly with buyers and sellers of construction materials. Save time, reduce waste, and maximize your resources.',
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <Header />
      <main>{children}</main>
      <Toaster />
    </body>
  </html>
)
=======
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { inter } from './fonts'
import ClientSessionProvider from './components/ClientSessionProvider'
import Header from '@/components/Header'

export const metadata = {
  title: 'Dirt Marketplace',
  description: 'Connect and trade excess construction materials',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionProvider>
          <Header />
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
}

