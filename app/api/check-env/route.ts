import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'Not set'
  })
}

