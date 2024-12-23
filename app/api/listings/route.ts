import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req: Request) {
  console.log('POST /api/listings - Start')
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session)

    if (!session?.user?.id) {
      console.log('Not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
      console.log('Request body:', body)
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'JSON parse error'
      }, { status: 400 })
    }

    if (!body) {
      console.log('Empty request body')
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    const { name, material, quantity, latitude, longitude, address } = body

    // Validate required fields
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!material) missingFields.push('material')
    if (quantity === undefined) missingFields.push('quantity')
    if (latitude === undefined) missingFields.push('latitude')
    if (longitude === undefined) missingFields.push('longitude')
    if (!address) missingFields.push('address')

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      return NextResponse.json({
        error: 'Missing required fields',
        details: missingFields
      }, { status: 400 })
    }

    try {
      console.log('Creating listing in database with data:', {
        name,
        type: material,
        quantity: parseFloat(quantity),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        userId: session.user.id
      })

      const listing = await prisma.listing.create({
        data: {
          name,
          type: material,
          quantity: parseFloat(quantity),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address,
          isAvailable: true,
          userId: session.user.id,
          condition: 'New',
          status: 'ACTIVE'
        },
      })

      console.log('Listing created successfully:', listing)
      return NextResponse.json({ listing }, { status: 201 })
    } catch (dbError) {
      console.error('Database error:', dbError instanceof Error ? dbError.message : 'Unknown database error')
      return NextResponse.json({ 
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('POST /api/listings Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ 
      error: 'Failed to create listing',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

