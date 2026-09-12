// ============================================================================
// Booking & Passport Shared Service — Go Thailand
// Centralized service for recording bookings, completing trips, and automatically
// unlocking visited provinces & passport stamps in MongoDB.
// Can be imported and used by internal API routes, checkout flow, or external team services.
// ============================================================================

import connectDB from '@/server/db';
import Booking, { IBooking } from '@/server/models/Booking';
import Customer from '@/server/models/Customer';
import { getProvinceByIdOrSlug } from '@/data/thailandProvinces';

export interface CompleteBookingResult {
  success: boolean;
  message: string;
  booking: IBooking;
  unlockedProvince: string;
  visitedProvinces: string[];
  pointsEarned: number;
}

/** ทำความสะอาดและแปลงชื่อ/รหัสจังหวัดให้อยู่ในรูปแบบ Slug มาตรฐาน */
export function normalizeProvince(input: string): string {
  if (!input) return 'bangkok';
  const match = getProvinceByIdOrSlug(input);
  if (match) return match.slug;
  return input.toLowerCase().trim().replace(/\s+/g, '-').replace(/[-_]province$/, '');
}

/**
 * 🌟 ฟังก์ชันหลัก: เปลี่ยนสถานะการจองเป็น "completed" (เสร็จสิ้น)
 * และปลดล็อกจังหวัดในพาสปอร์ตของผู้ใช้ใน MongoDB Atlas อัตโนมัติ
 */
export async function completeBookingAndUnlockProvince(
  bookingIdOrRef: string
): Promise<CompleteBookingResult> {
  await connectDB();

  // 1. ค้นหาเอกสารการจอง
  let booking = await Booking.findOne({
    $or: [{ _id: bookingIdOrRef.match(/^[0-9a-fA-F]{24}$/) ? bookingIdOrRef : null }, { bookingReference: bookingIdOrRef }]
  });

  if (!booking) {
    throw new Error(`ไม่พบรายการจองรหัส: ${bookingIdOrRef}`);
  }

  // 2. อัปเดตสถานะการจองเป็น completed
  booking.bookingStatus = 'completed';
  booking.paymentStatus = 'paid';
  booking.completedAt = new Date();
  await booking.save();

  const provinceSlug = normalizeProvince(booking.province);
  const pointsReward = 100; // แต้มสะสมต่อทริปที่สำเร็จ

  // 3. ปลดล็อกจังหวัดในโปรไฟล์ Customer (MongoDB Atlas)
  let updatedVisited: string[] = [];

  if (booking.userId) {
    const customer = await Customer.findOneAndUpdate(
      { _id: booking.userId },
      {
        $addToSet: { visitedProvinces: provinceSlug },
        $inc: { points: pointsReward, bookingCount: 1 }
      },
      { new: true }
    );

    if (customer && customer.visitedProvinces) {
      updatedVisited = customer.visitedProvinces;
    }
  }

  return {
    success: true,
    message: `การจอง ${booking.bookingReference} เสร็จสิ้นเรียบร้อย! ปลดล็อกแสตมป์จังหวัด ${provinceSlug} ในพาสปอร์ตแล้ว`,
    booking,
    unlockedProvince: provinceSlug,
    visitedProvinces: updatedVisited,
    pointsEarned: pointsReward
  };
}

/**
 * 📦 สร้างรายการจองใหม่ลงใน MongoDB
 * หากส่ง bookingStatus = 'completed' จะทำการปลดล็อกจังหวัดทันที
 */
export async function createBooking(data: {
  userId: string;
  item: {
    title: string;
    category?: 'tour' | 'hotel' | 'guide' | 'car' | 'package';
    location?: string;
    province: string;
    pickupDate?: string;
    returnDate?: string;
    pricePerUnit: number;
    quantity?: number;
    imageUrl?: string;
  };
  province?: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  };
  pricing?: {
    subtotal: number;
    tax?: number;
    discount?: number;
    totalAmount: number;
    currency?: string;
  };
  bookingStatus?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}) {
  await connectDB();

  const stamp = new Date();
  const y = stamp.getFullYear();
  const m = String(stamp.getMonth() + 1).padStart(2, '0');
  const d = String(stamp.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `GT${y}${m}${d}-${rand}`;

  const resolvedProvince = normalizeProvince(data.province || data.item.province || data.item.location || 'chiang-mai');

  const subtotal = data.pricing?.subtotal ?? data.item.pricePerUnit * (data.item.quantity || 1);
  const tax = data.pricing?.tax ?? Math.round(subtotal * 0.07);
  const totalAmount = data.pricing?.totalAmount ?? subtotal + tax;

  const newBooking = await Booking.create({
    bookingReference,
    userId: data.userId,
    customerInfo: data.customerInfo,
    item: {
      ...data.item,
      province: resolvedProvince,
      category: data.item.category || 'tour',
      quantity: data.item.quantity || 1
    },
    province: resolvedProvince,
    bookingStatus: data.bookingStatus || 'confirmed',
    paymentStatus: data.paymentStatus || 'paid',
    pricing: {
      subtotal,
      tax,
      discount: data.pricing?.discount || 0,
      totalAmount,
      currency: data.pricing?.currency || 'THB'
    },
    completedAt: data.bookingStatus === 'completed' ? new Date() : undefined
  });

  // หากเป็นรายการที่เสร็จสิ้นแล้ว ให้ปลดล็อกจังหวัดทันที
  if (data.bookingStatus === 'completed') {
    await completeBookingAndUnlockProvince(newBooking._id.toString());
  }

  return newBooking;
}

/** ดึงรายการจองทั้งหมดของผู้ใช้รายหนึ่ง */
export async function getUserBookings(userId: string): Promise<IBooking[]> {
  await connectDB();
  return Booking.find({ userId }).sort({ createdAt: -1 }).lean() as any;
}

/**
 * 🔄 ซิงก์ประวัติจังหวัดที่เคยไปทั้งหมดจากรายการจองสถานะ completed ของผู้ใช้
 * เพื่อให้แน่ใจว่าพาสปอร์ตกับประวัติการจองใน MongoDB ตรงกัน 100%
 */
export async function syncPassportFromBookings(userId: string): Promise<string[]> {
  await connectDB();

  const completedBookings = await Booking.find({
    userId,
    bookingStatus: 'completed'
  }).lean();

  const provinces = Array.from(
    new Set(completedBookings.map((b: any) => normalizeProvince(b.province || b.item?.province)))
  ).filter(Boolean);

  await Customer.findByIdAndUpdate(userId, {
    $set: { visitedProvinces: provinces }
  });

  return provinces;
}
