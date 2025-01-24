import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Listing } from "@/types/listing"

interface Company {
  id: string
  name: string
}

interface CompleteListingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCompleteListing: (updatedListing: Listing, newCompletedListing: Listing | null) => void
  listing: Listing | null
}

export function CompleteListingModal({ isOpen, onOpenChange, onCompleteListing, listing }: CompleteListingModalProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [quantityMoved, setQuantityMoved] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!isOpen) return
      setIsLoading(true)
      try {
        const response = await fetch("/api/companies")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API")
        }
        setCompanies(data)
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Error",
          description: "Failed to fetch companies. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
    resetForm()
  }, [isOpen, toast])

  const resetForm = () => {
    if (listing) {
      setQuantityMoved(listing.quantity.toString())
    } else {
      setQuantityMoved("")
    }
    setSelectedCompany("")
    setError(null)
  }

  const handleComplete = async () => {
    if (!selectedCompany || !quantityMoved || !listing) {
      toast({
        title: "Error",
        description: "Please select a partner company and enter a quantity moved.",
        variant: "destructive",
      })
      return
    }

    const movedQuantity = Number.parseFloat(quantityMoved)
    if (isNaN(movedQuantity) || movedQuantity <= 0) {
      setError(`Please enter a valid quantity greater than 0.`)
      return
    }

    if (movedQuantity > listing.quantity) {
      setError(`Cannot move more than the available quantity (${listing.quantity} ${listing.measurement_type}).`)
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity_moved: movedQuantity,
          partner_company: selectedCompany,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete listing")
      }

      const { updated_listing, new_completed_listing } = await response.json()

      onCompleteListing(updated_listing, new_completed_listing)
      onOpenChange(false)
      toast({
        title: "Success",
        description: new_completed_listing
          ? "Listing partially completed and new completed listing created."
          : "Listing fully completed.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error completing listing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Listing</DialogTitle>
          <DialogDescription>Enter the details to complete this listing.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="partnerCompany" className="text-right">
              Partner Company
            </Label>
            <Select onValueChange={setSelectedCompany} value={selectedCompany} disabled={isLoading}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={isLoading ? "Loading companies..." : "Select a partner company"} />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantityMoved" className="text-right">
              Quantity Moved
            </Label>
            <Input
              id="quantityMoved"
              type="number"
              value={quantityMoved}
              onChange={(e) => {
                setQuantityMoved(e.target.value)
                setError(null)
              }}
              className="col-span-3"
              placeholder={`Enter quantity (max ${listing?.quantity ?? 0})`}
              disabled={isLoading}
              max={listing?.quantity ?? undefined}
              min={0}
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2 mb-4">{error}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? "Processing..." : "Complete Listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

