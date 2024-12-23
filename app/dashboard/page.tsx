'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ListingTabs from '@/components/ListingTabs'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Listing {
  id: string
  type: string
  quantity: number
  latitude: number
  longitude: number
  address: string
  distance?: number
  isAvailable: boolean
  status: 'ACTIVE' | 'COMPLETED' | 'DELETED'
  user: {
    email: string
    phone: string
  }
}

interface UserData {
  firstName: string
  lastName: string
  zipCode: number
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [availableListings, setAvailableListings] = useState<Listing[]>([])
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [filters, setFilters] = useState({
    status: 'ACTIVE',
    distance: '10',
    material: 'all',
    quantity: 'all'
  })
  const [activeTab, setActiveTab] = useState('available')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUserData()
      fetchUserListings()
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      if (activeTab === 'available') {
        fetchAvailableListings()
      } else {
        fetchUserListings()
      }
    }
  }, [status, filters, activeTab])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          zipCode: data.zipCode
        })
      } else {
        console.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchAvailableListings = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        distance: filters.distance,
        material: filters.material,
        quantity: filters.quantity
      })
      const response = await fetch(`/api/listings/nearby?${queryParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAvailableListings(data.listings)
    } catch (error) {
      console.error('Error fetching available listings:', error)
    }
  }

  const fetchUserListings = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        material: filters.material,
        quantity: filters.quantity
      })
      const response = await fetch(`/api/listings/user?${queryParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUserListings(data.listings)
    } catch (error) {
      console.error('Error fetching user listings:', error)
    }
  }

  const handleEditListing = async (updatedListing: Listing) => {
    try {
      const response = await fetch(`/api/listings/${updatedListing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedListing),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedListingData = await response.json()
    
      // Update the listings state immediately
      setUserListings(prevListings => 
        prevListings.map(listing => 
          listing.id === updatedListingData.listing.id ? updatedListingData.listing : listing
        )
      )
      setAvailableListings(prevListings => 
        prevListings.map(listing => 
          listing.id === updatedListingData.listing.id ? updatedListingData.listing : listing
        )
      )

      toast.success('Listing updated successfully')
    } catch (error) {
      console.error('Error updating listing:', error)
      toast.error('Failed to update listing')
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'DELETED' }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success('Listing deleted successfully')
      fetchUserListings()
      fetchAvailableListings()
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast.error('Failed to delete listing')
    }
  }

  const handleMarkListingComplete = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success('Listing marked as complete')
      fetchUserListings()
      fetchAvailableListings()
    } catch (error) {
      console.error('Error marking listing as complete:', error)
      toast.error('Failed to mark listing as complete')
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }))
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-8 pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                {userData ? `${capitalizeFirstLetter(userData.firstName)}'s Dashboard` : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">Manage your listings and explore available materials</p>
            </div>
            <Link href="/listings/create" className="mt-4 sm:mt-0">
              <Button className="bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center">
                <Plus className="mr-2 h-5 w-5" /> 
                <span>New Listing</span>
              </Button>
            </Link>
          </div>
          <ListingTabs
            availableListings={availableListings}
            userListings={userListings}
            userZipCode={userData?.zipCode.toString() || null}
            onEditListing={handleEditListing}
            onDeleteListing={handleDeleteListing}
            onMarkListingComplete={handleMarkListingComplete}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  )
}

