import React, { useState } from "react"
import type { Listing } from "@/types/listing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Edit,
  CheckCircle,
  XCircle,
  Mountain,
  Waves,
  Shovel,
  Building,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ListViewItemProps {
  listing: Listing
  onEdit?: (listing: Listing) => void
  onComplete?: (listing: Listing) => void
  onInactivate?: (id: string) => void
  isAvailableListings: boolean
}

export function ListViewItem({ listing, onEdit, onComplete, onInactivate, isAvailableListings }: ListViewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isOwnListing = !isAvailableListings

  const getMaterialIcon = (material: string) => {
    switch (material) {
      case "Topsoil":
        return <Shovel className="h-5 w-5 mr-2" />
      case "Structural Fill":
        return <Mountain className="h-5 w-5 mr-2" />
      case "Crushed Rock":
        return <Waves className="h-5 w-5 mr-2" />
      default:
        return <Building className="h-5 w-5 mr-2" />
    }
  }

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`flex flex-col p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-in-out relative ${listing.status === "completed" ? "bg-gray-50" : ""}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-2 sm:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center">
              {getMaterialIcon(listing.material)}
              <h3 className="font-semibold text-lg">{listing.material}</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {listing.quantity} {listing.measurement_type}
            </Badge>
            {listing.status !== "completed" && listing.quantity_moved > 0 && (
              <Badge variant="outline" className="text-xs ml-2">
                Moved: {listing.quantity_moved} {listing.measurement_type}
              </Badge>
            )}
            <Badge
              variant={listing.transaction_type === "Import" ? "secondary" : "outline"}
              className={`text-xs ${listing.transaction_type === "Import" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}
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
            <Badge variant="outline" className={`text-xs ${getStatusColor(listing.status)}`}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {listing.site_name} - {listing.address}
          </p>
          {listing.status === "completed" && listing.partner_company && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Building className="h-4 w-4 flex-shrink-0" aria-hidden="true" title="Partner Company" />
              <span>Traded with: {listing.partner_company}</span>
            </p>
          )}
          {isAvailableListings && typeof listing.distance === "number" && (
            <p className="text-sm text-muted-foreground mt-1">{listing.distance.toFixed(1)} miles away</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end mt-2 sm:mt-0">
          {isOwnListing ? (
            <>
              {listing.status !== "completed" && (
                <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(listing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {listing.status !== "completed" && (
                <Button variant="outline" size="sm" onClick={() => onComplete && onComplete(listing)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
              {listing.status === "active" && (
                <Button variant="outline" size="sm" onClick={() => onInactivate && onInactivate(listing.id)}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Inactivate
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpand}
              className="text-primary hover:text-primary-dark focus:outline-none transition-colors duration-200"
            >
              {isExpanded ? (
                <>
                  Hide Details
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Show Details
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-2 text-sm">
          {/* <p><strong>Description:</strong> {listing.description || 'No description provided.'}</p> */}
          <p>
            <strong>Posted:</strong> {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
          </p>
          {/* {listing.quantity_moved > 0 && (
            <p><strong>Quantity Moved:</strong> {listing.quantity_moved} {listing.measurement_type}</p>
          )} */}
          {listing.partner_company && (
            <p>
              <strong>Partner Company:</strong> {listing.partner_company}
            </p>
          )}
          {listing.zip_code && (
            <p>
              <strong>Zip Code:</strong> {listing.zip_code}
            </p>
          )}
          {isAvailableListings && (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Contact:</strong> {listing.user_name}
              </p>
              <p>
                <strong>Company:</strong> {listing.company_name || "Not specified"}
              </p>
              <div className="flex gap-2 mt-2">
                {listing.user_phone && (
                  <Button
                    size="sm"
                    onClick={() => (window.location.href = `tel:${listing.user_phone.replace(/\D/g, "")}`)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                )}
                {listing.user_email && (
                  <Button size="sm" onClick={() => (window.location.href = `mailto:${listing.user_email}`)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

