import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  } catch (error) {
    return `[Unserializable object: ${error instanceof Error ? error.message : String(error)}]`;
  }
}

export async function POST(req: Request) {
  console.log('Received signup request')
  try {
    const body = await req.json()
    console.log('Request body:', safeStringify(body))

    const { firstName, lastName, email, password, company, role, zipCode, phone } = body

    if (!firstName || !lastName || !email || !password || !company || !role || zipCode === undefined || !phone) {
      console.log('Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const zipCodeInt = parseInt(zipCode, 10)

    if (isNaN(zipCodeInt)) {
      console.log('Invalid zip code')
      return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 })
    }

    console.log('Checking if user exists')
    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (exists) {
      console.log('User already exists')
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    console.log('Hashing password')
    const hashedPassword = await hash(password, 10)

    console.log('Creating user')
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        company,
        role,
        zipCode: zipCodeInt,
        phone,
      },
    })

    console.log('User created successfully:', safeStringify(user))
    return NextResponse.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }, { status: 201 })
  } catch (error) {
    console.log('Signup error:', safeStringify(error))
    console.log('Error type:', typeof error)
    console.log('Is Error instance:', error instanceof Error)
    
    if (error instanceof Error) {
      console.log('Error name:', error.name)
      console.log('Error message:', error.message)
      console.log('Error stack:', error.stack)
    }

    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details available'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

