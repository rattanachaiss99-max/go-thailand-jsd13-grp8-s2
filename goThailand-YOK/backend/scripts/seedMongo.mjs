/**
 * seedMongo.mjs
 * ------------------------------------------------------------
 * Seeds the mock data in backend/seed-data/*.js into MongoDB, database
 * "gothailand", one collection per data type (cars, properties, regions).
 *
 * Usage:
 *   1. cp .env.example .env   (fill in MONGODB_URI)
 *   2. npm run seed
 * ------------------------------------------------------------
 */
import "dotenv/config";
import { MongoClient } from "mongodb";
import { cars } from "../seed-data/cars.js";
import { properties } from "../seed-data/properties.js";
import { regions } from "../seed-data/regions.js";

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
};

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`Connected. Seeding database "${DB_NAME}"...`);

  try {
    // hotelCategories / hotelSpecialOptions ไม่ใช้แล้ว ลบ collection เก่าทิ้งถ้ายังหลงเหลืออยู่
    await db.collection("hotelCategories").drop().catch(() => {});
    await db.collection("hotelSpecialOptions").drop().catch(() => {});

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
