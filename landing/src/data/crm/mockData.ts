// ============================================================================
// CRM Mock Data (Customer, Bookings, Places)
// Compatible with Mongoose Customer & Order schema
// ============================================================================

export const MOCK_USER_ID = '66ce7890f1a2b3c4d5e67890';

export interface CRMUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  bookingCount: number;
  wishlist: string[];
  avatarUrl: string;
}

export interface BookingItem {
  category: 'car' | 'hotel' | 'guide';
  title: string;
  image?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate: string;
  returnDate: string;
  pricePerDay: number;
  totalDays: number;
}

export interface BookingPricing {
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
}

export interface RawCarBooking {
  carName?: string;
  carImage?: string;
  carDetails?: string;
  carRating?: string;
  pickupReturn?: string;
  dates?: string;
  rentalPrice?: number;
  serviceFee?: number;
  totalPrice?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  driverName?: string;
  licenseCountry?: string;
  driverAge?: string | number;
  licenseNumber?: string;
  paymentMethod?: string;
  cardName?: string;
  cardNumber?: string;
  maskedCardNumber?: string;
  expiryDate?: string;
  saveCard?: boolean;
  sameAsTraveler?: boolean;
  termsAccepted?: boolean;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface BookingRecord {
  _id: string;
  bookingReference: string;
  userId: string;
  bookingStatus: 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  item: BookingItem;
  pricing: BookingPricing;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  rawCarBooking?: RawCarBooking;
}

export interface CRMPlace {
  placeId: string;
  name: string;
  province: string;
  category: string;
  image: string;
}

export const mockUser: CRMUser = {
  userId: MOCK_USER_ID,
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  email: 'somchai@example.com',
  phone: '081-234-5678',
  membershipTier: 'gold',
  points: 4500,
  bookingCount: 6,
  wishlist: [
    'wat-arun-bkk',
    'doi-inthanon',
    'maya-bay',
    'phi-phi-leh',
    'ayutthaya-park',
    'erawan-falls',
    'railay-beach',
    'chatuchak-market'
  ],
  avatarUrl: '/assets/images/users/avatar-1.png'
};

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
};

const makeOrder = (
  ref: string,
  status: 'confirmed' | 'completed' | 'cancelled',
  title: string,
  category: 'car' | 'hotel' | 'guide',
  pickupOffset: number,
  days: number,
  pricePerDay: number,
  pickupLocation: string
): BookingRecord => {
  const subtotal = pricePerDay * days;
  const tax = Math.round(subtotal * 0.07);
  return {
    _id: `66ce7890f1a2b3c4d5e6${ref.slice(-4)}`,
    bookingReference: ref,
    userId: MOCK_USER_ID,
    bookingStatus: status,
    paymentStatus: 'paid',
    item: {
      category,
      title,
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
      fullName: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      phone: '081-234-5678'
    }
  };
};

export const mockBookings: BookingRecord[] = [
  // 1 Upcoming Hotel (confirmed in future)
  makeOrder('GT20260902', 'confirmed', 'Emerald Jungle Retreat (Villa)', 'hotel', 18, 2, 9500, 'แม่ริม, เชียงใหม่'),

  // 5 Completed Hotel & Guide in past
  makeOrder('GT20260715', 'completed', 'Four Seasons Samui Cove', 'hotel', -25, 3, 18500, 'เกาะสมุย, สุราษฎร์ธานี'),
  makeOrder('GT20260701', 'completed', 'Local Guide: วัดพระแก้วและพระบรมมหาราชวัง', 'guide', -40, 1, 1500, 'กรุงเทพมหานคร'),
  makeOrder('GT20260520', 'completed', 'Ayutthaya Heritage Riverside', 'hotel', -80, 1, 3800, 'พระนครศรีอยุธยา'),
  makeOrder('GT20260310', 'completed', 'Khao Yai Vineyard Villas', 'hotel', -150, 2, 6200, 'เขาใหญ่, นครราชสีมา'),
  makeOrder('GT20260105', 'completed', 'Lanna Riverside Boutique', 'hotel', -220, 3, 4200, 'ริมแม่น้ำปิง, เชียงใหม่')
];

export const mockPlaces: CRMPlace[] = [
  { placeId: 'wat-arun-bkk', name: 'วัดอรุณราชวราราม', province: 'กรุงเทพฯ', category: 'temple', image: '/images/places/wat-arun.png' },
  { placeId: 'doi-inthanon', name: 'อุทยานแห่งชาติดอยอินทนนท์', province: 'เชียงใหม่', category: 'nature', image: '/images/places/doi-inthanon.png' },
  { placeId: 'maya-bay', name: 'อ่าวมาหยา เกาะพีพี', province: 'กระบี่', category: 'beach', image: '/images/places/maya-bay.png' },
  { placeId: 'phi-phi-leh', name: 'ปิเละลากูน', province: 'กระบี่', category: 'beach', image: '/images/places/phi-phi-leh.png' },
  { placeId: 'ayutthaya-park', name: 'อุทยานประวัติศาสตร์พระนครศรีอยุธยา', province: 'อยุธยา', category: 'heritage', image: '/images/places/ayutthaya-park.png' },
  { placeId: 'erawan-falls', name: 'น้ำตกเอราวัณ', province: 'กาญจนบุรี', category: 'nature', image: '/images/places/erawan-falls.png' },
  { placeId: 'railay-beach', name: 'หาดไร่เลย์', province: 'กระบี่', category: 'beach', image: '/images/places/railay-beach.png' },
  { placeId: 'chatuchak-market', name: 'ตลาดนัดจตุจักร', province: 'กรุงเทพฯ', category: 'market', image: '/images/places/chatuchak-market.png' }
];
