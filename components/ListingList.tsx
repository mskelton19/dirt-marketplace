import React from 'react'
import { MapPin, Phone, Mail, Edit, Trash, CheckCircle, User } from 'lucide-react'
import MaterialIcon from './MaterialIcon'
import { Button } from "@/components/ui/button"

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
  status: 'ACTIVE' | 'COMPLETED' | 'DELETED'
  user: {
    email: string
    phone: string
    name: string
    firstName: string
    lastName?: string
  }
}

interface ListingListProps {
  listings: Listing[]
  isUserListings: boolean
  onEdit?: (listing: Listing) => void
  onDelete?: (listingId: string) => void
  onMarkComplete?: (listingId: string) => void
}

const getColorScheme = (type: string) => {
  switch (type.toLowerCase()) {
    case 'soil':
      return 'bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/30 border-[#8B4513]/40 text-[#3d1d00]'
    case 'gravel':
      return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-900'
    case 'sand':
      return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900'
    case 'concrete':
      return 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-900'
    default:
      return 'bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-900'
  }
}

const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return phoneNumber
}

const generateEmailContent = (listing: Listing) => {
  const firstName = listing.user.firstName || 'there';
  const fullName = `${listing.user.firstName} ${listing.user.lastName}`.trim() || 'Unknown User';
  const subject = encodeURIComponent(`Inquiry about ${listing.type} listing from ${fullName}`);
  const body = encodeURIComponent(`
Hello ${firstName},

I'm interested in your listing for ${listing.quantity} CY of ${listing.type}.

Listing Details:
- Material: ${listing.type}
- Quantity: ${listing.quantity} CY
- Location: ${listing.name}
${listing.distance !== undefined ? `- Distance: ${listing.distance.toFixed(1)} miles` : ''}

Could you please provide more information about this material?

Thank you,
[Your Name]
  `.trim());

  return `mailto:${listing.user.email}?subject=${subject}&body=${body}`;
};

const ListingList: React.FC<ListingListProps> = ({ listings, isUserListings, onEdit, onDelete, onMarkComplete }) => {
  const filteredListings = listings.filter(listing => 
    isUserListings ? listing.status !== 'DELETED' : listing.status === 'ACTIVE'
  )

  if (filteredListings.length === 0) {
    return <div className="text-center text-gray-600">No listings available.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredListings.map((listing) => {
        const colorScheme = getColorScheme(listing.type)
        return (
          <div key={listing.id} className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${colorScheme} flex flex-col h-full`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MaterialIcon type={listing.type} className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">{listing.type}</h3>
                </div>
                <div className={`text-xl font-bold bg-white bg-opacity-75 px-3 py-1 rounded-full shadow`}>
                  {listing.quantity} <span className="text-sm font-normal">CY</span>
                </div>
              </div>

              {isUserListings && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {listing.status === 'ACTIVE' ? (
                      <>
                        <span className="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
                        Active
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 mr-1 bg-blue-400 rounded-full"></span>
                        Completed
                      </>
                    )}
                  </span>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <p className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <span className="font-medium">{listing.name}</span>
                    {listing.distance !== undefined && (
                      <span className="block text-xs text-gray-600">{listing.distance.toFixed(1)} miles away</span>
                    )}
                  </span>
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href={`tel:${listing.user.phone}`} className="hover:underline">
                    {formatPhoneNumber(listing.user.phone)}
                  </a>
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href={generateEmailContent(listing)} className="hover:underline truncate">
                    {listing.user.email}
                  </a>
                </p>
                <p className="flex items-center">
                  <User className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className={isUserListings ? "font-medium" : ""}>{listing.user.firstName}</span>
                </p>
              </div>

              {isUserListings && listing.status === 'ACTIVE' && (
                <div className="mt-4 flex flex-wrap justify-between gap-2 pt-4 border-t border-current border-opacity-10">
                  <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(listing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete && onDelete(listing.id)}>
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onMarkComplete && onMarkComplete(listing.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ListingList

