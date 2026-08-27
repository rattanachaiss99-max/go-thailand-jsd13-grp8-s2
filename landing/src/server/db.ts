import mongoose from 'mongoose';

// @description MongoDB connection helper (singleton) — Next.js safe (dev hot-reload).
// Connection string comes from environment variable, never hardcoded.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Throw only when a route actually needs the DB, not at import time.
  console.warn('[db] MONGODB_URI is not set. Database calls will fail until it is provided.');
}

// Reuse the existing connection across hot reloads in development.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required to connect to the database.');
  }

  if (global._mongooseConn) {
    return global._mongooseConn;
  }

  global._mongooseConn = mongoose.connect(MONGODB_URI, {
    // Mongoose 9 enables these by default; kept explicit for clarity.
    appName: 'go-thailand-landing'
  });

  return global._mongooseConn;
}

export default connectDB;
