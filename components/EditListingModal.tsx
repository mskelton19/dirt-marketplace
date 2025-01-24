<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Listing, MaterialType, MeasurementType } from "@/types/listing"
import { AddressMap } from "./AddressMap"
import mapboxgl from "mapbox-gl"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface EditListingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEditListing: (updatedListing: Listing) => void
  listing: Listing | null
}

export function EditListingModal({ isOpen, onOpenChange, onEditListing, listing }: EditListingModalProps) {
  const [editedListing, setEditedListing] = useState<Listing | null>(null)
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAddressFromMap, setIsAddressFromMap] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const fetchListingData = async (listingId: string) => {
    if (!listingId) {
      console.error("fetchListingData called with undefined listingId")
      throw new Error("Invalid listing ID")
    }
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("listings").select("*").eq("id", listingId).single()

      if (error) {
        console.error("Supabase error fetching listing:", JSON.stringify(error, null, 2))
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data) {
        console.error("No data returned for listing ID:", listingId)
        throw new Error("No data returned for listing ID: " + listingId)
      }

      console.log("Fetched listing data:", JSON.stringify(data, null, 2))
      return data
    } catch (error) {
      console.error("Unexpected error fetching listing:", error)
      throw error
    }
  }

  useEffect(() => {
    console.log("EditListingModal opened with listing:", listing)
    if (isOpen && listing && listing.id) {
      const fetchData = async () => {
        setIsLoadingData(true)
        setError(null)
        try {
          const fetchedListing = await fetchListingData(listing.id)
          setEditedListing(fetchedListing)
          setAddress(fetchedListing.address || "")
          setCoordinates(
            fetchedListing.latitude && fetchedListing.longitude
              ? [fetchedListing.longitude, fetchedListing.latitude]
              : null,
          )
        } catch (error) {
          console.error("Error in fetchData:", error)
          setError(error instanceof Error ? error.message : "Failed to fetch listing data")
          toast({
            title: "Error",
            description: "Failed to fetch listing data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingData(false)
        }
      }
      fetchData()
    } else if (isOpen) {
      console.error("EditListingModal opened without a valid listing:", listing)
      setError("No valid listing provided for editing.")
      toast({
        title: "Error",
        description: "Failed to load listing data. Please try again.",
        variant: "destructive",
      })
    }
  }, [isOpen, listing, toast])

  const simplifyAddress = (address: string): string => {
    return address.replace(/, United States$/, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!editedListing || !editedListing.id) {
      console.error("handleSubmit called with invalid editedListing:", editedListing)
      setError("No valid listing data to update.")
      setIsLoading(false)
      return
    }

    const simplifiedAddress = simplifyAddress(address)

    const updatedListing: Listing = {
      ...editedListing,
      address: simplifiedAddress,
      latitude: coordinates ? coordinates[1] : null,
      longitude: coordinates ? coordinates[0] : null,
    }

    try {
      const supabase = createClientComponentClient<Database>()
      const { error } = await supabase.from("listings").update(updatedListing).eq("id", editedListing.id)

      if (error) throw error

      onEditListing(updatedListing)
      onOpenChange(false)
      toast({
        title: "Success",
        description: "Listing updated successfully.",
      })
    } catch (error) {
      console.error("EditListingModal: Error updating listing:", error)
      setError("Failed to update listing. Please try again.")
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressChange = (newAddress: string, newCoordinates?: [number, number]) => {
    setAddress(newAddress)
    if (newCoordinates) {
      setCoordinates(newCoordinates)
      setEditedListing((prev) =>
        prev
          ? {
              ...prev,
              latitude: newCoordinates[1],
              longitude: newCoordinates[0],
            }
          : null,
      )
    }
  }

  const fetchSuggestions = async (input: string) => {
    if (input.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${mapboxgl.accessToken}&types=address`,
        )
        const data = await response.json()
        const newSuggestions = data.features.map((feature: any) => feature.place_name)
        setSuggestions(newSuggestions)
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
        toast({
          title: "Error",
          description: "Failed to fetch address suggestions. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      setSuggestions([])
    }
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setAddress(newAddress)
    setIsAddressFromMap(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newAddress)
    }, 300)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion)
    setSuggestions([])
    setIsAddressFromMap(true)
  }

  if (isLoadingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Loading listing data...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="mb-4">{error}</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setError(null)
                onOpenChange(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
=======
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
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
  }

  if (!editedListing) return null

  return (
<<<<<<< HEAD
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={editedListing.site_name || ""}
                onChange={(e) => setEditedListing({ ...editedListing, site_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={editedListing.company_name || ""}
                onChange={(e) => setEditedListing({ ...editedListing, company_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Select
                value={editedListing.material || ""}
                onValueChange={(value: MaterialType) => setEditedListing({ ...editedListing, material: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Topsoil">Topsoil</SelectItem>
                  <SelectItem value="Structural Fill">Structural Fill</SelectItem>
                  <SelectItem value="Crushed Rock">Crushed Rock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={editedListing.transaction_type || ""}
                onValueChange={(value: "Import" | "Export") =>
                  setEditedListing({ ...editedListing, transaction_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Import">Import</SelectItem>
                  <SelectItem value="Export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={editedListing.quantity === undefined ? "" : editedListing.quantity}
                onChange={(e) =>
                  setEditedListing({
                    ...editedListing,
                    quantity: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="measurementType">Measurement Type</Label>
              <Select
                value={editedListing.measurement_type || ""}
                onValueChange={(value: MeasurementType) =>
                  setEditedListing({ ...editedListing, measurement_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select measurement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cubic Yards">Cubic Yards</SelectItem>
                  <SelectItem value="Tons">Tons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Label htmlFor="address">Site Address</Label>
              <Input id="address" value={address} onChange={handleAddressInputChange} required />
              {!isAddressFromMap && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="w-full h-96 mt-4">
            <AddressMap
              onAddressChange={handleAddressChange}
              address={address}
              initialCoordinates={coordinates}
              userZipCode={editedListing.zip_code || ""}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Listing"}
            </Button>
          </DialogFooter>
        </form>
=======
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
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
      </DialogContent>
    </Dialog>
  )
}

<<<<<<< HEAD
=======
export default EditListingModal

>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
