import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import User from '@/server/models/User';
// Import Customer model to ensure Mongoose discriminator is registered
import '@/server/models/Customer';
import { verifyToken } from '@/server/lib/auth';

function corsResponse(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle preflight OPTIONS request from Vite or cross-origin apps
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(response);
}

// @description Returns the authenticated user's profile from a Bearer JWT.
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return corsResponse(
        NextResponse.json({ isAuthenticated: false, user: null, error: 'ไม่พบ token' }, { status: 401 })
      );
    }

    const token = auth.slice(7);
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return corsResponse(
        NextResponse.json({ isAuthenticated: false, user: null, error: 'token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 })
      );
    }

    await connectDB();
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return corsResponse(
        NextResponse.json({ isAuthenticated: false, user: null, error: 'ไม่พบผู้ใช้' }, { status: 404 })
      );
    }

    return corsResponse(
      NextResponse.json({ isAuthenticated: true, user })
    );
  } catch (err) {
    console.error('[me]', err);
    return corsResponse(
      NextResponse.json({ isAuthenticated: false, error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 })
    );
  }
}

// @description Updates the authenticated user's profile from a Bearer JWT.
export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return corsResponse(
        NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 })
      );
    }

    const token = auth.slice(7);
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return corsResponse(
        NextResponse.json({ error: 'token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 })
      );
    }

    const body = await req.json().catch(() => ({}));

    await connectDB();
    const user = await User.findById(payload.sub);
    if (!user) {
      return corsResponse(
        NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
      );
    }

    // Update allowed fields
    if (typeof body.firstName === 'string' && body.firstName.trim()) {
      user.firstName = body.firstName.trim();
    }
    if (typeof body.lastName === 'string' && body.lastName.trim()) {
      user.lastName = body.lastName.trim();
    }
    if (typeof body.phone === 'string') {
      user.phone = body.phone.trim();
    }
    if (typeof body.avatarUrl === 'string') {
      user.avatarUrl = body.avatarUrl.trim();
    }
    if (Array.isArray(body.addresses)) {
      user.addresses = body.addresses;
    }

    // Customer discriminator specific fields
    const customerUser = user as any;
    if (typeof body.preferredLanguage === 'string') {
      customerUser.preferredLanguage = body.preferredLanguage;
    }
    if (typeof body.preferredCountry === 'string') {
      customerUser.preferredCountry = body.preferredCountry;
    }
    if (Array.isArray(body.visitedProvinces)) {
      customerUser.visitedProvinces = body.visitedProvinces;
    }

    await user.save();

    const userObj = user.toObject() as Record<string, any>;
    const { passwordHash: _discard, ...sanitized } = userObj;

    return corsResponse(
      NextResponse.json({
        message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        user: sanitized
      })
    );
  } catch (err) {
    console.error('[me PUT]', err);
    return corsResponse(
      NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' }, { status: 500 })
    );
  }
}
