import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className = '' }) => {
  return (
    <div className={`relative inline-block h-10 w-10 overflow-hidden rounded-full ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
          {fallback || alt?.charAt(0) || '?'}
        </div>
      )}
    </div>
  )
}

export const AvatarImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <Image src={src} alt={alt} layout="fill" objectFit="cover" />
)

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
    {children}
  </div>
)

