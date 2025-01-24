import { type Listing, MaterialType, ListingStatus } from "@/types/listing"

export async function fetchListings(activeTab: string, filters: any) {
  const queryParams = new URLSearchParams({
    status: filters.status,
    transactionType: filters.transactionType,
    material: filters.material,
    quantity: filters.quantity,
    distance: filters.distance,
  })

  const endpoint = activeTab === "my-listings" ? "/api/listings/user" : "/api/listings/nearby"
  const response = await fetch(`${endpoint}?${queryParams}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.listings
}

export async function createListing(newListing: Omit<Listing, "id" | "created_at" | "updated_at">) {
  const response = await fetch("/api/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newListing),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export async function updateListing(updatedListing: Listing) {
  const response = await fetch(`/api/listings/${updatedListing.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedListing),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export async function completeListing(listingId: string, quantityMoved: number, partnerCompany: string) {
  const response = await fetch(`/api/listings/${listingId}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantityMoved, partnerCompany }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export async function inactivateListing(listingId: string) {
  const response = await fetch(`/api/listings/${listingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "inactive" }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

