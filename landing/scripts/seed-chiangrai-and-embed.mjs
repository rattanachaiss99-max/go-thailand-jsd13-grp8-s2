// scripts/seed-chiangrai-and-embed.mjs
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. อ่าน Environment variables
let MONGODB_URI = process.env.MONGODB_URI;
let API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!MONGODB_URI || !API_KEY) {
  try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const mUri = envContent.match(/MONGODB_URI=(.+)/);
      if (mUri) MONGODB_URI = mUri[1].trim().replace(/^["']|["']$/g, '');
      const mKey = envContent.match(/(?:GEMINI_API_KEY|GOOGLE_API_KEY)=(.+)/);
      if (mKey) API_KEY = mKey[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    console.warn('Could not read .env file:', e.message);
  }
}

if (!MONGODB_URI) {
  console.error('❌ ไม่พบ MONGODB_URI ใน .env');
  process.exit(1);
}

const CHIANG_RAI_KNOWLEDGE = {
  provinceId: 'TH-57',
  slug: 'chiang-rai',
  nameTh: 'เชียงราย',
  nameEn: 'Chiang Rai',
  region: 'north',
  slogan: 'เหนือสุดในสยาม ชายแดนสามแผ่นดิน ชมนางนอน ดอยแม่สลอง ชาเลิศล้ำ วัฒนธรรมล้านนา',
  summary: 'เมืองแห่งมหาพุทธศิลป์ระดับโลกและขุนเขา ดินแดนแห่งไร่ชาขั้นบันได แหล่งกาแฟ Specialty ดอยช้าง และจุดชมทะเลหมอกสุดตระการตาเหนือหน้าผาภูชี้ฟ้า',
  highlights: [
    'วัดร่องขุ่น (มหาพุทธศิลป์สีขาวบริสุทธิ์ของ อ.เฉลิมชัย โฆษิตพิพัฒน์)',
    'พิพิธภัณฑ์บ้านดำ (อาณาจักรศิลปะโทนดำปรัชญาชีวิตของ อ.ถวัลย์ ดัชนี)',
    'วัดร่องเสือเต้น (วิหารสีน้ำเงินทองวิจิตรงดงาม)',
    'ภูชี้ฟ้า (จุดชมทะเลหมอกและพระอาทิตย์ขึ้นเหนือหน้าผาสุดอลังการ)',
    'ไร่ชาฉุยฟง แม่จัน (ไร่ชาเขียวขั้นบันไดกว้างสุดสายตาและคาเฟ่วิวพาโนรามา)',
    'พระตำหนักดอยตุงและสวนแม่ฟ้าหลวง (สวนดอกไม้เมืองหนาวและโครงการพัฒนาดอยตุง)'
  ],
  unseenGems: [
    'ดอยช้าง (เมืองหลวงกาแฟอาราบิก้าและ Slow Bar คาเฟ่เหนือทะเลหมอก)',
    'หมู่บ้านผาฮี้ (หมู่บ้านชาวอาข่า จิบกาแฟหย่อนขาชมวิวเทือกเขาชายแดนไทย-พม่า)',
    'ภูชี้ดาว & ภูชี้เดือน (สันเขาคมกริบชมทะเลหมอก 360 องศาที่ยังคงความบริสุทธิ์)',
    'สามเหลี่ยมทองคำและหอฝิ่น เชียงแสน (จุดบรรจบ 3 แผ่นดิน ไทย-ลาว-พม่า ริมแม่น้ำโขง)',
    'สิงห์ปาร์ค (Singha Park ฟาร์มทัวร์ ทุ่งดอกไม้ และกิจกรรมแอดเวนเจอร์)'
  ],
  signatureFood: [
    'ขนมจีนน้ำเงี้ยวเชียงราย (เอกลักษณ์ดอกงิ้วและน้ำพริกผัดหอมกรุ่น)',
    'ข้าวแรมฟืนทอดและยำ (อาหารว่างโบราณเอกลักษณ์ชาวไทลื้อ)',
    'ลาบหมูคั่วพริกลาบเมืองเหนือ (หอมกลิ่นมะแขว่นและสมุนไพร)',
    'ยอดใบชาสดทอดกรอบ (เมนูขึ้นชื่อของดอยแม่สลองและไร่ชา)',
    'แกงฮังเลลำไย (รสชาติเปรี้ยวหวานกลมกล่อม)',
    'กาแฟ Specialty ดอยช้าง (Single Origin เอกลักษณ์กลิ่นดอกไม้และฟรุตตี้)'
  ],
  bestMonths: ['พฤศจิกายน', 'ธันวาคม', 'มกราคม', 'กุมภาพันธ์'],
  vibes: [
    'ศิลปะระดับโลก',
    'จิบชาชมไร่ขั้นบันได',
    'กาแฟ Specialty ดอยช้าง',
    'ทะเลหมอกภูชี้ฟ้า 360 องศา',
    'วิถีชีวิตชนเผ่าและวัฒนธรรมล้านนา',
    'สโลว์ไลฟ์ท่ามกลางอากาศหนาว'
  ],
  travelTips: 'หากต้องการขึ้นชมทะเลหมอกที่ภูชี้ฟ้าและภูชี้ดาว ควรออกเดินทางตั้งแต่ตี 4.30 - 5.00 น. เส้นทางขึ้นดอยช้างและดอยผาฮี้คดเคี้ยวลาดชัน ควรใช้รถยนต์ที่มีกำลังเครื่องยนต์เพียงพอและตรวจเช็กระบบเบรกก่อนเดินทาง'
};

const CHIANG_RAI_PRODUCTS = [
  {
    name: 'One Day Trip มหาพุทธศิลป์เชียงราย: วัดร่องขุ่น - บ้านดำ - วัดร่องเสือเต้น - ไร่ชาฉุยฟง',
    description: 'สัมผัสความวิจิตรของศิลปะระดับโลก ผลงานอาจารย์เฉลิมชัยและอาจารย์ถวัลย์ ดัชนี พร้อมแวะจิบชาเขียวสดชื่น ณ ไร่ชาฉุยฟง รวมรถตู้ VIP ไกด์ท้องถิ่น และอาหารกลางวัน',
    price: 1490,
    quantity: 20,
    date: new Date('2026-11-15'),
    tag: 'ทัวร์ศิลปะ',
    province: 'chiang-rai',
    serviceType: 'tour',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'โฮมสเตย์วิวทะเลหมอก ดอยผาฮี้ เชียงราย (รวมกาแฟดริป & ขันโตกมื้อเย็น)',
    description: 'พักผ่อนท่ามกลางไอหมอกและขุนเขาในหมู่บ้านชาวอาข่า จิบกาแฟสดหย่อนขาชมวิวพาโนรามาชายแดน พร้อมสัมผัสวิถีชีวิตเรียบง่ายและอากาศเย็นสบายตลอดปี',
    price: 1800,
    quantity: 5,
    date: new Date('2026-11-20'),
    tag: 'โฮมสเตย์ธรรมชาติ',
    province: 'chiang-rai',
    serviceType: 'stay',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'เวิร์กช็อป Coffee Journey ดอยช้าง: คั่ว ชิม ดริปกาแฟ Specialty 2 วัน 1 คืน',
    description: 'เจาะลึกกระบวนการทำกาแฟระดับโลกบนดอยช้าง ตั้งแต่เก็บเมล็ดกาแฟสุก (Coffee Cherry) การโปรเซส คั่วสด และเรียนรู้การ Cupping กาแฟกับ Q Grader มืออาชีพ',
    price: 3200,
    quantity: 12,
    date: new Date('2026-12-01'),
    tag: 'กิจกรรมและเวิร์กช็อป',
    province: 'chiang-rai',
    serviceType: 'activity',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'เช่ารถ SUV เที่ยวภูชี้ฟ้า - ดอยแม่สลอง พร้อมคนขับชำนาญทางขึ้นดอย',
    description: 'บริการรถยนต์ SUV 4WD พร้อมคนขับผู้ชำนาญเส้นทางภูเขาและจุดชมวิวทะเลหมอก ปลอดภัย สะดวกสบาย ไม่ต้องกังวลเรื่องการขับรถบนทางลาดชัน',
    price: 2500,
    quantity: 3,
    date: new Date('2026-11-25'),
    tag: 'บริการรถนำเที่ยว',
    province: 'chiang-rai',
    serviceType: 'transport',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    isActive: true
  }
];

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
  console.log('⏳ กำลังเชื่อมต่อ MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ เชื่อมต่อ MongoDB สำเร็จ!');

  const db = mongoose.connection.db;
  const colKnowledge = db.collection('provinceknowledges');
  const colProducts = db.collection('products');

  // 1. ตรวจสอบและคำนวณ Vector Embedding สำหรับเชียงราย
  let embeddingVector = null;
  if (API_KEY) {
    console.log('🧠 กำลังคำนวณ 768-dim Vector Embedding ด้วย Gemini API...');
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

      const textToEmbed = [
        `จังหวัด: ${CHIANG_RAI_KNOWLEDGE.nameTh} (${CHIANG_RAI_KNOWLEDGE.nameEn}) ภูมิภาค: ${CHIANG_RAI_KNOWLEDGE.region}`,
        `คำขวัญ: ${CHIANG_RAI_KNOWLEDGE.slogan}`,
        `สรุปภาพรวมและเสน่ห์: ${CHIANG_RAI_KNOWLEDGE.summary}`,
        `สถานที่ท่องเที่ยวไฮไลต์: ${CHIANG_RAI_KNOWLEDGE.highlights.join(', ')}`,
        `จุดเช็กอินลับ Unseen: ${CHIANG_RAI_KNOWLEDGE.unseenGems.join(', ')}`,
        `อาหารท้องถิ่นห้ามพลาด: ${CHIANG_RAI_KNOWLEDGE.signatureFood.join(', ')}`,
        `สไตล์การท่องเที่ยว Vibes: ${CHIANG_RAI_KNOWLEDGE.vibes.join(', ')}`,
        `เดือนที่น่าเที่ยวที่สุด: ${CHIANG_RAI_KNOWLEDGE.bestMonths.join(', ')}`,
        `ทิปส์การเดินทาง: ${CHIANG_RAI_KNOWLEDGE.travelTips}`
      ].join(' | ');

      const res = await embeddingModel.embedContent({
        content: { parts: [{ text: textToEmbed }] },
        outputDimensionality: 768
      });
      embeddingVector = res.embedding.values;
      console.log(`✅ คำนวณ Vector สำเร็จ! ความยาว ${embeddingVector.length} มิติ`);
    } catch (err) {
      console.warn('⚠️ ไม่สามารถคำนวณ Vector ผ่าน Gemini ได้:', err.message);
    }
  } else {
    console.warn('⚠️ ไม่พบ GEMINI_API_KEY จะอัปเดตเฉพาะข้อมูลข้อความ');
  }

  // 2. อัปเดต Province Knowledge ของเชียงราย
  console.log('\n📝 กำลังบันทึกข้อมูลเชิงลึกจังหวัดเชียงรายลง provinceknowledges...');
  const updateData = {
    slogan: CHIANG_RAI_KNOWLEDGE.slogan,
    summary: CHIANG_RAI_KNOWLEDGE.summary,
    highlights: CHIANG_RAI_KNOWLEDGE.highlights,
    unseenGems: CHIANG_RAI_KNOWLEDGE.unseenGems,
    signatureFood: CHIANG_RAI_KNOWLEDGE.signatureFood,
    bestMonths: CHIANG_RAI_KNOWLEDGE.bestMonths,
    vibes: CHIANG_RAI_KNOWLEDGE.vibes,
    travelTips: CHIANG_RAI_KNOWLEDGE.travelTips,
    updatedAt: new Date()
  };

  if (embeddingVector) {
    updateData.embedding = embeddingVector;
    updateData.embeddingModel = 'gemini-embedding-001';
    updateData.embeddingDim = 768;
    updateData.embeddingUpdatedAt = new Date();
  }

  const resultKnowledge = await colKnowledge.updateOne(
    { slug: 'chiang-rai' },
    { $set: updateData },
    { upsert: false }
  );

  console.log(`✅ บันทึกข้อมูลเชียงรายสำเร็จ! (Matched: ${resultKnowledge.matchedCount}, Modified: ${resultKnowledge.modifiedCount})`);

  // 3. เพิ่มสินค้าเชียงราย 4 รายการลงใน products
  console.log('\n🛍️ กำลังเพิ่มสินค้า/แพ็กเกจทัวร์เชียงรายลงใน products...');
  let productsAdded = 0;
  for (const prod of CHIANG_RAI_PRODUCTS) {
    const existing = await colProducts.findOne({ name: prod.name });
    if (!existing) {
      await colProducts.insertOne({
        ...prod,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`  + เพิ่มสินค้า: "${prod.name}" (${prod.price.toLocaleString()} บาท)`);
      productsAdded++;
    } else {
      console.log(`  • สินค้านี้มีอยู่แล้ว: "${prod.name}"`);
    }
  }
  console.log(`✅ จัดการสินค้าเชียงรายเรียบร้อย (เพิ่มใหม่ ${productsAdded} รายการ)`);

  // 4. ทดสอบความแม่นยำด้วย Semantic Search
  if (embeddingVector && API_KEY) {
    console.log('\n🔍 --- ทดสอบ Semantic Vector Search บนข้อมูลใหม่ ---');
    const testQuery = 'อยากไปจิบชาบนดอย ดูงานศิลปะ ชิมขนมจีนน้ำเงี้ยว';
    console.log(`คำค้นหาทดสอบ: "${testQuery}"`);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const qRes = await embeddingModel.embedContent({
      content: { parts: [{ text: testQuery }] },
      outputDimensionality: 768
    });
    const qVec = qRes.embedding.values;

    const allProvinces = await colKnowledge.find({ embedding: { $exists: true } }).toArray();
    const scored = allProvinces.map(p => ({
      nameTh: p.nameTh,
      region: p.region,
      score: cosineSimilarity(qVec, p.embedding)
    })).sort((a, b) => b.score - a.score);

    console.log('\n🏆 ผลลัพธ์ Top 3 จังหวัดที่คะแนนสูงสุด:');
    scored.slice(0, 3).forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.nameTh} (${p.region}) - ความเกี่ยวข้อง: ${(p.score * 100).toFixed(2)}%`);
    });
  }

  await mongoose.disconnect();
  console.log('\n🎉 เสร็จสมบูรณ์ทุกขั้นตอนครับ!');
}

run().catch((err) => {
  console.error('❌ เกิดข้อผิดพลาด:', err);
  process.exit(1);
});
