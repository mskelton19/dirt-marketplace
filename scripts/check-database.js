const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Example: Get all users
  const users = await prisma.user.findMany()
  console.log('All users:', users)

  // Example: Get all listings
  const listings = await prisma.listing.findMany()
  console.log('All listings:', listings)

  // Example: Get a specific user by email
  const user = await prisma.user.findUnique({
    where: { email: 'example@email.com' },
  })
  console.log('Specific user:', user)

  // Example: Get listings with their associated users
  const listingsWithUsers = await prisma.listing.findMany({
    include: { user: true },
  })
  console.log('Listings with users:', listingsWithUsers)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

