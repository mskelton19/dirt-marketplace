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
}

