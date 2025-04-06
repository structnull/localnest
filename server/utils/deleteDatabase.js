require('dotenv').config(); // Load .env before anything else
const mongoose = require('mongoose');

// MongoDB connection function
const connectWithDB = async () => {
  mongoose.set('strictQuery', false);

  if (!process.env.DB_URL) {
    console.error('❌ DB_URL is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ DB connected successfully');
  } catch (err) {
    console.error('❌ DB connection failed');
    console.error(err);
    process.exit(1);
  }
};

// Main function to delete all collections
const deleteDatabase = async () => {
  try {
    console.log('🔌 Connecting to the database...');
    await connectWithDB();

    await mongoose.connection.asPromise(); // Ensures connection is ready
    console.log('📦 Connected. Fetching collections...');

    const collections = await mongoose.connection.db.collections();

    if (collections.length === 0) {
      console.log('✅ No collections found. Database is already empty.');
    } else {
      for (const collection of collections) {
        await collection.drop();
        console.log(`🗑️ Dropped collection: ${collection.collectionName}`);
      }
      console.log('✅ All collections have been deleted.');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from the database.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting the database:', error);
    process.exit(1);
  }
};

// Execute if run directly
deleteDatabase();
