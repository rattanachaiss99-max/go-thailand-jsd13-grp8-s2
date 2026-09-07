// ============================================================================
// Dashboard Service — API & Business Calculation Layer for CRM
// ============================================================================

import { mockUser, mockBookings, BookingRecord, CRMUser } from '@/data/crm/mockData';

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
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return computeStats(currentUser || mockUser, mockBookings);
  }

  const res = await fetch(`/api/dashboard`);
  if (!res.ok) throw new Error('DASHBOARD_FETCH_FAILED');
  const data = await res.json();
  return data.stats;
}

export async function fetchUserBookings(): Promise<BookingRecord[]> {
  await delay(MOCK_DELAY_MS);
  return mockBookings;
}
