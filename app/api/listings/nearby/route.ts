import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'
import { calculateDistance, getZipCodeCoordinates } from '@/lib/utils'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const distance = url.searchParams.get('distance')
  const material = url.searchParams.get('material')
  const quantity = url.searchParams.get('quantity')

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { zipCode: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userCoordinates = await getZipCodeCoordinates(user.zipCode)
    if (!userCoordinates) {
      return NextResponse.json({ error: 'Invalid user zip code' }, { status: 400 })
    }

    let whereClause: any = {
      userId: { not: session.user.id },
      status: status === 'ACTIVE' ? 'ACTIVE' : undefined
    }

    if (material && material !== 'all') {
      whereClause.type = material
    }

    if (quantity && quantity !== 'all') {
      const [min, max] = quantity.split('-').map(Number)
      if (max) {
        whereClause.quantity = { gte: min, lte: max }
      } else {
        whereClause.quantity = { gte: min }
      }
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const listingsWithDistance = listings.map(listing => {
      const listingDistance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        listing.latitude,
        listing.longitude
      )
      return {
        ...listing,
        distance: listingDistance
      }
    })

    let filteredListings = listingsWithDistance

    if (distance && distance !== 'all') {
      const maxDistance = parseInt(distance)
      filteredListings = filteredListings.filter(listing => listing.distance <= maxDistance)
    }

    return NextResponse.json({ listings: filteredListings })
  } catch (error) {
    console.error('Error fetching nearby listings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

