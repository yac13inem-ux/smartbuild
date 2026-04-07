import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCreateReport() {
  try {
    console.log('🔍 Checking existing reports...');
    const existingReports = await prisma.report.findMany();
    console.log(`Found ${existingReports.length} reports`);
    existingReports.forEach(r => {
      console.log(`  - ${r.title} (${r.type}) - ${new Date(r.date).toISOString()}`);
    });

    console.log('\n➕ Creating a test report...');
    const newReport = await prisma.report.create({
      data: {
        title: 'Test PV Visit',
        type: 'PV_VISITE',
        description: 'Test description',
        observations: 'Test observations',
        date: new Date(),
      },
    });

    console.log('✅ Report created successfully:');
    console.log(`  ID: ${newReport.id}`);
    console.log(`  Title: ${newReport.title}`);
    console.log(`  Type: ${newReport.type}`);
    console.log(`  Date: ${new Date(newReport.date).toISOString()}`);

    console.log('\n🔍 Fetching all reports after creation...');
    const allReports = await prisma.report.findMany();
    console.log(`Total reports: ${allReports.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateReport();
