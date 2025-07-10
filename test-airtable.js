const Airtable = require('airtable');
require('dotenv').config({ path: '.env.local' });

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

async function testAirtableConnection() {
  console.log('🧪 Testing Airtable Connection...\n');

  try {
    // Test 1: Check if we can access the base
    console.log('1. Testing base access...');
    const tables = await base.tables();
    console.log('✅ Base access successful');
    console.log(`   Found ${tables.length} tables: ${tables.map(t => t.name).join(', ')}\n`);

    // Test 2: Check if Donors table exists
    console.log('2. Testing Donors table...');
    try {
      const donorsTable = base('Donors');
      const donors = await donorsTable.select({ maxRecords: 1 }).firstPage();
      console.log('✅ Donors table accessible');
      console.log(`   Found ${donors.length} donor records\n`);
    } catch (error) {
      console.log('❌ Donors table not found or inaccessible');
      console.log('   Make sure you created a table named exactly "Donors"\n');
    }

    // Test 3: Check if Donations table exists
    console.log('3. Testing Donations table...');
    try {
      const donationsTable = base('Donations');
      const donations = await donationsTable.select({ maxRecords: 1 }).firstPage();
      console.log('✅ Donations table accessible');
      console.log(`   Found ${donations.length} donation records\n`);
    } catch (error) {
      console.log('❌ Donations table not found or inaccessible');
      console.log('   Make sure you created a table named exactly "Donations"\n');
    }

    // Test 4: Try to create a test donor
    console.log('4. Testing donor creation...');
    try {
      const testDonor = await base('Donors').create([
        {
          fields: {
            'Name': 'Test Donor - Delete Me',
            'Email': 'test@example.com',
            'Status': 'Active',
            'Notes': 'Test record - can be deleted'
          }
        }
      ]);
      console.log('✅ Test donor created successfully');
      console.log(`   Donor ID: ${testDonor[0].id}\n`);

      // Clean up - delete the test donor
      await base('Donors').destroy(testDonor[0].id);
      console.log('✅ Test donor cleaned up\n');

    } catch (error) {
      console.log('❌ Failed to create test donor');
      console.log('   Error:', error.message);
      console.log('   Check your table field names match exactly\n');
    }

    console.log('🎉 Airtable connection test completed!');
    console.log('\nIf all tests passed, your Airtable is ready for the donation system.');

  } catch (error) {
    console.log('❌ Airtable connection failed');
    console.log('Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your AIRTABLE_API_KEY is correct');
    console.log('2. Your AIRTABLE_BASE_ID is correct');
    console.log('3. Your .env.local file exists');
  }
}

// Run the test
testAirtableConnection(); 