// scripts/seed-users.ts
// เพิ่มผู้ใช้ตัวอย่างลง MongoDB (Customer + Admin)
// รันด้วย:  npm run seed
// ⚠️ ต้องตั้ง MONGODB_URI ใน .env ก่อน (ใช้บัญชีบริษัท)

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Customer from '../src/server/models/Customer';
import Admin from '../src/server/models/Admin';

// ข้อมูลตัวอย่าง — แก้ได้ตามต้องการ (ห้ามใส่รหัสผ่านจริงลง git)
const SAMPLE_PASSWORD = process.env.SEED_PASSWORD || '***';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('กรุณาตั้ง MONGODB_URI ในไฟล์ .env (บัญชีบริษัท)');
  }

  await mongoose.connect(uri);
  console.log('✅ เชื่อมต่อ MongoDB สำเร็จ');

  const passwordHash = await bcrypt.hash(SAMPLE_PASSWORD, 10);

  // ลบของเก่า (เฉพาะอีเมลตัวอย่าง) เพื่อรันซ้ำได้ไม่ซ้ำซ้อน
  await Customer.deleteMany({ email: { $in: ['customer@go-thailand.com', 'somchai@go-thailand.com'] } });
  await Admin.deleteMany({ email: { $in: ['admin@go-thailand.com'] } });

  // --- Customer ตัวอย่าง ---
  const customer = await Customer.create({
    email: 'customer@go-thailand.com',
    passwordHash,
    firstName: 'ลูกค้า',
    lastName: 'ทดสอบ',
    phone: '0812345678',
    role: 'customer',
    membershipTier: 'silver',
    points: 120,
    preferredLanguage: 'th',
    bookingCount: 2,
    coupons: [{ code: 'WELCOME10', discountPercent: 10 }],
    emailVerified: true
  });
  console.log('➕ Customer:', customer.email);

  // --- Admin ตัวอย่าง ---
  const admin = await Admin.create({
    email: 'admin@go-thailand.com',
    passwordHash,
    firstName: 'ผู้ดูแล',
    lastName: 'ระบบ',
    phone: '0899999999',
    role: 'admin',
    adminLevel: 'super',
    permissions: ['*']
  });
  console.log('➕ Admin:', admin.email);

  console.log('\n🎉 Seed เสร็จสิ้น — เพิ่มผู้ใช้ตัวอย่าง 2 รายการ');
  console.log('   ล็อกอินด้วยรหัสผ่าน:', SAMPLE_PASSWORD);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('❌ Seed ล้มเหลว:', err);
  await mongoose.disconnect();
  process.exit(1);
});
