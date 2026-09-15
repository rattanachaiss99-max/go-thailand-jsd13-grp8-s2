// scripts/embed-and-seed-chunks.mjs
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
  console.log('🚀 เริ่มต้นการประมวลผล Vector Embeddings และบันทึกลง MongoDB Atlas...');

  // 1. อ่าน Environment variables จาก .env
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
      console.warn('⚠️ ไม่สามารถอ่าน .env file:', e.message);
    }
  }

  if (!MONGODB_URI) {
    console.error('❌ ไม่พบ MONGODB_URI ใน .env');
    process.exit(1);
  }
  if (!API_KEY) {
    console.error('❌ ไม่พบ GEMINI_API_KEY ใน .env');
    process.exit(1);
  }

  // 2. อ่านไฟล์ JSON Chunks จาก data/chiang_rai_vector_chunks.json
  const chunksFilePath = path.resolve('../data/chiang_rai_vector_chunks.json');
  if (!fs.existsSync(chunksFilePath)) {
    console.error(`❌ ไม่พบไฟล์ Chunks ที่: ${chunksFilePath}`);
    process.exit(1);
  }
  const chunksData = JSON.parse(fs.readFileSync(chunksFilePath, 'utf-8'));
  console.log(`📦 โหลดข้อมูล Chunks เรียบร้อย: ทั้งหมด ${chunksData.length} Chunks`);

  // 3. เชื่อมต่อ MongoDB Atlas
  console.log('⏳ กำลังเชื่อมต่อ MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ เชื่อมต่อ MongoDB สำเร็จ!');

  const db = mongoose.connection.db;
  const colChunks = db.collection('province_chunks');
  const colKnowledge = db.collection('provinceknowledges');

  // 4. เริ่มต้น Gemini AI Embedding
  const genAI = new GoogleGenerativeAI(API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  // 5. ประมวลผล Embedding และ Upsert ทีละ Chunk
  console.log(`\n🧠 เริ่มประมวลผล 768-dim Vector Embeddings สำหรับ 39 Chunks...`);
  let successCount = 0;

  for (let i = 0; i < chunksData.length; i++) {
    const chunk = chunksData[i];
    const textToEmbed = `[จังหวัด: ${chunk.province_th} | อำเภอ: ${chunk.amphoe_th} | หมวด: ${chunk.category} | ${chunk.title}]\n${chunk.content}`;

    try {
      const res = await embeddingModel.embedContent({
        content: { parts: [{ text: textToEmbed }] },
        outputDimensionality: 768
      });
      const vector = res.embedding.values;

      await colChunks.updateOne(
        { chunkId: chunk.id },
        {
          $set: {
            chunkId: chunk.id,
            province: 'chiang-rai',
            provinceTh: chunk.province_th,
            category: chunk.category,
            subCategory: chunk.sub_category,
            amphoe: chunk.amphoe,
            amphoeTh: chunk.amphoe_th,
            title: chunk.title,
            titleEn: chunk.title_en,
            content: chunk.content,
            metadata: chunk.metadata,
            embedding: vector,
            embeddingModel: 'gemini-embedding-001',
            embeddingDim: 768,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      successCount++;
      process.stdout.write(`\r  ✓ ประมวลผลแล้ว: ${successCount}/${chunksData.length} Chunks (${chunk.id})`);
      
      // หน่วงเวลาเล็กน้อยเพื่อหลีกเลี่ยง Rate limit
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`\n❌ ผิดพลาดใน Chunk ${chunk.id}:`, err.message);
    }
  }

  console.log(`\n✅ บันทึก Chunks ทั้งหมด ${successCount} รายการลง collection "province_chunks" สำเร็จ!`);

  // 6. อัปเดต Master Document ของเชียงรายใน provinceknowledges
  console.log('\n📝 กำลังอัปเดต Master Knowledge ของเชียงรายใน "provinceknowledges"...');
  
  const masterSummary = "จังหวัดเชียงราย ดินแดนเหนือสุดแห่งสยาม อุดมด้วยมหาพุทธศิลป์ วัฒนธรรมล้านนา แหล่งกำเนิดชาอู่หลงและกาแฟดอยช้างระดับโลก ขุนเขาและจุดชมทะเลหมอก 360 องศา ทั้งภูชี้ฟ้า ดอยผาตั้ง ดอยกาดผี และเมืองโบราณเชียงแสนริมแม่น้ำโขง";
  const masterHighlights = [
    "วัดร่องขุ่น (มหาพุทธศิลป์สีขาวบริสุทธิ์ของ อ.เฉลิมชัย โฆษิตพิพัฒน์)",
    "พิพิธภัณฑ์บ้านดำ (อาณาจักรศิลปะล้านนาโทนดำของ อ.ถวัลย์ ดัชนี)",
    "พระตำหนักดอยตุง สวนแม่ฟ้าหลวง และพระธาตุดอยตุง",
    "ภูชี้ฟ้า (ยอดผาชมทะเลหมอกและพระอาทิตย์ขึ้น 1,628 ม. อ.เทิง)",
    "ดอยแม่สลอง ชุมชนบ้านสันติคีรี อดีตกองพล 93 และไร่ชาอู่หลง",
    "สามเหลี่ยมทองคำ สบรวก และหอฝิ่น อ.เชียงแสน",
    "วัดพระแก้ว เชียงราย และหอพระหยก",
    "วนอุทยานถ้ำหลวง-ขุนน้ำนางนอน อ.แม่สาย"
  ];
  const masterUnseen = [
    "ดอยช้าง & ดอยวาวี (แหล่งกาแฟ Specialty และต้นชาพันปี)",
    "ดอยกาดผี (จุดชมวิวทะเลหมอกพาโนรามา 360 องศา)",
    "วัดถ้ำป่าอาชาทอง (พระภิกษุและสามเณรขี่ม้าบิณฑบาต)",
    "ดอยผาตั้ง (ช่องผาบ่อง และจุดชมวิว 103 ชายแดนไทย-ลาว)",
    "แก่งผาได เวียงแก่น (จุดสุดท้ายของแม่น้ำโขงในไทย)",
    "เมืองโบราณเวียงกาหลง (แหล่งเตาเผาเครื่องเคลือบดินเผาโบราณ)"
  ];
  const masterSignatureFood = [
    "ขนมจีนน้ำเงี้ยวเชียงราย (น้ำเงี้ยวป้าสุข)",
    "ข้าวซอยไก่/เนื้อสูตรดั้งเดิม (ข้าวซอยพอใจ, ข้าวซอยอนงค์)",
    "อาหารจีนยูนนาน ขาหมูหมั่นโถวบนดอยแม่สลองและดอยผาตั้ง",
    "กาแฟ Single Origin ดอยช้าง และชาอู่หลงดอยแม่สลอง",
    "เมนูปลาบึกและปลาน้ำจืดแม่น้ำโขง เชียงแสน-เชียงของ",
    "สับปะรดนางแล และ สับปะรดภูแล เชียงราย"
  ];
  const masterTravelTips = "การเดินทาง: รถยนต์ใช้ ทล. 11 ต่อ ทล. 1 (785 กม.) หรือเส้นทางวนรอบ ทล. 118 ผ่านเชียงใหม่; มีเที่ยวบินตรงลงสนามบินแม่ฟ้าหลวง (CEI); รถสองแถววิ่งเชื่อม บขส. 1 (ไนท์บาซาร์) และ บขส. 2 ค่าบริการ 10 บาท; ชมทะเลหมอกภูชี้ฟ้าควรถึงลานจอดก่อน 05.30 น.";

  const masterTextToEmbed = [
    `จังหวัด: เชียงราย (Chiang Rai) ภูมิภาค: ภาคเหนือ (north)`,
    `คำขวัญ: เหนือสุดในสยาม ชายแดนสามแผ่นดิน ชมนางนอน ดอยแม่สลอง ชาเลิศล้ำ วัฒนธรรมล้านนา`,
    `สรุปภาพรวม: ${masterSummary}`,
    `สถานที่ท่องเที่ยวไฮไลต์: ${masterHighlights.join(', ')}`,
    `จุดเช็กอิน Unseen: ${masterUnseen.join(', ')}`,
    `อาหารท้องถิ่นห้ามพลาด: ${masterSignatureFood.join(', ')}`,
    `ทิปส์การเดินทาง: ${masterTravelTips}`
  ].join(' | ');

  const masterEmbedRes = await embeddingModel.embedContent({
    content: { parts: [{ text: masterTextToEmbed }] },
    outputDimensionality: 768
  });
  const masterVector = masterEmbedRes.embedding.values;

  await colKnowledge.updateOne(
    { slug: 'chiang-rai' },
    {
      $set: {
        summary: masterSummary,
        highlights: masterHighlights,
        unseenGems: masterUnseen,
        signatureFood: masterSignatureFood,
        travelTips: masterTravelTips,
        embedding: masterVector,
        embeddingModel: 'gemini-embedding-001',
        embeddingDim: 768,
        embeddingUpdatedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
  console.log('✅ อัปเดต Master Knowledge เชียงราย พร้อม Vector 768 มิติ เรียบร้อย!');

  // 7. ทำการทดสอบ Vector Semantic Search บน Chunks เชิงลึก
  console.log('\n🔍 --- ทดสอบ Semantic Vector Search บน province_chunks (39 Chunks) ---');
  
  const testQueries = [
    "อยากนั่งเรือล่องแม่น้ำกก หรือ นั่งช้างชมหมู่บ้าน ต้องติดต่อใครและราคาเท่าไหร่",
    "แนะนำที่พักบนภูชี้ฟ้าหรือดอยผาตั้งที่รวมอาหาร",
    "ประวัติของวัดร่องขุ่น และอาจารย์เฉลิมชัย"
  ];

  for (const q of testQueries) {
    console.log(`\n📌 คำค้นหา: "${q}"`);
    const qEmbed = await embeddingModel.embedContent({
      content: { parts: [{ text: q }] },
      outputDimensionality: 768
    });
    const qVec = qEmbed.embedding.values;

    const allDbChunks = await colChunks.find({ embedding: { $exists: true } }).toArray();
    const scoredChunks = allDbChunks.map(c => ({
      chunkId: c.chunkId,
      title: c.title,
      category: c.category,
      amphoe: c.amphoeTh,
      score: cosineSimilarity(qVec, c.embedding)
    })).sort((a, b) => b.score - a.score);

    console.log('  ผลลัพธ์ Top 2 Chunks ที่ตรงที่สุด:');
    scoredChunks.slice(0, 2).forEach((c, idx) => {
      console.log(`    ${idx + 1}. [${(c.score * 100).toFixed(2)}%] ${c.title} (${c.amphoe})`);
    });
  }

  await mongoose.disconnect();
  console.log('\n🎉 สำเร็จทุกขั้นตอน! ข้อมูลเชียงรายทั้งระดับ Master และ Granular Chunks พร้อมใช้งานในระบบทันที');
}

run().catch((err) => {
  console.error('❌ เกิดข้อผิดพลาด:', err);
  process.exit(1);
});
