<<<<<<< HEAD
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quantity_moved, partner_company } = await request.json()
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the complete_listing function
    const { data, error } = await supabase.rpc("complete_listing", {
      p_listing_id: id,
      p_quantity_moved: quantity_moved,
      p_partner_company: partner_company,
    })

    if (error) {
      console.error("Error in complete_listing function:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
=======
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const id = params.id

  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const id = params.id

  try {
    const body = await req.json()
    const { type, quantity, latitude, longitude, address, isAvailable } = body

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const updatedListing = await prisma.listing.update({
      where: {
        id: id,
      },
      data: {
        type,
        quantity,
        latitude,
        longitude,
        address,
        isAvailable,
      },
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

    return NextResponse.json({ listing: updatedListing })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const id = params.id

  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.listing.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// New route for marking a listing as complete
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const id = params.id

  try {
    const body = await req.json()
    const { status } = body

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const updatedListing = await prisma.listing.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        isAvailable: status === 'ACTIVE',
      },
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

    return NextResponse.json({ listing: updatedListing })
  } catch (error) {
    console.error('Error updating listing status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
  }
}

