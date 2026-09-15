/**
 * db.js
 * ------------------------------------------------------------
 * Singleton MongoDB connection shared by all API routes.
 * ------------------------------------------------------------
 */
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "gothailand";

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI. Copy .env.example to .env and fill in your MongoDB connection string."
  );
}

const client = new MongoClient(MONGODB_URI);
let dbPromise = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => client.db(DB_NAME));
  }
  return dbPromise;
}
