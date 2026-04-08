import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')

    // Try to count projects
    const projectCount = await prisma.project.count()
    console.log('✅ Database connection successful!')
    console.log(`Found ${projectCount} projects`)

    // Try to create a test report
    const testReport = await prisma.report.create({
      data: {
        title: 'Test Report',
        description: 'This is a test',
        type: 'PV_VISITE',
        date: new Date(),
      },
    })
    console.log('✅ Test report created:', testReport.id)

    // Clean up
    await prisma.report.delete({
      where: { id: testReport.id },
    })
    console.log('✅ Test report deleted')

    console.log('All tests passed!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
