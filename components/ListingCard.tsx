import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Listing } from "@/types/listing"
import {
  Mountain,
  Waves,
  Shovel,
  Building,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
  ArrowDownToLine,
  ArrowUpFromLine,
  MapIcon,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

const actionLinkStyles = cn(
  "hover:text-primary flex items-center justify-center w-full sm:w-auto",
  "text-xs font-medium",
  "transition-colors duration-200",
)

interface ListingCardProps {
  listing: Listing
  onEdit?: () => void
  onComplete?: () => void
  onInactivate?: (id: string) => void
  onContact?: (id: string) => void
  isAvailableListings: boolean
  showStatus?: boolean
}

const materialIcons = {
  Topsoil: Shovel,
  "Structural Fill": Mountain,
  "Crushed Rock": Waves,
  Dirt: Shovel,
  Gravel: Mountain,
  Concrete: Building,
  Sand: Waves,
}

const contactIcons = {
  Email: Mail,
  Phone: Phone,
  Text: MessageSquare,
}

export function ListingCard({
  listing,
  onEdit,
  onComplete,
  onInactivate,
  onContact,
  isAvailableListings,
  showStatus = false,
}: ListingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isOwnListing = !isAvailableListings

  const renderContactInfo = () => {
    if (listing.user_email) {
      return (
        <div className="flex flex-col space-y-2">
          <p className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Email" />
            <span className="truncate">{listing.user_email}</span>
          </p>
          <Button size="sm" variant="outline" onClick={() => (window.location.href = `mailto:${listing.user_email}`)}>
            Send Email
          </Button>
        </div>
      )
    } else if (listing.user_phone) {
      const ContactIcon = listing.contact_preference === "Text" ? MessageSquare : Phone
      return (
        <div className="flex flex-col space-y-2">
          <p className="text-sm flex items-center gap-2">
            <ContactIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
              title={listing.contact_preference === "Text" ? "Text" : "Phone"}
            />
            <span className="truncate">{listing.user_phone}</span>
          </p>
          <Button size="sm" variant="outline" onClick={() => (window.location.href = `tel:${listing.user_phone}`)}>
            {listing.contact_preference === "Text" ? "Send Text" : "Call"}
          </Button>
        </div>
      )
    }
    return null
  }

  const MaterialIcon = materialIcons[listing.material as keyof typeof materialIcons] || Shovel

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const postedDate = new Date(listing.created_at)
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true })

  return (
    <Card className={`flex flex-col h-full ${listing.status === "completed" ? "bg-gray-50" : ""}`}>
      <CardHeader className="pb-2 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col items-start">
            <CardTitle className="flex items-center gap-2 text-base">
              <MaterialIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{listing.material}</span>
            </CardTitle>
            <div className="flex flex-col">
              <Badge variant="secondary" className="text-xs px-2 py-0.5 font-semibold">
                {listing.quantity} {listing.measurement_type}
              </Badge>
              {listing.status !== "completed" && listing.quantity_moved > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 font-semibold mt-1">
                  Moved: {listing.quantity_moved} {listing.measurement_type}
                </Badge>
              )}
            </div>
          </div>
          <Badge
            variant={listing.transaction_type === "Import" ? "secondary" : "outline"}
            className={`text-xs px-2 py-0.5 ${listing.transaction_type === "Import" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}
          >
            {listing.transaction_type === "Import" ? (
              <>
                <ArrowDownToLine className="inline-block w-3 h-3 mr-1" />
                Import
              </>
            ) : (
              <>
                <ArrowUpFromLine className="inline-block w-3 h-3 mr-1" />
                Export
              </>
            )}
          </Badge>
        </div>
        {showStatus && (
          <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getStatusColor(listing.status)}`}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-2 pt-2">
        <p className="text-sm flex items-center gap-2">
          <Building className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Site" />
          <span className="truncate">{listing.site_name}</span>
        </p>
        <p className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Address" />
          <span className="truncate">{listing.address}</span>
        </p>
        {isAvailableListings && typeof listing.distance === "number" && (
          <p className="text-sm flex items-center gap-2">
            <MapIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Distance" />
            <span>{listing.distance.toFixed(1)} miles away</span>
          </p>
        )}
        <p className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Posted" />
          <span>Posted {timeAgo}</span>
        </p>
        {listing.status === "completed" && listing.partner_company && (
          <p className="text-sm flex items-center gap-2">
            <Building className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Partner Company" />
            <span className="font-medium">Traded with:</span> {listing.partner_company}
          </p>
        )}
        {isAvailableListings && isExpanded && (
          <div className="pt-2 border-t">
            <p className="text-sm flex items-center gap-2 mb-2">
              <User className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Contact" />
              <span className="truncate">{listing.user_name}</span>
            </p>
            {renderContactInfo()}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex flex-col">
        {isOwnListing ? (
          <div className="flex flex-col sm:flex-row justify-between w-full text-xs">
            {listing.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="p-0 h-auto w-full sm:w-auto mb-2 sm:mb-0"
                onClick={onEdit}
              >
                <Link href={`/edit-listing/${listing.id}`} className={actionLinkStyles}>
                  <Edit className="h-3 w-3 mr-1" />
                  <span className="whitespace-nowrap">Edit</span>
                </Link>
              </Button>
            )}
            {listing.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="p-0 h-auto w-full sm:w-auto mb-2 sm:mb-0"
                onClick={onComplete}
              >
                <Link href={`/complete-listing/${listing.id}`} className={actionLinkStyles}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span className="whitespace-nowrap">Complete</span>
                </Link>
              </Button>
            )}
            {listing.status === "active" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="p-0 h-auto w-full sm:w-auto"
                onClick={() => onInactivate && onInactivate(listing.id)}
              >
                <Link href={`/inactivate-listing/${listing.id}`} className={actionLinkStyles}>
                  <XCircle className="h-3 w-3 mr-1" />
                  <span className="whitespace-nowrap">Inactivate</span>
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <Button className="w-full" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Hide Details" : "Show Details"}
            {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

