// ============================================================================
// Car Booking Service — Consumer & Adapter for Car Rental Microservice
// Reads car bookings from external car-service without modifying its database
// Clean production mode: returns empty array if service is offline or has no data
// ============================================================================

import { BookingRecord } from '@/data/crm/mockData';

const CAR_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_CAR_SERVICE_URL || 'http://localhost:5002';

/**
 * Adapter แปลงข้อมูลจาก CarBooking (จาก Render Webservice หรือ Guitar Server)
 * ให้ตรงตามโครงสร้าง BookingRecord ของ Landing Dashboard
 */
export function mapCarBookingToRecord(item: any): BookingRecord {
  const ref = item.bookingReference || `GT-CR-${(item._id || '').slice(-6).toUpperCase() || '888888'}`;
  
  return {
    _id: item._id || ref,
    bookingReference: ref,
    userId: item.userId || item.email || 'guest-car-user',
    bookingStatus: item.status || 'confirmed',
    paymentStatus: 'paid',
    item: {
      category: 'car',
      title: item.carName || 'รถเช่าพร้อมคนขับ',
      image: item.carImage || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      pickupLocation: item.pickupReturn || 'สนามบินสุวรรณภูมิ (BKK)',
      dropoffLocation: item.pickupReturn || 'สนามบินสุวรรณภูมิ (BKK)',
      pickupDate: item.dates || item.createdAt || new Date().toISOString(),
      returnDate: item.returnDate || '',
      pricePerDay: item.rentalPrice ? Math.round(item.rentalPrice / 3) : 2500,
      totalDays: 3
    },
    pricing: {
      subtotal: item.rentalPrice || item.totalPrice || 7500,
      tax: item.serviceFee || 0,
      discount: 0,
      totalAmount: item.totalPrice || 7500,
      currency: 'THB'
    },
    customerInfo: {
      fullName: item.fullName || item.driverName || 'ผู้เช่ารถ',
      email: item.email || '',
      phone: item.phone || ''
    },
    rawCarBooking: {
      ...item,
      // Mask หมายเลขบัตรเครดิตเพื่อความปลอดภัย
      cardNumber: item.cardNumber ? `**** **** **** ${item.cardNumber.replace(/\s+/g, '').slice(-4) || '0000'}` : item.maskedCardNumber
    }
  };
}

/**
 * ดึงรายการจองรถจริงจาก Car Webservice (Read-Only)
 * หากติดต่อไม่ได้ หรือยังไม่มีข้อมูล จะคืนค่า Array ว่าง `[]`
 * เพื่อให้หน้า Dashboard แสดงผลข้อความ "ไม่มีข้อมูลรถเช่า" อย่างถูกต้องตามความเป็นจริง
 */
export async function fetchExternalCarBookings(userEmail?: string): Promise<BookingRecord[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout 3s

    let url = `${CAR_SERVICE_BASE_URL}/api/bookings`;
    if (userEmail) {
      url += `?email=${encodeURIComponent(userEmail)}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.info(`[CarBookingService] Car service returned status ${res.status}. No car bookings loaded.`);
      return [];
    }

    const result = await res.json();
    const rawList = Array.isArray(result) ? result : result.data || [];

    if (rawList.length > 0) {
      return rawList.map(mapCarBookingToRecord);
    }

    return [];
  } catch (error: any) {
    // กรณีติดต่อ Endpoint ไม่ได้ (Server ยังไม่รัน / Render ยังไม่ขึ้น) คืนค่า []
    console.info('[CarBookingService] Car service offline or unreachable. No car bookings loaded.');
    return [];
  }
}
