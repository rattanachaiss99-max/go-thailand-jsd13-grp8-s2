// scripts/test-semantic-search.mjs
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

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

const genAI = new GoogleGenerativeAI(API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function testSemanticSearch() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('provinceknowledges');
  const all = await col.find({ embedding: { $exists: true } }, { projection: { nameTh: 1, nameEn: 1, region: 1, summary: 1, embedding: 1 } }).toArray();
  
  const query = 'อยากสัมผัสอากาศหนาว ชมแม่คะนิ้ง เดินป่าขึ้นดอย ดื่มกาแฟชิวๆ';
  console.log('Query:', query);
  
  const res = await embeddingModel.embedContent({
    content: { parts: [{ text: query }] },
    outputDimensionality: 768
  });
  const qVec = res.embedding.values;
  
  const scored = all.map(p => ({
    nameTh: p.nameTh,
    region: p.region,
    score: cosineSimilarity(qVec, p.embedding)
  })).sort((a, b) => b.score - a.score);
  
  console.log('\nTop 5 Matched Provinces:');
  scored.slice(0, 5).forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.nameTh} (${p.region}) - Similarity: ${(p.score * 100).toFixed(2)}%`);
  });
  
  await mongoose.disconnect();
}

testSemanticSearch().catch(console.error);
