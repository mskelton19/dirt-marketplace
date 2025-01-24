"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "react-hot-toast"
import { ListingsView } from "@/components/ListingsView"
import { CreateListingModal } from "@/components/CreateListingModal"
import { EditListingModal } from "@/components/EditListingModal"
import { CompleteListingModal } from "@/components/CompleteListingModal"
import { FilterSidebar } from "@/components/FilterSidebar"
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { fetchListings, createListing, updateListing, completeListing, inactivateListing } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { Listing, MaterialType, ListingStatus, UserData } from "@/types/listing"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [filters, setFilters] = useState({
    transactionType: "all",
    material: "all" as MaterialType | "all",
    quantity: "all",
    status: "active" as ListingStatus | "all",
    distance: "10",
  })
  const [activeTab, setActiveTab] = useState("my-listings")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchUserData()
      fetchListingsData()
    }
  }, [status, activeTab, filters])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        console.error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchListingsData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchListings(activeTab, filters)
      setListings(data)
    } catch (error) {
      console.error("Error fetching listings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateListing = async (newListing: Omit<Listing, "id" | "created_at" | "updated_at">) => {
    try {
      const createdListing = await createListing(newListing)
      setListings([createdListing, ...listings])
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "Listing created successfully.",
      })
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing)
    setIsEditModalOpen(true)
  }

  const handleUpdateListing = async (updatedListing: Listing) => {
    try {
      const result = await updateListing(updatedListing)
      setListings((prevListings) => prevListings.map((listing) => (listing.id === result.id ? result : listing)))
      setIsEditModalOpen(false)
      toast({
        title: "Success",
        description: "Listing updated successfully.",
      })
    } catch (error) {
      console.error("Error updating listing:", error)
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteListing = async (listing: Listing, quantityMoved: number, partnerCompany: string) => {
    try {
      const result = await completeListing(listing.id, quantityMoved, partnerCompany)
      setListings((prevListings) => {
        const updatedListings = prevListings.map((l) => (l.id === listing.id ? result.updatedListing : l))
        if (result.newCompletedListing) {
          updatedListings.push(result.newCompletedListing)
        }
        return updatedListings
      })
      setIsCompleteModalOpen(false)
      setSelectedListing(null)
      toast({
        title: "Success",
        description: result.newCompletedListing
          ? "Listing partially completed and new completed listing created."
          : "Listing marked as completed successfully.",
      })
    } catch (error) {
      console.error("Error completing listing:", error)
      toast({
        title: "Error",
        description: "Failed to complete listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInactivateListing = async (listingId: string) => {
    try {
      await inactivateListing(listingId)
      setListings(listings.map((listing) => (listing.id === listingId ? { ...listing, status: "inactive" } : listing)))
      toast({
        title: "Success",
        description: "Listing inactivated successfully.",
      })
    } catch (error) {
      console.error("Error inactivating listing:", error)
      toast({
        title: "Error",
        description: "Failed to inactivate listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }))
  }

  const tabOptions = [
    { value: "my-listings", label: "My Listings" },
    { value: "active-listings", label: "Active Listings" },
    { value: "analytics", label: "Analytics" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "my-listings":
      case "active-listings":
        return (
          <ListingsView
            listings={listings}
            onEdit={handleEditListing}
            onComplete={(listing) => {
              setSelectedListing(listing)
              setIsCompleteModalOpen(true)
            }}
            onInactivate={handleInactivateListing}
            isAvailableListings={activeTab === "active-listings"}
          />
        )
      case "analytics":
        return <AnalyticsDashboard listings={listings} currentUser={userData} />
      default:
        return null
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white">
              <Plus className="mr-2 h-5 w-5" />
              Create Listing
            </Button>
          </div>

          {/* Mobile view: Dropdown for tab selection */}
          <div className="md:hidden mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {tabOptions.find((tab) => tab.value === activeTab)?.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {tabOptions.map((tab) => (
                  <DropdownMenuItem key={tab.value} onSelect={() => setActiveTab(tab.value)}>
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop view: Tabs */}
          <div className="hidden md:block">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                {tabOptions.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-6 flex-grow flex flex-col md:flex-row">
            {activeTab !== "analytics" && (
              <div className="md:w-64 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                <Button className="md:hidden w-full mb-4" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  {isSidebarOpen ? "Hide Filters" : "Show Filters"}
                </Button>
                <div className={`md:block ${isSidebarOpen ? "block" : "hidden"}`}>
                  <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}
            <div className={`flex-grow overflow-hidden flex flex-col ${activeTab === "analytics" ? "md:w-full" : ""}`}>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateListing={handleCreateListing}
        currentUser={userData}
      />

      <EditListingModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onEditListing={handleUpdateListing}
        listing={selectedListing}
      />

      <CompleteListingModal
        isOpen={isCompleteModalOpen}
        onOpenChange={(open) => {
          setIsCompleteModalOpen(open)
          if (!open) setSelectedListing(null)
        }}
        onCompleteListing={(quantityMoved, partnerCompany) => {
          if (selectedListing) {
            handleCompleteListing(selectedListing, quantityMoved, partnerCompany)
          }
        }}
        listing={selectedListing}
      />
    </div>
  )
}

