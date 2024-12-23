'use client'

import { useState, useCallback, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Map, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMapInitializer } from './useMapInitializer'
import { AlertCircle, Plus } from 'lucide-react'
import { AddressAutocomplete } from '@/components/AddressAutocomplete'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export default function CreateListing() {
  const [name, setName] = useState('')
  const [material, setMaterial] = useState('')
  const [quantity, setQuantity] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number] | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  const { viewState, onMove, marker, setMarker, onClick } = useMapInitializer(
    initialCoordinates 
      ? { 
          initialLongitude: initialCoordinates[0], 
          initialLatitude: initialCoordinates[1], 
          initialZoom: 10 
        } 
      : undefined
  )

  useEffect(() => {
    const fetchUserZipCode = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const userData = await response.json()
          if (userData.zipCode) {
            const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userData.zipCode}.json?access_token=${MAPBOX_TOKEN}`)
            const geocodeData = await geocodeResponse.json()
            if (geocodeData.features && geocodeData.features.length > 0) {
              const [lng, lat] = geocodeData.features[0].center
              setInitialCoordinates([lng, lat])
            }
          }
        } else {
          console.error('Failed to fetch user data:', await response.text())
        }
      } catch (error) {
        console.error('Error fetching user zip code:', error)
      }
    }

    fetchUserZipCode()
  }, [])

  const handleAddressSelect = useCallback((selectedAddress: string) => {
    setAddress(selectedAddress)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(selectedAddress)}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          setMarker([lng, lat])
          onMove({ viewState: { longitude: lng, latitude: lat, zoom: 14 } })
        }
      })
      .catch(error => {
        console.error('Error geocoding address:', error)
        setError('Failed to find location for this address')
      })
  }, [setMarker, onMove])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!marker) {
      setError('Please select a location on the map')
      setIsSubmitting(false)
      return
    }

    if (!address) {
      setError('Please select a complete address')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('Submitting form data:', { name, material, quantity, latitude: marker[1], longitude: marker[0], address })
      
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          material,
          quantity: parseFloat(quantity),
          latitude: marker[1],
          longitude: marker[0],
          address,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError)
        throw new Error('Invalid JSON response from server')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing')
      }

      console.log('Listing created successfully:', data)
      router.push('/dashboard')
    } catch (error) {
      console.error('Create listing error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="text-center mt-8">Please sign in to create a listing.</div>
  }

  if (!MAPBOX_TOKEN) {
    return <div className="text-center mt-8">Mapbox token is missing. Please check your environment variables.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Listing</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Listing Name</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
                placeholder="Enter a name for your listing"
              />
            </div>
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
              <Select onValueChange={setMaterial} required>
                <SelectTrigger className="w-full text-gray-900">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="soil" className="text-gray-900">Soil</SelectItem>
                  <SelectItem value="gravel" className="text-gray-900">Gravel</SelectItem>
                  <SelectItem value="sand" className="text-gray-900">Sand</SelectItem>
                  <SelectItem value="concrete" className="text-gray-900">Concrete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity (in cubic yards)
              </label>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <AddressAutocomplete onAddressSelect={handleAddressSelect} value={address} onChange={setAddress} />
              <p className="mt-1 text-sm text-gray-500">Manually enter an address or place a pin on the map</p>
            </div>
            <div className="w-full h-[400px] rounded-md overflow-hidden">
              <Map
                {...viewState}
                onMove={onMove}
                onClick={(evt) => {
                  if (evt.lngLat) {
                    onClick(evt)
                    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${evt.lngLat.lng},${evt.lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`)
                      .then(response => response.json())
                      .then(data => {
                        if (data.features && data.features.length > 0) {
                          setAddress(data.features[0].place_name)
                        }
                      })
                      .catch(error => {
                        console.error('Error reverse geocoding:', error)
                        setError('Failed to get address from location')
                      })
                  }
                }}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                <NavigationControl />
                {marker && (
                  <Marker longitude={marker[0]} latitude={marker[1]} color="red" />
                )}
              </Map>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse mr-2">●</span>
                  Creating...
                </>
              ) : (
                <>
                  Create Listing
                  <Plus className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

