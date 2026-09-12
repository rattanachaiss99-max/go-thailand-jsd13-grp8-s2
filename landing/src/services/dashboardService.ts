// ============================================================================
// Dashboard Service — API & Business Calculation Layer for CRM
// ============================================================================

import { mockUser, mockBookings, BookingRecord, CRMUser } from '@/data/crm/mockData';
import { fetchExternalCarBookings } from './carBookingService';

export interface DashboardStatsData {
  upcomingTrips: number;
  totalBookings: number;
  rewardsPoints: number;
  savedPlaces: number;
}

const USE_MOCK = true;
const MOCK_DELAY_MS = 250;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ตรวจสอบว่า order เป็นทริปที่ยืนยันแล้วและยังไม่ถึงวันเดินทาง */
export const isUpcoming = (booking: BookingRecord, now = new Date()) =>
  booking.bookingStatus === 'confirmed' && new Date(booking.item.pickupDate) > now;

/** ตรวจสอบว่า order นับเป็นยอดจองที่สำเร็จ (ยกเลิกแล้วไม่นับ) */
export const isCounted = (booking: BookingRecord) => booking.bookingStatus !== 'cancelled';

export function computeStats(
  user: Partial<CRMUser> | null,
  bookings: BookingRecord[],
  now = new Date()
): DashboardStatsData {
  return {
    upcomingTrips: bookings.filter((b) => isUpcoming(b, now)).length,
    totalBookings: bookings.filter(isCounted).length,
    rewardsPoints: user?.points ?? mockUser.points,
    savedPlaces: user?.wishlist?.length ?? mockUser.wishlist.length
  };
}

export async function fetchDashboardStats(
  currentUser?: Partial<CRMUser> | null
): Promise<DashboardStatsData> {
  const allBookings = await fetchUserBookings(currentUser?.email);
  return computeStats(currentUser || mockUser, allBookings);
}

export async function fetchUserBookings(userEmail?: string): Promise<BookingRecord[]> {
  await delay(MOCK_DELAY_MS);
  
  // เรียกอ่านข้อมูลการจองรถจริงจาก Car-Service (Read-Only)
  const externalCars = await fetchExternalCarBookings(userEmail);
  if (externalCars.length > 0) {
    return [...externalCars, ...mockBookings];
  }

  return mockBookings;
}

