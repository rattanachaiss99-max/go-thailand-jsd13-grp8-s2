// scripts/generate-province-embeddings.mjs
// บันทึก AI Vector Embeddings (768 dimensions) ครบทั้ง 77 จังหวัดลง MongoDB Atlas
// รันด้วย: node --env-file=.env scripts/generate-province-embeddings.mjs

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

let MONGODB_URI = process.env.MONGODB_URI;
let API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!MONGODB_URI || !API_KEY) {
  try {
    const envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
    const mUri = envContent.match(/MONGODB_URI=(.+)/);
    if (mUri) MONGODB_URI = mUri[1].trim().replace(/^["']|["']$/g, '');
    const mKey = envContent.match(/(?:GEMINI_API_KEY|GOOGLE_API_KEY)=(.+)/);
    if (mKey) API_KEY = mKey[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}

if (!MONGODB_URI || !API_KEY) {
  console.error('❌ ขาด MONGODB_URI หรือ GEMINI_API_KEY ใน .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

async function run() {
  console.log('⏳ กำลังเชื่อมต่อ MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ เชื่อมต่อสำเร็จ!');

  const col = mongoose.connection.db.collection('provinceknowledges');
  const provinces = await col.find({}).toArray();
  console.log(`📦 พบข้อมูลจังหวัดทั้งหมด ${provinces.length} จังหวัด`);

  let successCount = 0;

  for (let i = 0; i < provinces.length; i++) {
    const p = provinces[i];
    const textToEmbed = [
      `จังหวัด: ${p.nameTh} (${p.nameEn}) ภูมิภาค: ${p.region}`,
      `คำขวัญ: ${p.slogan || ''}`,
      `สรุปภาพรวมและเสน่ห์: ${p.summary || ''}`,
      `สถานที่ท่องเที่ยวไฮไลต์: ${(p.highlights || []).join(', ')}`,
      `จุดเช็กอินลับ Unseen: ${(p.unseenGems || []).join(', ')}`,
      `อาหารท้องถิ่นห้ามพลาด: ${(p.signatureFood || []).join(', ')}`,
      `สไตล์การท่องเที่ยว Vibes: ${(p.vibes || []).join(', ')}`,
      `เดือนที่น่าเที่ยวที่สุด: ${(p.bestMonths || []).join(', ')}`,
      `ทิปส์การเดินทาง: ${p.travelTips || ''}`
    ].join(' | ');

    try {
      const res = await embeddingModel.embedContent({
        content: { parts: [{ text: textToEmbed }] },
        outputDimensionality: 768
      });

      const vectorValues = res.embedding.values;

      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            embedding: vectorValues,
            embeddingModel: 'gemini-embedding-001',
            embeddingDim: 768,
            embeddingUpdatedAt: new Date()
          }
        }
      );

      successCount++;
      process.stdout.write(`\r[${i + 1}/${provinces.length}] บันทึกเวกเตอร์: ${p.nameTh} (768 dims) ✅`);

      // หน่วงเวลาเล็กน้อยเพื่อป้องกัน Rate limit
      await new Promise(r => setTimeout(r, 120));
    } catch (err) {
      console.error(`\n❌ ผิดพลาดที่จังหวัด ${p.nameTh}:`, err.message);
    }
  }

  console.log(`\n\n🎉 เสร็จสมบูรณ์! สร้างและบันทึก Vector Embeddings สำเร็จ ${successCount}/${provinces.length} จังหวัด`);
  await mongoose.disconnect();
}

run().catch(console.error);
