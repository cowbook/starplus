const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'starplus';
const COLLECTION_NAME = 'submissions';

async function cleanupData() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const today = new Date().toISOString().slice(0, 10);
    console.log(`\n📅 Today's date: ${today}`);
    
    // Count before deletion
    const countBefore = await collection.countDocuments({});
    console.log(`📊 Total records before cleanup: ${countBefore}`);
    
    // Count today's records
    const todayCount = await collection.countDocuments({
      '调查日期': today
    });
    console.log(`✓ Today's records: ${todayCount}`);
    
    // Count records to be deleted
    const toDeleteCount = countBefore - todayCount;
    console.log(`🗑️  Records to delete: ${toDeleteCount}`);
    
    if (toDeleteCount === 0) {
      console.log('\n✓ No records to delete. Database is clean!');
      return;
    }
    
    // Delete records not from today
    const result = await collection.deleteMany({
      '调查日期': { $ne: today }
    });
    
    console.log(`\n✓ Successfully deleted ${result.deletedCount} records`);
    
    // Count after deletion
    const countAfter = await collection.countDocuments({});
    console.log(`✓ Total records after cleanup: ${countAfter}`);
    
    // Show remaining records
    const remaining = await collection.find({}).toArray();
    console.log(`\n📋 Remaining records (${remaining.length} total):`);
    remaining.forEach((record, index) => {
      const name = record['姓名'] || '-';
      const date = record['调查日期'] || '-';
      console.log(`  ${index + 1}. ${name} (${date})`);
    });
    
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n✓ Connection closed');
    }
  }
}

cleanupData();
