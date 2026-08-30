// ============================================================================
// Dashboard service — จุดเดียวที่รู้ว่าข้อมูลมาจาก mock หรือ API จริง
//
// component/hook ห้าม import ไฟล์ใน src/mock/ โดยตรง ต้องผ่านที่นี่เท่านั้น
// ตอน backend พร้อม: เปลี่ยน USE_MOCK เป็น false — component ไม่ต้องแก้เลย
// ============================================================================

import { mockUser, MOCK_USER_ID } from '../mock/currentUser.js';
import { mockBookings } from '../mock/bookings.js';
import { mockPlaces } from '../mock/places.js';

/** สลับเป็น false เมื่อ GET /api/dashboard/:userId พร้อมใช้ */
const USE_MOCK = true;

/** userId ชั่วคราว — ของจริงจะมาจากระบบ login ในโฟลเดอร์ `landing` */
export const CURRENT_USER_ID = MOCK_USER_ID;

const MOCK_DELAY_MS = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Logic เดียวกับที่ backend จะทำด้วย aggregation $facet
// ---------------------------------------------------------------------------

/** order ที่ยืนยันแล้วและยังไม่ถึงวันเดินทาง */
export const isUpcoming = (booking, now = new Date()) =>
  booking.bookingStatus === 'confirmed' && new Date(booking.item.pickupDate) > now;

/** order ที่นับเป็นยอดจองจริง (ยกเลิกแล้วไม่นับ) */
export const isCounted = (booking) => booking.bookingStatus !== 'cancelled';

export function computeStats(user, bookings, now = new Date()) {
  return {
    upcomingTrips: bookings.filter((b) => isUpcoming(b, now)).length,
    totalBookings: bookings.filter(isCounted).length,
    rewardsPoints: user?.points ?? 0,
    savedPlaces: user?.wishlist?.length ?? 0
  };
}

// ---------------------------------------------------------------------------
// Public API — ทุกตัวเป็น async เพื่อให้ loading/error path เหมือนของจริง
// ---------------------------------------------------------------------------

export async function fetchDashboardStats(userId = CURRENT_USER_ID) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return computeStats(mockUser, mockBookings);
  }

  const res = await fetch(`/api/dashboard/${userId}`);
  if (!res.ok) throw new Error('DASHBOARD_FETCH_FAILED');
  const data = await res.json();
  return data.stats;
}

export async function fetchCurrentUser(userId = CURRENT_USER_ID) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const { firstName, lastName, membershipTier, avatarUrl, email } = mockUser;
    return { firstName, lastName, membershipTier, avatarUrl, email };
  }

  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error('USER_FETCH_FAILED');
  return (await res.json()).user;
}

export async function fetchUpcomingTrips(userId = CURRENT_USER_ID) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const now = new Date();
    return mockBookings
      .filter((b) => isUpcoming(b, now))
      .sort((a, b) => new Date(a.item.pickupDate) - new Date(b.item.pickupDate));
  }

  const res = await fetch(`/api/trips/${userId}?filter=upcoming`);
  if (!res.ok) throw new Error('TRIPS_FETCH_FAILED');
  return (await res.json()).trips;
}

export async function fetchSavedPlaces(userId = CURRENT_USER_ID) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    // join: wishlist (placeId[]) → places — เทียบเท่า $lookup
    const byId = new Map(mockPlaces.map((p) => [p.placeId, p]));
    return mockUser.wishlist.map((id) => byId.get(id)).filter(Boolean);
  }

  const res = await fetch(`/api/saved-places/${userId}`);
  if (!res.ok) throw new Error('SAVED_PLACES_FETCH_FAILED');
  return (await res.json()).places;
}
