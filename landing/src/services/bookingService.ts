// ============================================================================
// Booking Service — Client Boundary Layer for Next.js & React components
// ============================================================================

export interface BookingData {
  _id: string;
  bookingReference: string;
  userId: string;
  item: {
    title: string;
    category: string;
    location?: string;
    province: string;
    pickupDate?: string;
    returnDate?: string;
    pricePerUnit: number;
    quantity: number;
    imageUrl?: string;
  };
  province: string;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  pricing: {
    subtotal: number;
    tax: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
  customerInfo: {
    fullName: string;
    email: string;
    phone?: string;
  };
  completedAt?: string;
  createdAt: string;
}

/** ดึงรายการจองของผู้ใช้ปัจจุบัน */
export async function fetchUserBookings(token?: string | null): Promise<BookingData[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/bookings', { headers });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.error('[fetchUserBookings Error]', err);
    return [];
  }
}

/** สร้างรายการจองใหม่ */
export async function createBookingRequest(
  bookingPayload: any,
  token?: string | null
): Promise<{ success: boolean; booking?: BookingData; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingPayload)
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Create booking failed');
    return { success: true, booking: data.booking };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** ยืนยันการจองเสร็จสิ้นเพื่อปลดล็อกจังหวัดในพาสปอร์ต */
export async function completeBookingRequest(
  bookingId: string,
  token?: string | null
): Promise<{
  success: boolean;
  message?: string;
  unlockedProvince?: string;
  visitedProvinces?: string[];
  error?: string;
}> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/bookings/${bookingId}/complete`, {
      method: 'PATCH',
      headers
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Complete booking failed');
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 🚀 ฟังก์ชันจำลอง: สร้างทริปการจองและตั้งสถานะเป็นเสร็จสิ้นทันที
 * สะดวกสำหรับการทดสอบของทีมและสาธิตการปลดล็อกพาสปอร์ตจริงใน MongoDB
 */
export async function simulateCompletedTrip(
  provinceSlug: string,
  provinceName: string,
  token?: string | null
) {
  return createBookingRequest(
    {
      item: {
        title: `แพ็กเกจท่องเที่ยวจังหวัด${provinceName} (ทริปพิเศษ Go Thailand)`,
        category: 'tour',
        location: provinceName,
        province: provinceSlug,
        pricePerUnit: 2500,
        quantity: 1,
        pickupDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        returnDate: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      province: provinceSlug,
      bookingStatus: 'completed',
      paymentStatus: 'paid'
    },
    token
  );
}
