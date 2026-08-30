import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import User from '@/server/models/User';
import Customer from '@/server/models/Customer';
import { verifyToken } from '@/server/lib/auth';

// @description POST /api/feedback — authenticated customer leaves feedback.
// Body: { rating: number(1-5), comment?: string, topic?: string }
// The feedback is appended to the customer's `feedbacks` array.

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 });

    await connectDB();

    const body = await req.json();
    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating ต้องอยู่ระหว่าง 1-5' }, { status: 400 });
    }

    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    if (user.role !== 'customer') {
      return NextResponse.json({ error: 'เฉพาะลูกค้าเท่านั้นที่ส่ง feedback ได้' }, { status: 403 });
    }

    const customer = user as InstanceType<typeof Customer>;
    customer.feedbacks.push({
      rating,
      comment: body.comment || '',
      topic: body.topic || 'general',
      createdAt: new Date()
    });
    await customer.save();

    return NextResponse.json({ message: 'บันทึก feedback สำเร็จ', feedbacks: customer.feedbacks });
  } catch (err) {
    console.error('[feedback] error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายใน' }, { status: 500 });
  }
}
