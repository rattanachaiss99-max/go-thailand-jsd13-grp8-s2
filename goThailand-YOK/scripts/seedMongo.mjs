/**
 * seedMongo.mjs
 * ------------------------------------------------------------
 * Seeds the mock data in src/data/*.js into MongoDB, database
 * "gothailand", one collection per data type (cars, properties,
 * regions, hotelCategories, hotelSpecialOptions).
 *
 * Usage:
 *   1. cp .env.example .env   (fill in MONGODB_URI)
 *   2. npm run seed
 * ------------------------------------------------------------
 */
import "dotenv/config";
import { MongoClient } from "mongodb";
import { cars } from "../src/data/cars.js";
import { properties } from "../src/data/properties.js";
import { regions } from "../src/data/regions.js";
import { hotelCategories, hotelSpecialOptions } from "../src/data/masters.js";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "gothailand";

if (!MONGODB_URI) {
  console.error(
    "Missing MONGODB_URI. Copy .env.example to .env and fill in your MongoDB connection string."
  );
  process.exit(1);
}

const collections = {
  cars,
  properties,
  regions,
  hotelCategories,
  hotelSpecialOptions,
};

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`Connected. Seeding database "${DB_NAME}"...`);

  try {
    for (const [name, docs] of Object.entries(collections)) {
      const collection = db.collection(name);
      await collection.deleteMany({});
      if (docs.length > 0) {
        await collection.insertMany(docs);
      }
      console.log(`  ${name}: ${docs.length} documents`);
    }
    console.log("Seed complete.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
