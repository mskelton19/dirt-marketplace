import React, { useState } from 'react';
import { Listing, User, FilterOptions } from '../types';
import ListingCard from './ListingCard';
import FilterOptions from './FilterOptions';
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react';

interface MyListingsProps {
  user: User;
  listings: Listing[];
  onUpdateListing: (listing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
  onCompleteListing: (listingId: string) => void;
  onCreateListing: (newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  user,
  listings,
  onUpdateListing,
  onDeleteListing,
  onCompleteListing,
  onCreateListing
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    materialType: 'all',
    minQuantity: 0,
    maxDistance: 100,
    status: 'active'
  });

  const filteredListings = listings.filter(listing => 
    (filters.materialType === 'all' || listing.name === filters.materialType) &&
    listing.quantity >= filters.minQuantity &&
    (listing.distance || 0) <= filters.maxDistance &&
    listing.status === filters.status
  );

  const handleCreateListing = () => {
    // Implement create listing logic
    const newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'> = {
      sellerId: user.id,
      sellerName: `${user.firstName} ${user.lastName}`,
      name: '',
      quantity: 0,
      unit: '',
      price: 0,
      location: '',
      siteName: '',
      contactEmail: user.email,
      contactPhone: user.phoneNumber,
      latitude: 0,
      longitude: 0,
      status: 'active'
    };
    onCreateListing(newListing);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Button onClick={handleCreateListing}>
          <PlusCircle className="w-4 h-4 mr-2" /> Create Listing
        </Button>
      </div>
      <FilterOptions filters={filters} onFilterChange={setFilters} showStatusFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isOwner={true}
            onEdit={onUpdateListing}
            onDelete={onDeleteListing}
            onComplete={onCompleteListing}
          />
        ))}
      </div>
    </div>
  );
};

