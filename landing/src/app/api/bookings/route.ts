import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import Booking from '@/server/models/Booking';
import { verifyToken } from '@/server/lib/auth';
import {
  createBooking,
  getUserBookings,
  normalizeProvince
} from '@/server/services/bookingPassportService';

function corsResponse(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(response);
}

// Helper: resolve userId from JWT or headers or query params
function resolveUserId(req: NextRequest): string {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    try {
      const payload = verifyToken(auth.slice(7));
      if (payload?.sub) return payload.sub;
    } catch {
      // Ignore token failure, fallback to headers
    }
  }

  const headerUser = req.headers.get('x-user-id');
  if (headerUser) return headerUser;

  const { searchParams } = new URL(req.url);
  const paramUser = searchParams.get('user_id');
  if (paramUser) return paramUser;

  return 'demo-traveler-default';
}

// GET /api/bookings — ดึงรายการจองของผู้ใช้ (จาก MongoDB Atlas)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = resolveUserId(req);

    let bookings = await getUserBookings(userId);

    // หากยังไม่เคยมีการจองเลย ให้สร้าง seed sample booking 1 รายการที่ completed ในภาคเหนือ
    if (bookings.length === 0 && userId !== 'demo-traveler-default') {
      const seedCompleted = await createBooking({
        userId,
        item: {
          title: 'ทัวร์ดอยอินทนนท์ ชมพระอาทิตย์ขึ้น & กิ่วแม่ปาน เชียงใหม่',
          category: 'tour',
          location: 'จอมทอง, เชียงใหม่',
          province: 'chiang-mai',
          pricePerUnit: 1450,
          quantity: 1,
          pickupDate: new Date(Date.now() - 86400000 * 10).toISOString(),
          returnDate: new Date(Date.now() - 86400000 * 9).toISOString()
        },
        province: 'chiang-mai',
        customerInfo: {
          fullName: 'Traveler Explorer',
          email: 'traveler@gothailand.com'
        },
        bookingStatus: 'completed',
        paymentStatus: 'paid'
      });
      bookings = [seedCompleted as any];
    }

    return corsResponse(
      NextResponse.json({
        success: true,
        count: bookings.length,
        bookings
      })
    );
  } catch (error: any) {
    console.error('[API Bookings GET Error]', error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch bookings' },
        { status: 500 }
      )
    );
  }
}

// POST /api/bookings — สร้างรายการจองใหม่ (Shared API)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const userId = body.userId || resolveUserId(req);

    if (!body.item || !body.item.title) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: 'ข้อมูลสินค้า/บริการไม่ครบถ้วน (item.title is required)' },
          { status: 400 }
        )
      );
    }

    const province = normalizeProvince(body.province || body.item.province || body.item.location || 'chiang-mai');

    const booking = await createBooking({
      userId,
      item: {
        ...body.item,
        province
      },
      province,
      customerInfo: body.customerInfo || {
        fullName: body.fullName || 'Verified Traveler',
        email: body.email || 'traveler@gothailand.com',
        phone: body.phone || ''
      },
      pricing: body.pricing,
      bookingStatus: body.bookingStatus || 'confirmed',
      paymentStatus: body.paymentStatus || 'paid'
    });

    return corsResponse(
      NextResponse.json({
        success: true,
        message: 'สร้างรายการจองสำเร็จ',
        booking,
        unlockedProvince: booking.bookingStatus === 'completed' ? province : undefined
      })
    );
  } catch (error: any) {
    console.error('[API Bookings POST Error]', error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: error.message || 'Failed to create booking' },
        { status: 500 }
      )
    );
  }
}
