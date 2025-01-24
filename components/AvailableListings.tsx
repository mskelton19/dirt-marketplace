import React, { useState } from 'react';
import { Listing, User, FilterOptions } from '../types';
import ListingCard from './ListingCard';
import FilterOptions from './FilterOptions';

interface AvailableListingsProps {
  currentUser: User;
  listings: Listing[];
  onContact: (method: 'email' | 'phone' | 'message', listing: Listing) => void;
}

export const AvailableListings: React.FC<AvailableListingsProps> = ({ currentUser, listings, onContact }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    materialType: 'all',
    minQuantity: 0,
    maxDistance: 100
  });

  const filteredListings = listings.filter(listing => 
    listing.sellerId !== currentUser.id &&
    (filters.materialType === 'all' || listing.name === filters.materialType) &&
    listing.quantity >= filters.minQuantity &&
    (listing.distance || 0) <= filters.maxDistance
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Available Listings</h2>
      <FilterOptions filters={filters} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isOwner={false}
            onContact={onContact}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableListings;

