const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateExistingUsers() {
  try {
    const usersWithoutName = await prisma.user.findMany({
      where: { name: null }
    })

    for (const user of usersWithoutName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: user.email.split('@')[0] } // Use the part before @ in email as name
      })
    }

    console.log(`Updated ${usersWithoutName.length} users`)
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateExistingUsers()

