const mongoose = require('mongoose');

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ [User-Service] Connected to MongoDB Atlas: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ [User-Service] MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
