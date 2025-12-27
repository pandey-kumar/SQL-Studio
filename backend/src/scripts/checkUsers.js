require('dotenv').config();
const mongoose = require('mongoose');

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    
    // Count users
    const count = await db.collection('users').countDocuments();
    console.log(`\nTotal users in database: ${count}`);
    
    // List all users
    const users = await db.collection('users').find({}).toArray();
    console.log('\nUsers:');
    users.forEach(u => {
      console.log(` - ${u.email} (${u.name})`);
    });
    
    // Clear all users to start fresh (optional)
    if (count > 0) {
      console.log('\nClearing existing users...');
      await db.collection('users').deleteMany({});
      console.log('Users cleared');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUsers();
