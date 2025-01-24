<<<<<<< HEAD
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.from("listings").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching listing:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

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
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
  }
}

