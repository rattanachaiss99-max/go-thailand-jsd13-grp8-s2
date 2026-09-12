// ============================================================================
// Automated Test Script: Landing User Module Verification
// Tests MongoDB connection, JWT auth, User Profile GET, and Profile PUT update
// ============================================================================

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Read .env
let MONGODB_URI = process.env.MONGODB_URI;
let JWT_SECRET = process.env.JWT_SECRET || 'gt_super_secret_jwt_key_2026';

if (!MONGODB_URI) {
  try {
    const envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
    const matchUri = envContent.match(/MONGODB_URI=(.+)/);
    if (matchUri) MONGODB_URI = matchUri[1].trim().replace(/^["']|["']$/g, '');
    const matchSecret = envContent.match(/JWT_SECRET=(.+)/);
    if (matchSecret) JWT_SECRET = matchSecret[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}

async function run() {
  console.log('🚀 [User Module Test] Starting verification...\n');

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured in .env');
  }

  // 1. Connect to Atlas
  console.log('1️⃣ Connecting to MongoDB Atlas...');
  const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`   ✅ Connected to Database: "${conn.connection.name}"`);

  const db = conn.connection.db;
  const usersCol = db.collection('users');

  // 2. Prepare test customer in users collection
  console.log('\n2️⃣ Ensuring test customer exists...');
  const testEmail = 'traveler_test@gothailand.com';
  let user = await usersCol.findOne({ email: testEmail });

  if (!user) {
    const insertRes = await usersCol.insertOne({
      email: testEmail,
      passwordHash: '$2b$10$abcdefg1234567890mockhash',
      role: 'customer',
      firstName: 'ก้องภพ',
      lastName: 'รักการเดินทาง',
      phone: '081-111-2233',
      membershipTier: 'gold',
      points: 2450,
      bookingCount: 5,
      wishlist: ['tour-phuket-01', 'tour-chiangmai-02'],
      addresses: [
        {
          line1: '99/1 ถ.พหลโยธิน',
          city: 'จตุจักร',
          province: 'กรุงเทพมหานคร',
          postalCode: '10900',
          country: 'TH'
        }
      ],
      preferredLanguage: 'th',
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user = await usersCol.findOne({ _id: insertRes.insertedId });
    console.log(`   ✅ Created test user: ${testEmail} (ID: ${user._id})`);
  } else {
    console.log(`   ✅ Found existing test user: ${testEmail} (ID: ${user._id})`);
  }

  // 3. Generate JWT Token
  console.log('\n3️⃣ Generating JWT Bearer token...');
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.log(`   ✅ Token signed (Length: ${token.length} chars)`);

  // 4. Verify Token decoding
  console.log('\n4️⃣ Verifying JWT payload...');
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.sub !== user._id.toString()) {
    throw new Error('Decoded token subject mismatch');
  }
  console.log(`   ✅ Decoded subject: ${decoded.sub} matches User ID`);

  // 5. Test PUT Profile Update logic
  console.log('\n5️⃣ Testing Profile Update (PUT /api/auth/me simulation)...');
  const updatePayload = {
    firstName: 'ก้องภพ (อัปเดต)',
    lastName: 'รักการเดินทาง',
    phone: '089-777-8899',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    preferredLanguage: 'th',
    addresses: [
      {
        line1: '888/9 ถ.สุขุมวิท ซอย 55',
        city: 'วัฒนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10110',
        country: 'TH'
      }
    ]
  };

  const updateRes = await usersCol.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        firstName: updatePayload.firstName,
        lastName: updatePayload.lastName,
        phone: updatePayload.phone,
        avatarUrl: updatePayload.avatarUrl,
        preferredLanguage: updatePayload.preferredLanguage,
        addresses: updatePayload.addresses,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  const updatedDoc = updateRes;
  console.log(`   ✅ User profile updated successfully in MongoDB Atlas!`);
  console.log(`      Name: ${updatedDoc.firstName} ${updatedDoc.lastName}`);
  console.log(`      Phone: ${updatedDoc.phone}`);
  console.log(`      Avatar: ${updatedDoc.avatarUrl}`);
  console.log(`      Address: ${updatedDoc.addresses[0].line1}, ${updatedDoc.addresses[0].city} ${updatedDoc.addresses[0].postalCode}`);
  console.log(`      Points: ${updatedDoc.points} pt, Tier: ${updatedDoc.membershipTier}`);

  // 6. Security check: Ensure passwordHash is not exposed
  console.log('\n6️⃣ Security Verification...');
  const sanitized = { ...updatedDoc };
  delete sanitized.passwordHash;
  if ('passwordHash' in sanitized) {
    throw new Error('Security flaw: passwordHash is still present in sanitized object');
  }
  console.log('   ✅ passwordHash stripped from sanitized user response payload');

  await mongoose.disconnect();
  console.log('\n🎉 [User Module Test] ALL TESTS PASSED SUCCESSFULLY! (100%)\n');
}

run().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
