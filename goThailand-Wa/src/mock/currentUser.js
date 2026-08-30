// ============================================================================
// Mock current user — รูปร่างเลียนแบบ document ที่ได้จาก GET /api/auth/me
// ของโปรเจกต์ `landing` (Mongoose discriminator: users collection, role=customer)
//
// ⚠️ ชื่อ field ต้องตรงกับ landing/src/server/models/Customer.ts เป๊ะ:
//    points, bookingCount, wishlist, membershipTier
//    ห้ามเปลี่ยนเป็น rewards.points — ไม่งั้นตอนต่อ login จริงต้อง map ชื่อใหม่
// ============================================================================

/** hardcode ชั่วคราว — ของจริงจะได้จาก JWT ของ `landing` */
export const MOCK_USER_ID = '66ce7000f1a2b3c4d5e6f700';

export const mockUser = {
  _id: MOCK_USER_ID,
  email: 'somchai@example.com',
  role: 'customer',
  firstName: 'Somchai',
  lastName: 'Jaidee',
  phone: '081-234-5678',
  avatarUrl: null,
  emailVerified: true,
  isActive: true,
  addresses: [],

  // --- Customer discriminator fields ---
  membershipTier: 'gold',
  points: 4500, // → การ์ด REWARDS POINTS
  bookingCount: 12, // ค่า denormalized ของ landing (dashboard คำนวณสดจาก bookings แทน)
  wishlist: [
    'wat-arun-bkk',
    'doi-inthanon',
    'maya-bay',
    'phi-phi-leh',
    'ayutthaya-park',
    'erawan-falls',
    'railay-beach',
    'chatuchak-market'
  ], // 8 รายการ → การ์ด SAVED PLACES
  coupons: [],
  preferredLanguage: 'th',
  preferredCountry: 'TH',

  createdAt: '2026-01-10T04:00:00.000Z',
  updatedAt: '2026-08-27T13:30:00.000Z'
};

export default mockUser;
