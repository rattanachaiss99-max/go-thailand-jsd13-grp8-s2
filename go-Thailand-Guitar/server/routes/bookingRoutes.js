import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// บันทึกการจองใหม่ (เชื่อมกับ CarCheckout.jsx)
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'บันทึกการจองสำเร็จ', booking: savedBooking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ดึงรายการจองทั้งหมด (เพื่อให้เพื่อนคนอื่นในทีมดึงไปทำ Dashboard หรือแสดงประวัติได้)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;