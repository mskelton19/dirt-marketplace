"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ListingsView } from "@/components/ListingsView"
import type { Listing, MaterialType, ListingStatus } from "@/types/listing"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronDown } from "lucide-react"
import { CreateListingModal } from "@/components/CreateListingModal"
import { EditListingModal } from "@/components/EditListingModal"
import { CompleteListingModal } from "@/components/CompleteListingModal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterSidebar } from "@/components/FilterSidebar"
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard"
import type { Database } from "@/lib/database.types"
import { calculateDistance, getCoordinatesFromZipCode } from "@/utils/distance"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [transactionFilter, setTransactionFilter] = useState<"all" | "import" | "export">("all")
  const [materialFilter, setMaterialFilter] = useState<MaterialType | "all">("all")
  const [quantityFilter, setQuantityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("active")
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null)
  const [activeTab, setActiveTab] = useState("my-listings")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [recentlyUpdatedListingId, setRecentlyUpdatedListingId] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("Authentication error:", error)
        router.push("/login")
      } else {
        await fetchCurrentUser(user.id)
      }
    }

    checkUser()
  }, [supabase, router])

  useEffect(() => {
    if (currentUser) {
      fetchListings()
      if (activeTab === "my-listings") {
        setStatusFilter("active")
      }
    }
  }, [currentUser, activeTab])

  const fetchCurrentUser = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return
    }

    if (!profile) {
      console.error("No profile found for user ID:", userId)
      return
    }

    setCurrentUser({
      id: userId,
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      phone: profile.phone_number,
      zipCode: profile.zip_code,
      contactPreference: profile.contact_preference,
      company: profile.company_name,
      role: profile.role,
    })

    const coordinates = await getCoordinatesFromZipCode(profile.zip_code)
    if (coordinates) {
      setUserCoordinates(coordinates)
    }
  }

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
        *,
        completed_transactions (
          id,
          quantity_moved,
          partner_company,
          transaction_type
        )
      `)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setListings(data)
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateListing = async (newListing: Omit<Listing, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase.from("listings").insert([newListing]).select()

      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after creating listing")
      }

      setListings([data[0], ...listings])
      toast({
        title: "Success",
        description: "Listing created successfully.",
      })
    } catch (error) {
      console.error("Error creating listing:", error)
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing)
    setIsEditModalOpen(true)
  }

  const handleUpdateListing = (updatedListing: Listing) => {
    setListings((prevListings) =>
      prevListings.map((listing) => (listing.id === updatedListing.id ? updatedListing : listing)),
    )
    setRecentlyUpdatedListingId(updatedListing.id)
    setTimeout(() => setRecentlyUpdatedListingId(null), 2000) // Remove highlight after 2 seconds
    setIsEditModalOpen(false)
    toast({
      title: "Success",
      description: "Listing updated successfully.",
    })
  }

  const handleCompleteListing = async (listing: Listing, quantityMoved: number, partnerCompany: string) => {
    try {
      if (!listing || !listing.id) {
        throw new Error("Invalid listing data")
      }

      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity_moved: quantityMoved,
          partner_company: partnerCompany,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete listing")
      }

      const { updatedListing, newCompletedListing } = await response.json()

      setListings((prevListings) => {
        const updatedListings = prevListings.map((l) => (l.id === listing.id ? updatedListing : l))

        if (newCompletedListing) {
          updatedListings.push(newCompletedListing)
        }

        return updatedListings
      })

      setIsCompleteModalOpen(false)
      setSelectedListing(null)

      toast({
        title: "Success",
        description: newCompletedListing
          ? "Listing partially completed and new completed listing created."
          : "Listing marked as completed successfully.",
      })

      // Refresh listings to ensure we have the most up-to-date data
      fetchListings()
    } catch (error) {
      console.error("Error completing listing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInactivateListing = async (listingId: string) => {
    try {
      const { error } = await supabase.from("listings").update({ status: "inactive" }).eq("id", listingId)

      if (error) {
        throw error
      }

      setListings(listings.map((listing) => (listing.id === listingId ? { ...listing, status: "inactive" } : listing)))
    } catch (error) {
      console.error("Error inactivating listing:", error)
      throw error
    }
  }

  const filteredListings = (listingsToFilter: Listing[], tabType: string) => {
    return listingsToFilter
      .filter((listing): listing is Listing => !!listing) // Filter out undefined or null listings
      .filter((listing) => {
        const isOwnListing = listing.user_id === currentUser?.id
        if (tabType === "my-listings" && !isOwnListing) return false
        if (tabType === "active-listings" && (isOwnListing || listing.status !== "active")) return false

        if (tabType === "my-listings" && statusFilter !== "all" && listing.status !== statusFilter) return false
        if (transactionFilter !== "all" && (listing.transaction_type?.toLowerCase() ?? "export") !== transactionFilter)
          return false
        if (materialFilter !== "all" && listing.material !== materialFilter) return false

        if (quantityFilter !== "all") {
          const [min, max] = quantityFilter.split("-").map(Number)
          if (max) {
            if (listing.quantity < min || listing.quantity > max) return false
          } else {
            if (listing.quantity <= min) return false
          }
        }

        return true
      })
      .map((listing) => ({
        ...listing,
        distance:
          userCoordinates && listing.latitude && listing.longitude
            ? calculateDistance(userCoordinates[0], userCoordinates[1], listing.latitude, listing.longitude)
            : null,
      }))
  }

  const tabOptions = [
    { value: "my-listings", label: "My Listings" },
    { value: "active-listings", label: "Active Listings" },
    { value: "analytics", label: "Analytics" },
  ]

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    if (newTab === "my-listings") {
      setStatusFilter("active")
    } else if (newTab === "active-listings") {
      setStatusFilter("active")
    } else {
      setStatusFilter("all")
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const renderContent = () => {
    switch (activeTab) {
      case "my-listings":
        return (
          <ListingsView
            listings={filteredListings(listings, "my-listings")}
            onEdit={(listing) => handleEditListing(listing)}
            onComplete={(listing) => {
              console.log("Completing listing:", listing)
              setSelectedListing(listing)
              setIsCompleteModalOpen(true)
            }}
            onInactivate={handleInactivateListing}
            isAvailableListings={false}
          />
        )
      case "active-listings":
        return (
          <ListingsView
            listings={filteredListings(listings, "active-listings")}
            onContact={(id) => console.log(`Contacting seller for listing ${id}`)}
            isAvailableListings={true}
          />
        )
      case "analytics":
        return <AnalyticsDashboard listings={listings} currentUser={currentUser} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white">
              <PlusCircle className="mr-2 h-5 w-5" />
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
                  <DropdownMenuItem key={tab.value} onSelect={() => handleTabChange(tab.value)}>
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop view: Tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="my-listings" className="w-full" value={activeTab} onValueChange={handleTabChange}>
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
                  <FilterSidebar
                    transactionFilter={transactionFilter}
                    setTransactionFilter={setTransactionFilter}
                    materialFilter={materialFilter}
                    setMaterialFilter={setMaterialFilter}
                    quantityFilter={quantityFilter}
                    setQuantityFilter={setQuantityFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                  />
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
        currentUser={currentUser}
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

