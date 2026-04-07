async function testFetchReports() {
  try {
    const response = await fetch('http://localhost:3000/api/reports?limit=1000');
    const result = await response.json();

    console.log('📊 API Response:');
    console.log('Success:', result.success);
    console.log('Total:', result.pagination?.total);
    console.log('Data length:', result.data?.length);

    console.log('\n📄 Reports:');
    result.data.forEach((report, idx) => {
      console.log(`\n${idx + 1}. ${report.title}`);
      console.log(`   Type: ${report.type}`);
      console.log(`   Date: ${report.date}`);
      console.log(`   Description: ${report.description}`);
      console.log(`   Observations: ${report.observations}`);
    });

    // Check if types match exactly
    console.log('\n🔍 Type check:');
    const typeCounts = {};
    result.data.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    console.log('Types in database:', typeCounts);
    console.log('Expected types: PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFetchReports();
