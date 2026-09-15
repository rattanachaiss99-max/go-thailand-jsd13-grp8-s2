import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/server/db';
import User from '@/server/models/User';
import { verifyPassword, signToken } from '@/server/lib/auth';
import { validateLogin, LoginInput } from '@/server/lib/validate';

function corsResponse(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(response);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LoginInput>;
    const error = validateLogin(body);
    if (error) {
      return corsResponse(NextResponse.json({ error }, { status: 400 }));
    }

    await connectDB();

    // passwordHash is excluded by default (select:false) — explicitly select it.
    const user = await User.findOne({ email: body.email!.toLowerCase() }).select('+passwordHash');
    if (!user || !user.isActive) {
      return corsResponse(NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 }));
    }

    const ok = await verifyPassword(body.password!, user.passwordHash);
    if (!ok) {
      return corsResponse(NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 }));
    }

    const token = signToken({ sub: user.id, role: user.role, email: user.email });

    return corsResponse(
      NextResponse.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      })
    );
  } catch (err) {
    console.error('[login]', err);
    return corsResponse(NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 }));
  }
}
