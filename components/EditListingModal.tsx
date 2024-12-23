import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddressAutocomplete } from '@/components/AddressAutocomplete'
import { MapPin } from 'lucide-react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Listing {
  id: string
  name: string
  type: string
  quantity: number
  latitude: number
  longitude: number
  address: string
}

interface EditListingModalProps {
  listing: Listing | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedListing: Listing) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, isOpen, onClose, onSave }) => {
  const [editedListing, setEditedListing] = useState<Listing | null>(null)
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 10
  })

  useEffect(() => {
    if (listing) {
      setEditedListing(listing)
      setViewState({
        latitude: listing.latitude,
        longitude: listing.longitude,
        zoom: 10
      })
    }
  }, [listing])

  const handleSave = () => {
    if (editedListing) {
      onSave(editedListing)
    }
    onClose()
  }

  const handleAddressSelect = (selectedAddress: string) => {
    if (editedListing) {
      setEditedListing({ ...editedListing, address: selectedAddress })
      // Geocode the address and update latitude and longitude
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(selectedAddress)}.json?access_token=${MAPBOX_TOKEN}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center
            setEditedListing(prev => ({ ...prev!, latitude: lat, longitude: lng }))
            setViewState({
              latitude: lat,
              longitude: lng,
              zoom: 10
            })
          }
        })
        .catch(error => {
          console.error('Error geocoding address:', error)
        })
    }
  }

  const handleMapClick = (event: any) => {
    if (editedListing && event.lngLat) {
      const { lng, lat } = event.lngLat
      setEditedListing({ ...editedListing, latitude: lat, longitude: lng })
      // Reverse geocode to get the address
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            setEditedListing(prev => ({ ...prev!, address: data.features[0].place_name }))
          }
        })
        .catch(error => {
          console.error('Error reverse geocoding:', error)
        })
    }
  }

  if (!editedListing) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Listing</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
            <Input
              id="name"
              value={editedListing.name}
              onChange={(e) => setEditedListing({ ...editedListing, name: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium text-gray-900">Material Type</label>
            <Select
              value={editedListing.type}
              onValueChange={(value) => setEditedListing({ ...editedListing, type: value })}
            >
              <SelectTrigger className="w-full text-gray-900">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soil" className="text-gray-900">Soil</SelectItem>
                <SelectItem value="gravel" className="text-gray-900">Gravel</SelectItem>
                <SelectItem value="sand" className="text-gray-900">Sand</SelectItem>
                <SelectItem value="concrete" className="text-gray-900">Concrete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity (CY)</label>
            <Input
              id="quantity"
              type="number"
              value={editedListing.quantity}
              onChange={(e) => setEditedListing({ ...editedListing, quantity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              value={editedListing.address}
              onChange={(value) => setEditedListing({ ...editedListing, address: value })}
            />
          </div>
          <div className="mt-4">
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={viewState}
              style={{ width: '100%', height: '300px' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onClick={handleMapClick}
            >
              <Marker
                longitude={editedListing.longitude}
                latitude={editedListing.latitude}
                anchor="bottom"
              >
                <MapPin className="w-6 h-6 text-red-500" />
              </Marker>
            </Map>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSave}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditListingModal

