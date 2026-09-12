// scripts/test-rag-advisor-live.mjs
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testFullRAG() {
  const uri = process.env.MONGODB_URI;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  console.log('⏳ เชื่อมต่อ MongoDB Atlas...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const col = db.collection('provinceknowledges');

  const userQuery = 'อยากไปเที่ยวทะเล ดำน้ำดูปะการัง ทะเลเงียบๆ อาหารอร่อย แนะนำจังหวัดไหนดีครับ';
  console.log(`\n💬 ผู้ใช้ถาม: "${userQuery}"`);

  // 1. Semantic Retrieval from MongoDB
  console.log('🔍 กำลังค้นหาข้อมูลจาก MongoDB 77 จังหวัด...');
  const candidates = await col.find({
    $or: [
      { highlights: { $regex: 'ดำน้ำ|ปะการัง|เกาะ', $options: 'i' } },
      { unseenGems: { $regex: 'ดำน้ำ|ปะการัง|เกาะ', $options: 'i' } },
      { vibes: { $regex: 'ทะเลและหมู่เกาะ', $options: 'i' } }
    ]
  }).limit(3).toArray();

  console.log(`✅ พบจังหวัดที่ตรงกัน ${candidates.length} จังหวัด:`);
  candidates.forEach(c => console.log(`  - ${c.nameTh} (${c.nameEn}) [${c.region}]`));

  // 2. Format Context
  const contextText = candidates.map((p, idx) =>
    `จังหวัดที่ ${idx + 1}: ${p.nameTh} (${p.nameEn}) [รหัส: ${p.provinceId}, ภาค: ${p.region}]
- สรุปเสน่ห์: ${p.summary}
- สถานที่ท่องเที่ยวสำคัญ: ${p.highlights.join(', ')}
- Unseen จุดเช็กอินลับ: ${p.unseenGems.join(', ')}
- เมนูอาหารท้องถิ่นห้ามพลาด: ${p.signatureFood.join(', ')}
- ช่วงเวลาที่เหมาะเที่ยว: ${p.bestMonths.join(', ')}
- สไตล์/Vibes: ${p.vibes.join(', ')}`
  ).join('\n\n');

  // 3. Generate via Gemini
  console.log('\n🤖 กำลังส่ง Context ให้ Google Gemini (gemini-flash-latest) สังเคราะห์คำแนะนำ...');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `คุณคือ "Go Thailand AI Travel Copilot" ผู้เชี่ยวชาญการท่องเที่ยวประเทศไทยประจำแพลตฟอร์ม Go Thailand
โจทย์คำถามของผู้ใช้งาน: "${userQuery}"

ข้อมูลบริบทจากฐานข้อมูล 77 จังหวัดของเรา (Knowledge Base):
${contextText}

คำแนะนำในการตอบ:
1. ตอบด้วยภาษาไทยที่สุภาพ เป็นกันเอง มีชีวิตชีวา และสร้างแรงบันดาลใจในการเดินทาง (ใส่ Emoji ให้สวยงามน่าอ่าน)
2. สรุปคำแนะนำทริปให้ตรงกับความต้องการของผู้ใช้ โดยดึงจุดเด่น, แหล่งท่องเที่ยว Unseen และเมนูอาหารท้องถิ่นของจังหวัดที่เลือกมาเล่าให้เห็นภาพ
3. ระบุชื่อจังหวัดที่เป็นไฮไลต์แนะนำหลักให้ชัดเจน (เช่น **จังหวัดภูเก็ต**, **จังหวัดกระบี่**) เพื่อให้ระบบแผนที่สามารถไฮไลต์ได้
4. ให้คำแนะนำช่วงเวลาท่องเที่ยวที่ดีที่สุด (Best season) และทิปส์การเดินทางสั้นๆ ที่เป็นประโยชน์`;

  const result = await model.generateContent(prompt);
  console.log('\n✨ คำตอบจาก Go Thailand AI Travel Copilot:\n');
  console.log(result.response.text());

  await mongoose.disconnect();
}

testFullRAG().catch(console.error);
