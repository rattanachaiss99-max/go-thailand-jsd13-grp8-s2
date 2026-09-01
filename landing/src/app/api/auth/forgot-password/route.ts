import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import Customer from '@/server/models/Customer';
import Admin from '@/server/models/Admin';
import { signToken, verifyToken } from '@/server/lib/auth';

// @description POST /api/auth/forgot-password
// Generates a password reset token for the given email.
// In production, this would be emailed to the user.
// For dev, we return the token in the response so you can test the flow.

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมล' }, { status: 400 });
    }

    await connectDB();

    // Check both Customer and Admin collections
    const customer = await Customer.findOne({ email });
    const admin = await Admin.findOne({ email });

    const user = customer ?? admin;

    if (!user) {
      // Don't reveal if email exists (security best practice)
      // Return generic success message
      return NextResponse.json(
        { message: 'หากอีเมลนี้มีในระบบ รหัสรีเซ็ตจะถูกส่งไปที่อีเมลของคุณ' },
        { status: 200 }
      );
    }

    // Generate a short-lived reset token (1 hour)
    const resetToken = signToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      type: 'password-reset'
    });

    // In production: save hashed token to user document + send email
    // For dev: return token directly so we can test
    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json(
      {
        message: 'หากอีเมลนี้มีในระบบ รหัสรีเซ็ตจะถูกส่งไปที่อีเมลของคุณ',
        ...(isDev && { resetToken }) // Only expose in dev
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[forgot-password]', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}