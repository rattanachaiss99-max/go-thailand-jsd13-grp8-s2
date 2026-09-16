/**
 * server/index.js
 * ------------------------------------------------------------
 * REST API for the catalog data seeded into MongoDB (database
 * "gothailand") by scripts/seedMongo.mjs, plus real booking
 * endpoints (POST /api/bookings, GET /api/bookings/:ref) that
 * persist bookings into the `bookings`/`booking_items`
 * collections instead of only keeping them in frontend memory.
 *
 * Usage:
 *   1. cp .env.example .env   (fill in MONGODB_URI, run `npm run seed` once)
 *   2. npm run server
 * ------------------------------------------------------------
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { getDb } from "./db.js";
import {
  buildCarItem,
  buildAccommodationItem,
  buildOrderHeader,
  generateOrderRef,
} from "./bookingBuilder.js";

const PORT = process.env.API_PORT || 5050;

const app = express();
app.use(cors());
app.use(express.json());

/** ค้นหา document จาก `_id` (number) หรือ `id` (string slug) */
function idMatchQuery(rawId) {
  const asNumber = Number(rawId);
  const orClauses = [{ id: rawId }];
  if (!Number.isNaN(asNumber)) {
    orClauses.push({ _id: asNumber });
  }
  return { $or: orClauses };
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/cars", async (_req, res, next) => {
  try {
    const db = await getDb();
    const cars = await db.collection("cars").find({}).sort({ _id: 1 }).toArray();
    res.json(cars);
  } catch (err) {
    next(err);
  }
});

app.get("/api/cars/:id", async (req, res, next) => {
  try {
    const db = await getDb();
    const car = await db.collection("cars").findOne(idMatchQuery(req.params.id));
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    next(err);
  }
});

app.get("/api/properties", async (_req, res, next) => {
  try {
    const db = await getDb();
    const properties = await db
      .collection("properties")
      .find({})
      .sort({ _id: 1 })
      .toArray();
    res.json(properties);
  } catch (err) {
    next(err);
  }
});

app.get("/api/properties/:id", async (req, res, next) => {
  try {
    const db = await getDb();
    const property = await db
      .collection("properties")
      .findOne(idMatchQuery(req.params.id));
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    next(err);
  }
});

app.get("/api/regions", async (_req, res, next) => {
  try {
    const db = await getDb();
    const regions = await db.collection("regions").find({}).toArray();
    res.json(regions);
  } catch (err) {
    next(err);
  }
});

app.get("/api/masters", async (_req, res, next) => {
  try {
    const db = await getDb();
    const hotelSpecialOptions = await db.collection("hotelSpecialOptions").find({}).toArray();
    res.json({ hotelSpecialOptions });
  } catch (err) {
    next(err);
  }
});

/**
 * สร้างการจองจริง: รับตะกร้าที่อาจมีทั้งรถและที่พักพร้อมกัน (`cart.car`
 * และ/หรือ `cart.accommodation`) ค้นรถ/ที่พักจาก MongoDB สดๆ (ไม่เชื่อ
 * ราคาที่ client ส่งมา) คำนวณราคาแต่ละรายการเอง แล้วรวมเป็น order
 * เดียวที่มี booking_items ได้มากกว่า 1 ชิ้น บันทึกลง MongoDB จริง
 */
app.post("/api/bookings", async (req, res, next) => {
  try {
    const body = req.body || {};
    const { cart, customerInfo } = body;

    if (!customerInfo || !customerInfo.fullName || !customerInfo.email) {
      return res.status(400).json({ error: "Missing customer information" });
    }
    if (!cart || (!cart.car && !cart.accommodation)) {
      return res.status(400).json({ error: "Cart is empty — nothing to book" });
    }

    const db = await getDb();
    const orderId = Math.floor(100 + Math.random() * 900);
    const ref = generateOrderRef();

    const items = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (cart.car) {
      const car = await db.collection("cars").findOne(idMatchQuery(String(cart.car.carId)));
      if (!car) return res.status(404).json({ error: "Car not found" });
      const itemId = Math.floor(70000 + Math.random() * 20000);
      const built = buildCarItem({ cartCar: cart.car, customerInfo, car, orderId, ref, itemId });
      items.push(built.item);
      subtotal += built.subtotal;
      tax += built.tax;
      total += built.total;
    }

    if (cart.accommodation) {
      const property = await db
        .collection("properties")
        .findOne(idMatchQuery(String(cart.accommodation.propertyId)));
      if (!property) return res.status(404).json({ error: "Property not found" });
      const room =
        property.rooms?.find((r) => r.room_type_id === cart.accommodation.roomTypeId) ||
        property.rooms?.[0];
      if (!room) return res.status(400).json({ error: "Property has no rooms configured" });
      const itemId = Math.floor(90000 + Math.random() * 20000);
      const built = buildAccommodationItem({
        cartAccommodation: cart.accommodation,
        customerInfo,
        property,
        room,
        orderId,
        ref,
        itemId,
      });
      items.push(built.item);
      subtotal += built.subtotal;
      tax += built.tax;
      total += built.total;
    }

    const order = buildOrderHeader({ orderId, ref, customerInfo, subtotal, tax, total });

    await db.collection("bookings").insertOne(order);
    await db.collection("booking_items").insertMany(items);

    res.status(201).json({ order, items, ref });
  } catch (err) {
    next(err);
  }
});

/**
 * ดึงการจองที่บันทึกไว้แล้วกลับมาด้วยเลขที่การจอง (booking_ref) — คืน
 * ทุก item ที่ผูกกับ ref นี้ (อาจมีมากกว่า 1 ถ้าจองหลายประเภทพร้อมกัน)
 * ใช้แสดงในหน้า BookingSuccess
 */
app.get("/api/bookings/:ref", async (req, res, next) => {
  try {
    const db = await getDb();
    const order = await db.collection("bookings").findOne({ booking_ref: req.params.ref });
    if (!order) return res.status(404).json({ error: "Booking not found" });
    const items = await db
      .collection("booking_items")
      .find({ booking_reference: req.params.ref })
      .toArray();
    res.json({ order, items });
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`GoThailand API listening on http://localhost:${PORT}`);
});
