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
}

