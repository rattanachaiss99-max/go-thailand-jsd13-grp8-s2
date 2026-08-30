// ============================================================================
// Mock bookings — รูปร่างเลียนแบบ `orders` collection ตาม ORDER_MONGODB_PLAN.md
// (item / pricing / customerInfo / payment / bookingStatus)
//
// องค์ประกอบตั้งใจให้พิสูจน์ logic การกรอง ไม่ใช่แค่ array.length ผ่านเพราะโชคดี:
//   2 ใบ  confirmed + pickupDate อนาคต  → upcomingTrips = 2
//   9 ใบ  completed (อดีต)              → นับใน total
//   1 ใบ  confirmed แต่ pickupDate อดีต → นับใน total, ไม่นับ upcoming
//   1 ใบ  cancelled                     → ไม่นับทั้งคู่
//   รวม 13 document → totalBookings = 12
// ============================================================================

import { MOCK_USER_ID } from './currentUser.js';

/** วันที่แบบ relative เพื่อให้ "ทริปที่จะถึง" ยังเป็นอนาคตเสมอ ไม่หมดอายุตามเวลาจริง */
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
};

const order = ({
  ref,
  status,
  title,
  category,
  pickupOffset,
  days,
  pricePerDay,
  pickupLocation,
  paymentStatus = 'paid'
}) => {
  const subtotal = pricePerDay * days;
  const tax = Math.round(subtotal * 0.07);
  return {
    _id: `66ce7890f1a2b3c4d5e6${ref.slice(-4)}`,
    bookingReference: ref,
    userId: MOCK_USER_ID,
    item: {
      category,
      title,
      image: `/images/${category}/${ref.toLowerCase()}.png`,
      pickupLocation,
      dropoffLocation: pickupLocation,
      pickupDate: daysFromNow(pickupOffset),
      returnDate: daysFromNow(pickupOffset + days),
      pricePerDay,
      totalDays: days
    },
    pricing: {
      subtotal,
      tax,
      discount: 0,
      totalAmount: subtotal + tax,
      currency: 'THB'
    },
    customerInfo: {
      fullName: 'Somchai Jaidee',
      email: 'somchai@example.com',
      phone: '081-234-5678'
    },
    payment: {
      status: paymentStatus,
      method: 'credit_card',
      transactionId: `TXN-${ref.slice(-8)}`
    },
    bookingStatus: status,
    createdAt: daysFromNow(pickupOffset - 30),
    updatedAt: daysFromNow(pickupOffset - 30)
  };
};

export const mockBookings = [
  // --- 2 ใบนี้คือ UPCOMING TRIPS ---
  order({
    ref: 'GT-CR-2026-00128',
    status: 'confirmed',
    title: 'Toyota Fortuner 2.8 V 4WD',
    category: 'car_rental',
    pickupOffset: 12,
    days: 4,
    pricePerDay: 2500,
    pickupLocation: 'Suvarnabhumi Airport (BKK)'
  }),
  order({
    ref: 'GT-TR-2026-00131',
    status: 'confirmed',
    title: 'Chiang Mai Doi Inthanon Day Tour',
    category: 'tour',
    pickupOffset: 34,
    days: 1,
    pricePerDay: 1800,
    pickupLocation: 'Chiang Mai Old City'
  }),

  // --- confirmed แต่วันรับรถผ่านไปแล้ว: นับใน total ไม่นับ upcoming ---
  order({
    ref: 'GT-CR-2026-00119',
    status: 'confirmed',
    title: 'Honda City 1.0 Turbo',
    category: 'car_rental',
    pickupOffset: -9,
    days: 3,
    pricePerDay: 1200,
    pickupLocation: 'Don Mueang Airport (DMK)'
  }),

  // --- cancelled: ต้องไม่ถูกนับเลย ---
  order({
    ref: 'GT-HT-2026-00104',
    status: 'cancelled',
    title: 'Phuket Beachfront Villa (2 nights)',
    category: 'hotel',
    pickupOffset: -60,
    days: 2,
    pricePerDay: 5400,
    pickupLocation: 'Kata Beach, Phuket',
    paymentStatus: 'refunded'
  }),

  // --- 9 ใบที่เดินทางจบแล้ว ---
  order({
    ref: 'GT-TR-2026-00098',
    status: 'completed',
    title: 'Ayutthaya Heritage Cycling Tour',
    category: 'tour',
    pickupOffset: -75,
    days: 1,
    pricePerDay: 1450,
    pickupLocation: 'Ayutthaya Historical Park'
  }),
  order({
    ref: 'GT-HT-2026-00091',
    status: 'completed',
    title: 'Bangkok Riverside Hotel (3 nights)',
    category: 'hotel',
    pickupOffset: -96,
    days: 3,
    pricePerDay: 3200,
    pickupLocation: 'Charoen Krung, Bangkok'
  }),
  order({
    ref: 'GT-CR-2026-00087',
    status: 'completed',
    title: 'Isuzu MU-X 4WD',
    category: 'car_rental',
    pickupOffset: -110,
    days: 5,
    pricePerDay: 2300,
    pickupLocation: 'Krabi Airport (KBV)'
  }),
  order({
    ref: 'GT-TR-2026-00079',
    status: 'completed',
    title: 'Phi Phi Islands Speedboat',
    category: 'tour',
    pickupOffset: -128,
    days: 1,
    pricePerDay: 2100,
    pickupLocation: 'Rassada Pier, Phuket'
  }),
  order({
    ref: 'GT-HT-2026-00072',
    status: 'completed',
    title: 'Khao Yai Mountain Resort (2 nights)',
    category: 'hotel',
    pickupOffset: -150,
    days: 2,
    pricePerDay: 2800,
    pickupLocation: 'Pak Chong, Nakhon Ratchasima'
  }),
  order({
    ref: 'GT-CR-2026-00065',
    status: 'completed',
    title: 'Toyota Yaris Ativ',
    category: 'car_rental',
    pickupOffset: -172,
    days: 2,
    pricePerDay: 1100,
    pickupLocation: 'Chiang Mai Airport (CNX)'
  }),
  order({
    ref: 'GT-TR-2026-00058',
    status: 'completed',
    title: 'Erawan Falls Nature Trek',
    category: 'tour',
    pickupOffset: -195,
    days: 1,
    pricePerDay: 1600,
    pickupLocation: 'Kanchanaburi'
  }),
  order({
    ref: 'GT-HT-2026-00046',
    status: 'completed',
    title: 'Railay Beach Cliff Lodge (2 nights)',
    category: 'hotel',
    pickupOffset: -220,
    days: 2,
    pricePerDay: 3900,
    pickupLocation: 'Railay, Krabi'
  }),
  order({
    ref: 'GT-TR-2026-00033',
    status: 'completed',
    title: 'Bangkok Street Food Night Walk',
    category: 'tour',
    pickupOffset: -240,
    days: 1,
    pricePerDay: 950,
    pickupLocation: 'Yaowarat, Bangkok'
  })
];

export default mockBookings;
