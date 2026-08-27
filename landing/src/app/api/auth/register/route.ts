import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import Customer from '@/server/models/Customer';
import Admin from '@/server/models/Admin';
import { hashPassword, signToken } from '@/server/lib/auth';
import { validateRegister, RegisterInput } from '@/server/lib/validate';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<RegisterInput>;
    const error = validateRegister(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();

    const role = body.role ?? 'customer';
    const Model: typeof Customer | typeof Admin = role === 'admin' ? Admin : Customer;

    // Check duplicate email
    const existing = await (Model as typeof Customer).findOne({ email: body.email!.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 409 });
    }

    const passwordHash = await hashPassword(body.password!);

    const base = {
      email: body.email!.toLowerCase(),
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone
    };

    const user =
      role === 'admin'
        ? await Admin.create({ ...base, role: 'admin' })
        : await Customer.create({ ...base, role: 'customer', membershipTier: 'bronze', points: 0, bookingCount: 0 });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });

    return NextResponse.json(
      {
        message: 'สมัครสมาชิกสำเร็จ',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}
