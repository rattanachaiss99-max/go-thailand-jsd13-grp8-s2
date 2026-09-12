import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import User from '@/server/models/User';
import '@/server/models/Customer';
import { verifyToken } from '@/server/lib/auth';

function corsResponse(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return corsResponse(new NextResponse(null, { status: 204 }));
}

/**
 * GET /api/ai/travel-advisor/status
 * Returns current user's AI access permission & credit balance from MongoDB.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return corsResponse(
        NextResponse.json({
          isAuthenticated: false,
          canAccessAi: false,
          aiCredits: 0,
          message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน AI Copilot'
        })
      );
    }

    const token = authHeader.slice(7);
    let payload: any;
    try {
      payload = verifyToken(token);
    } catch {
      return corsResponse(
        NextResponse.json({
          isAuthenticated: false,
          canAccessAi: false,
          aiCredits: 0,
          message: 'โทเคนหมดอายุหรือไม่ได้ลงชื่อเข้าใช้'
        })
      );
    }

    await connectDB();
    const user = await User.findById(payload.sub).select(
      'firstName lastName email isActive canAccessAi aiCredits role'
    );

    if (!user) {
      return corsResponse(
        NextResponse.json({
          isAuthenticated: false,
          canAccessAi: false,
          aiCredits: 0,
          message: 'ไม่พบบัญชีผู้ใช้ในระบบ'
        })
      );
    }

    return corsResponse(
      NextResponse.json({
        isAuthenticated: true,
        user: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          isActive: user.isActive,
          canAccessAi: Boolean(user.canAccessAi),
          aiCredits: typeof user.aiCredits === 'number' ? user.aiCredits : 0
        }
      })
    );
  } catch (error) {
    console.error('[AI Status Route Error]:', error);
    return corsResponse(
      NextResponse.json(
        {
          isAuthenticated: false,
          canAccessAi: false,
          aiCredits: 0,
          error: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะผู้ใช้'
        },
        { status: 500 }
      )
    );
  }
}
