import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import User from '@/server/models/User';
import { verifyToken } from '@/server/lib/auth';

// @description Returns the authenticated user's profile from a Bearer JWT.
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const token = auth.slice(7);
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}
