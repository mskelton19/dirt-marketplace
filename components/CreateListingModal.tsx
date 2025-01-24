import { useState, useRef, useEffect } from "react"
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

interface CreateListingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateListing: (newListing: Omit<Listing, "id" | "created_at" | "updated_at">) => void
  currentUser: any
}

export function CreateListingModal({ isOpen, onOpenChange, onCreateListing, currentUser }: CreateListingModalProps) {
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    site_name: "",
    material: undefined,
    transaction_type: undefined,
    quantity: undefined,
    measurement_type: undefined,
    address: "",
    latitude: null,
    longitude: null,
    company_name: currentUser.company || "",
  })
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAddressFromMap, setIsAddressFromMap] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const simplifyAddress = (address: string): string => {
    return address.replace(/, United States$/, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const simplifiedAddress = simplifyAddress(address)

    const listingToCreate: Omit<Listing, "id" | "created_at" | "updated_at"> = {
      ...newListing,
      address: simplifiedAddress,
      latitude: coordinates ? coordinates[1] : null,
      longitude: coordinates ? coordinates[0] : null,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      user_phone: currentUser.phone,
      company_name: newListing.company_name || currentUser.company || "",
      posted_date: new Date().toISOString(),
    } as Omit<Listing, "id" | "created_at" | "updated_at">

    try {
      await onCreateListing(listingToCreate)
      onOpenChange(false)
      toast({
        title: "Success",
        description: "Listing created successfully.",
      })
    } catch (error) {
      console.error("CreateListingModal: Error creating listing:", error)
      let errorMessage = "Failed to create listing. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String(error.message)
      }
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
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
      setNewListing((prev) => ({
        ...prev,
        latitude: newCoordinates[1],
        longitude: newCoordinates[0],
      }))
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

  useEffect(() => {
    if (newListing.material === "Topsoil") {
      setNewListing((prev) => ({ ...prev, measurement_type: "Cubic Yards" }))
    } else if (newListing.material === "Structural Fill") {
      setNewListing((prev) => ({ ...prev, measurement_type: "Tons" }))
    }
  }, [newListing.material])

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
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={newListing.site_name || ""}
                onChange={(e) => setNewListing({ ...newListing, site_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Select
                value={newListing.material || ""}
                onValueChange={(value: MaterialType) => setNewListing({ ...newListing, material: value })}
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
                value={newListing.transaction_type || ""}
                onValueChange={(value: "Import" | "Export") =>
                  setNewListing({ ...newListing, transaction_type: value })
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
                value={newListing.quantity === undefined ? "" : newListing.quantity}
                onChange={(e) =>
                  setNewListing({
                    ...newListing,
                    quantity: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="measurementType">Measurement Type</Label>
              <Select
                value={newListing.measurement_type || ""}
                onValueChange={(value: MeasurementType) => setNewListing({ ...newListing, measurement_type: value })}
                disabled={newListing.material === "Topsoil" || newListing.material === "Structural Fill"}
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
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={newListing.company_name || ""}
                onChange={(e) => setNewListing({ ...newListing, company_name: e.target.value })}
                required
              />
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
              userZipCode={currentUser?.zipCode || ""}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

