import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import { completeBookingAndUnlockProvince } from '@/server/services/bookingPassportService';

function corsResponse(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(response);
}

// PATCH /api/bookings/[id]/complete — ยืนยันการจองเสร็จสิ้นและปลดล็อกจังหวัดในพาสปอร์ต
export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return corsResponse(
        NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 })
      );
    }

    const result = await completeBookingAndUnlockProvince(id);

    return corsResponse(
      NextResponse.json({
        success: true,
        message: result.message,
        booking: result.booking,
        unlockedProvince: result.unlockedProvince,
        visitedProvinces: result.visitedProvinces,
        pointsEarned: result.pointsEarned
      })
    );
  } catch (error: any) {
    console.error('[API Booking Complete Error]', error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: error.message || 'Failed to complete booking' },
        { status: 500 }
      )
    );
  }
}

// POST fallback for clients that don't support PATCH
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(req, context);
}
