import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import Customer from '@/server/models/Customer';
import Admin from '@/server/models/Admin';
import { hashPassword, verifyToken } from '@/server/lib/auth';

// @description POST /api/auth/reset-password
// Verifies the password-reset token and updates the user's password.
// In production, you should also invalidate/remove the used token from the user document.

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token?: string; password?: string };
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'กรุณาระบุโทเคนและรหัสผ่านใหม่' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Verify token
    let payload;
    try {
      payload = verifyToken(token) as { sub: string; role: string; email: string; type?: string };
    } catch {
      return NextResponse.json(
        { error: 'โทเคนไม่ถูกต้องหรือหมดอายุ' },
        { status: 400 }
      );
    }

    // Ensure it's a password-reset token
    if (payload.type !== 'password-reset') {
      return NextResponse.json(
        { error: 'โทเคนไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user in both collections
    const customer = await Customer.findById(payload.sub);
    const admin = await Admin.findById(payload.sub);

    const user = customer ?? admin;

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    // In production: also delete/invalidate the reset token from user document

    return NextResponse.json(
      { message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}