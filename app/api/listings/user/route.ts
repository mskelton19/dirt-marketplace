import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const material = url.searchParams.get('material')
  const quantity = url.searchParams.get('quantity')

  try {
    let whereClause: any = {
      userId: session.user.id
    }

    if (status && status !== 'all') {
      whereClause.status = status
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

    const userListings = await prisma.listing.findMany({
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

    return NextResponse.json({ listings: userListings })
  } catch (error) {
    console.error('Error fetching user listings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

