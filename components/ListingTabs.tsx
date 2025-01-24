import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ListingList from './ListingList'
import ListingMap from './ListingMap'
import ViewModeToggle from './ViewModeToggle'
import EditListingModal from './EditListingModal'
import FilterOptions from './FilterOptions'

interface Listing {
  id: string
  name: string
  type: string
  quantity: number
  latitude: number
  longitude: number
  address: string
  distance?: number
  isAvailable: boolean
  status: 'ACTIVE' | 'COMPLETED'
  user: {
    email: string
    phone: string
  }
}

interface ListingTabsProps {
  availableListings: Listing[] | undefined
  userListings: Listing[] | undefined
  userZipCode: string | null
  onEditListing: (updatedListing: Listing) => void
  onDeleteListing: (listingId: string) => void
  onMarkListingComplete: (listingId: string) => void
  onFilterChange: (filterType: string, value: string) => void
  initialFilters: {
    status: string
    distance: string
    material: string
    quantity: string
  }
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ListingTabs: React.FC<ListingTabsProps> = ({
  availableListings,
  userListings,
  userZipCode,
  onEditListing,
  onDeleteListing,
  onMarkListingComplete,
  onFilterChange,
  initialFilters,
  activeTab,
  onTabChange,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing)
  }

  const handleSaveEditedListing = (updatedListing: Listing) => {
    onEditListing(updatedListing)
    setEditingListing(null)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFilterChange(filterType, value)
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/4 md:order-1">
          <FilterOptions 
            onFilterChange={handleFilterChange}
            onClearFilters={() => {
              const clearedFilters = activeTab === 'available' 
                ? { distance: '10', material: 'all', quantity: 'all' }
                : { status: 'all', material: 'all', quantity: 'all' };
              setFilters(clearedFilters);
              Object.entries(clearedFilters).forEach(([key, value]) => onFilterChange(key, value));
            }}
            className="p-4 mb-4"
            initialFilters={filters}
            disableStatus={activeTab === 'available'}
          />
        </div>
        <div className="md:w-3/4 md:order-2">
          <TabsList className="flex w-full bg-gray-100 p-2 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <TabsTrigger 
              value="available" 
              className="flex-1 py-2 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 rounded-lg
              data-[state=active]:bg-white data-[state=active]:text-[#F97316] data-[state=active]:shadow-md
              data-[state=active]:border-t-2 sm:data-[state=active]:border-t-4 data-[state=active]:border-accent
              text-gray-600 hover:bg-gray-200 data-[state=active]:font-bold"
            >
              Available Materials
            </TabsTrigger>
            <TabsTrigger 
              value="user" 
              className="flex-1 py-2 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 rounded-lg
              data-[state=active]:bg-white data-[state=active]:text-[#F97316] data-[state=active]:shadow-md
              data-[state=active]:border-t-2 sm:data-[state=active]:border-t-4 data-[state=active]:border-accent
              text-gray-600 hover:bg-gray-200 data-[state=active]:font-bold"
            >
              My Listings
            </TabsTrigger>
          </TabsList>
          <div className="md:hidden mb-4">
            <FilterOptions 
              onFilterChange={handleFilterChange}
              onClearFilters={() => {
                const clearedFilters = activeTab === 'available' 
                  ? { distance: '10', material: 'all', quantity: 'all' }
                  : { status: 'all', material: 'all', quantity: 'all' };
                setFilters(clearedFilters);
                Object.entries(clearedFilters).forEach(([key, value]) => onFilterChange(key, value));
              }}
              className="p-4"
              initialFilters={filters}
              disableStatus={activeTab === 'available'}
            />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-md w-full">
            <div className="flex justify-end mb-4">
              <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
            </div>
            <TabsContent value="available">
              {viewMode === 'list' ? (
                <ListingList listings={availableListings || []} isUserListings={false} />
              ) : (
                <ListingMap 
                  listings={availableListings} 
                  userZipCode={userZipCode} 
                  activeTab="available"
                />
              )}
            </TabsContent>
            <TabsContent value="user">
              {viewMode === 'list' ? (
                <ListingList
                  listings={userListings || []}
                  isUserListings={true}
                  onEdit={handleEditListing}
                  onDelete={onDeleteListing}
                  onMarkComplete={onMarkListingComplete}
                />
              ) : (
                <ListingMap 
                  listings={userListings} 
                  userZipCode={userZipCode} 
                  activeTab="user"
                  onEdit={handleEditListing}
                  onDelete={onDeleteListing}
                  onMarkComplete={onMarkListingComplete}
                />
              )}
            </TabsContent>
          </div>
        </div>
      </div>
      <EditListingModal
        listing={editingListing}
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
        onSave={handleSaveEditedListing}
      />
    </Tabs>
  )
}

export default ListingTabs

