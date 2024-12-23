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
  }
}

