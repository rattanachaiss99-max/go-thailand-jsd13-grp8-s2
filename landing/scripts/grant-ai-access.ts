/**
 * scripts/grant-ai-access.ts
 *
 * Utility script for Administrators to manage AI Travel Copilot access and credits
 * directly in MongoDB Atlas.
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/grant-ai-access.ts list
 *   npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --enable [--credits <number>]
 *   npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --disable
 *   npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --credits <number>
 */

import connectDB from '../src/server/db';
import User from '../src/server/models/User';
import '../src/server/models/Customer';

async function main() {
  const args = process.argv.slice(2);
  const commandOrEmail = args[0];

  if (!commandOrEmail || commandOrEmail === '--help' || commandOrEmail === '-h') {
    console.log(`
╔═════════════════════════════════════════════════════════════════════════╗
║          Go Thailand AI Travel Copilot Access Manager (MongoDB)         ║
╚═════════════════════════════════════════════════════════════════════════╝

คำสั่งที่สามารถใช้งานได้:
  1. ดูรายชื่อและสถานะสิทธิ์ AI ของผู้ใช้ทั้งหมด:
     npx tsx --env-file=.env scripts/grant-ai-access.ts list

  2. เปิดสิทธิ์ให้ผู้ใช้ และกำหนดเครดิตเริ่มต้น:
     npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --enable --credits 50

  3. ปิดสิทธิ์การใช้งาน AI ของผู้ใช้:
     npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --disable

  4. เติมหรือปรับเปลี่ยนเครดิตให้ผู้ใช้:
     npx tsx --env-file=.env scripts/grant-ai-access.ts <email> --credits 100
`);
    process.exit(0);
  }

  await connectDB();

  if (commandOrEmail === 'list') {
    const users = await User.find({}).select('email firstName lastName role canAccessAi aiCredits isActive');
    console.log(`\n📋 รายชื่อผู้ใช้ทั้งหมดในระบบ (${users.length} บัญชี):`);
    console.table(
      users.map((u) => ({
        ID: u._id.toString(),
        Email: u.email,
        Name: `${u.firstName} ${u.lastName}`,
        Role: u.role,
        Active: u.isActive ? '✅' : '❌',
        'AI Access': u.canAccessAi ? '🌟 YES' : '🔒 NO',
        'AI Credits': u.aiCredits ?? 0
      }))
    );
    process.exit(0);
  }

  const email = commandOrEmail.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`❌ ไม่พบผู้ใช้ที่มีอีเมล: ${email}`);
    process.exit(1);
  }

  let updated = false;

  if (args.includes('--enable')) {
    user.canAccessAi = true;
    updated = true;
    console.log(`✅ เปิดสิทธิ์การใช้งาน AI Copilot ให้ ${email} เรียบร้อยแล้ว`);
  }

  if (args.includes('--disable')) {
    user.canAccessAi = false;
    updated = true;
    console.log(`🔒 ปิดสิทธิ์การใช้งาน AI Copilot ของ ${email} เรียบร้อยแล้ว`);
  }

  const creditsIndex = args.indexOf('--credits');
  if (creditsIndex !== -1 && args[creditsIndex + 1]) {
    const amount = parseInt(args[creditsIndex + 1], 10);
    if (!isNaN(amount) && amount >= 0) {
      user.aiCredits = amount;
      updated = true;
      console.log(`🪙 อัปเดตเครดิต AI ของ ${email} เป็น ${amount} เครดิต`);
    } else {
      console.error('❌ จำนวนเครดิตต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0');
    }
  }

  if (updated) {
    await user.save();
    console.log(`\n🎉 บันทึกการเปลี่ยนแปลงลง MongoDB เรียบร้อย:`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - AI Access: ${user.canAccessAi ? '🌟 ได้รับอนุญาต' : '🔒 ถูกปิดการเข้าถึง'}`);
    console.log(`   - AI Credits: ${user.aiCredits} ครั้ง\n`);
  } else {
    console.log(`\nℹ️ ข้อมูลปัจจุบันของ ${email}:`);
    console.log(`   - AI Access: ${user.canAccessAi ? '🌟 ได้รับอนุญาต' : '🔒 ยังไม่ได้รับสิทธิ์'}`);
    console.log(`   - AI Credits: ${user.aiCredits ?? 0} ครั้ง\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
