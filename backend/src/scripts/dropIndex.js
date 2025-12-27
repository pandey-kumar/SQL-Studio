require('dotenv').config();
const mongoose = require('mongoose');

async function dropIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    
    // Drop the problematic googleId index
    try {
      await db.collection('users').dropIndex('googleId_1');
      console.log('✅ googleId_1 index dropped successfully');
    } catch (e) {
      console.log('Index not found or already dropped:', e.message);
    }
    
    // List remaining indexes
    const indexes = await db.collection('users').indexes();
    console.log('\nRemaining indexes on users collection:');
    indexes.forEach(idx => console.log(' -', idx.name));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

dropIndex();
