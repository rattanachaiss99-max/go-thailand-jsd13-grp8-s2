/**
 * scripts/test-ai-advisor-call.ts
 *
 * Verifies calling the actual route handler with an authorized token
 * and confirms that DB credits decrement correctly.
 */

import connectDB from '../src/server/db';
import User from '../src/server/models/User';
import '../src/server/models/Customer';
import { signToken } from '../src/server/lib/auth';
import { POST } from '../src/app/api/ai/travel-advisor/route';
import { NextRequest } from 'next/server';

async function main() {
  console.log('🧪 Testing POST /api/ai/travel-advisor with authorized user...\n');
  await connectDB();

  const user = await User.findOne({ email: 'r@gmail.com' });
  if (!user) throw new Error('Test user not found');

  const beforeCredits = user.aiCredits ?? 0;
  console.log(`📊 Initial credits for ${user.email}: ${beforeCredits}`);

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  });

  const req = new NextRequest('http://localhost:3100/api/ai/travel-advisor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: 'อยากไปทะเลสวยๆ ภาคใต้ ดำน้ำดูปะการัง',
      activeRegion: 'south'
    })
  });

  const res = await POST(req);
  const data = await res.json();

  console.log(`\n📥 Response Status: ${res.status}`);
  console.log(`📥 Success: ${data.success}`);
  console.log(`📥 Credits Remaining in Response: ${data.creditsRemaining}`);

  // Fetch updated user from DB to verify persistence
  const updatedUser = await User.findById(user._id);
  const afterCredits = updatedUser?.aiCredits ?? 0;
  console.log(`📊 Updated credits in MongoDB: ${afterCredits}`);

  if (afterCredits === beforeCredits - 1) {
    console.log('✅ PASS: DB Credit decremented exactly by 1 in MongoDB Atlas!');
  } else {
    console.error(`❌ FAIL: Expected credits to be ${beforeCredits - 1}, but got ${afterCredits}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error in test:', err);
  process.exit(1);
});
