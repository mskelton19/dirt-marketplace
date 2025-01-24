import { useState } from "react"
import { ListingCard } from "./ListingCard"
import { ListViewItem } from "./ListViewItem"
import type { Listing, ListingStatus } from "@/types/listing"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CompleteListingModal } from "./CompleteListingModal"

interface ListingsViewProps {
  listings: Listing[]
  onEdit?: (listing: Listing) => void
  onComplete?: (listing: Listing) => void
  onInactivate?: (id: string) => void
  onContact?: (id: string) => void
  isAvailableListings: boolean
  showCompletedListings?: boolean
  isLoading?: boolean
}

export function ListingsView({
  listings,
  onEdit,
  onComplete,
  onInactivate,
  onContact,
  isAvailableListings,
  showCompletedListings = false,
  isLoading = false,
}: ListingsViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"card" | "list">("list")
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("all")
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const { toast } = useToast()
  const listingsPerPage = 9

  const filteredListings = listings.filter(
    (listing) =>
      (statusFilter === "all" || listing.status === statusFilter) &&
      (showCompletedListings ? listing.status === "completed" : true),
  )

  const totalPages = Math.ceil(filteredListings.length / listingsPerPage)
  const indexOfLastListing = currentPage * listingsPerPage
  const indexOfFirstListing = indexOfLastListing - listingsPerPage
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleCompleteListing = (updatedListing: Listing, newCompletedListing: Listing | null) => {
    const updatedListings = listings.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    if (newCompletedListing) {
      updatedListings.push(newCompletedListing)
    }
    // Update the listings state here
    // This is a placeholder. You should replace this with your actual state update logic
    // setListings(updatedListings);

    toast({
      title: "Success",
      description: newCompletedListing
        ? "Listing partially completed and new completed listing created."
        : "Listing fully completed.",
    })
  }

  if (isLoading) {
    return (
      <Card className="flex-grow">
        <CardContent className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <p className="text-muted-foreground">Loading listings...</p>
        </CardContent>
      </Card>
    )
  }

  if (filteredListings.length === 0) {
    return (
      <Card className="flex-grow">
        <CardContent className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <p className="text-muted-foreground">No listings found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-grow overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ListingStatus | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}>
            {viewMode === "list" ? <LayoutGrid className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
            {viewMode === "list" ? "Card View" : "List View"}
          </Button>
        </div>
        <div className="h-[calc(100vh-16rem)] overflow-y-auto">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={onEdit ? () => onEdit(listing) : undefined}
                  onComplete={() => {
                    setSelectedListing(listing)
                    setIsCompleteModalOpen(true)
                  }}
                  onInactivate={onInactivate ? () => onInactivate(listing.id) : undefined}
                  onContact={onContact ? () => onContact(listing.id) : undefined}
                  isAvailableListings={isAvailableListings}
                  showStatus={true}
                />
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden shadow-sm">
              {currentListings.map((listing) => (
                <ListViewItem
                  key={listing.id}
                  listing={listing}
                  onEdit={onEdit ? () => onEdit(listing) : undefined}
                  onComplete={() => {
                    setSelectedListing(listing)
                    setIsCompleteModalOpen(true)
                  }}
                  onInactivate={onInactivate ? () => onInactivate(listing.id) : undefined}
                  onContact={onContact ? () => onContact(listing.id) : undefined}
                  isAvailableListings={isAvailableListings}
                />
              ))}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
        <CompleteListingModal
          isOpen={isCompleteModalOpen}
          onOpenChange={setIsCompleteModalOpen}
          onCompleteListing={handleCompleteListing}
          listing={selectedListing}
        />
      </CardContent>
    </Card>
  )
}

