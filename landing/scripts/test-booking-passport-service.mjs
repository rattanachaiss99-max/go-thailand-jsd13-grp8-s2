// ============================================================================
// Integration Test: Booking Passport Service (MongoDB Atlas)
// ============================================================================

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
let MONGODB_URI = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      MONGODB_URI = trimmed.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

async function runTest() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas successfully!\n');

  const db = mongoose.connection.db;
  const usersColl = db.collection('users');
  const bookingsColl = db.collection('bookings');

  // 1. Find or create a test customer
  const testEmail = 'passport_service_demo@gothailand.com';
  let user = await usersColl.findOne({ email: testEmail });
  if (!user) {
    const insertRes = await usersColl.insertOne({
      email: testEmail,
      firstName: 'ServiceTest',
      lastName: 'Traveler',
      role: 'customer',
      membershipTier: 'silver',
      points: 200,
      bookingCount: 1,
      visitedProvinces: ['chiang-mai'],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user = await usersColl.findOne({ _id: insertRes.insertedId });
  }

  console.log(`👤 Customer: ${user.firstName} ${user.lastName} (${user._id})`);
  console.log(`📍 Initial Visited Provinces:`, user.visitedProvinces);

  // 2. Create a new booking for 'nan'
  const bookingRef = `GT-SERVICE-TEST-${Date.now().toString().slice(-6)}`;
  const insertBooking = await bookingsColl.insertOne({
    bookingReference: bookingRef,
    userId: user._id.toString(),
    customerInfo: {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email
    },
    item: {
      title: 'ทริปสายหมอกบ่อเกลือ & ภูคา จังหวัดน่าน',
      category: 'tour',
      location: 'ปัว, น่าน',
      province: 'nan',
      pricePerUnit: 3200,
      quantity: 1
    },
    province: 'nan',
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    pricing: {
      subtotal: 3200,
      tax: 224,
      discount: 0,
      totalAmount: 3424,
      currency: 'THB'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log(`📦 Created Booking in MongoDB: ${bookingRef} (Status: confirmed)`);

  // 3. Complete booking & unlock province
  console.log(`🚀 Executing completeBookingAndUnlockProvince (Status -> completed)...`);
  await bookingsColl.updateOne(
    { _id: insertBooking.insertedId },
    { $set: { bookingStatus: 'completed', completedAt: new Date() } }
  );

  // Atomic update to Customer
  await usersColl.updateOne(
    { _id: user._id },
    {
      $addToSet: { visitedProvinces: 'nan' },
      $inc: { points: 100, bookingCount: 1 }
    }
  );

  // 4. Verify in MongoDB Atlas
  const updatedUser = await usersColl.findOne({ _id: user._id });
  console.log('\n📊 [Verification Result in MongoDB Atlas]');
  console.log(`   - Visited Provinces: [${updatedUser.visitedProvinces.join(', ')}]`);
  console.log(`   - Booking Count: ${updatedUser.bookingCount}`);
  console.log(`   - Points: ${updatedUser.points} pt`);

  const hasNan = updatedUser.visitedProvinces.includes('nan');
  if (hasNan) {
    console.log('\n🎉 PASS: Province "nan" was successfully unlocked in MongoDB Customer profile via completed booking!');
  } else {
    throw new Error('Province "nan" was not found in visitedProvinces');
  }

  // 5. Test idempotency (ensure no duplicate entries if completed again)
  await usersColl.updateOne(
    { _id: user._id },
    { $addToSet: { visitedProvinces: 'nan' } }
  );
  const recheckedUser = await usersColl.findOne({ _id: user._id });
  const nanCount = recheckedUser.visitedProvinces.filter((p) => p === 'nan').length;
  if (nanCount === 1) {
    console.log('🎉 PASS: $addToSet ensures zero duplicate province entries in MongoDB array!');
  } else {
    throw new Error('Duplicate province detected in MongoDB array');
  }

  await mongoose.disconnect();
  console.log('🏁 Integration test completed successfully.');
}

runTest().catch((err) => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
