import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}

async function check() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('provinceknowledges');
  
  const count = await col.countDocuments();
  const withVector = await col.countDocuments({ 'vectorData.d': { $exists: true } });
  const sample = await col.findOne({ 'vectorData.d': { $exists: true } }, { projection: { nameTh: 1, slug: 1, vectorData: 1 } });
  
  let stats = null;
  try {
    stats = await db.command({ collStats: 'provinceknowledges' });
  } catch (e) {
    // some Atlas tier restrictions
  }

  console.log('--- MongoDB Province Vector Stats ---');
  console.log('Total documents in provinceknowledges:', count);
  console.log('Documents with SVG vectorData:', withVector);
  if (stats) {
    console.log('Data Size (uncompressed):', (stats.size / 1024).toFixed(2), 'KB');
    console.log('Storage Size (on disk / WiredTiger compressed):', (stats.storageSize / 1024).toFixed(2), 'KB');
    console.log('Average Document Size:', stats.avgObjSize ? (stats.avgObjSize).toFixed(0) + ' bytes' : 'N/A');
    console.log('Total Index Size:', (stats.totalIndexSize / 1024).toFixed(2), 'KB');
  }
  if (sample) {
    console.log(`Sample: "${sample.nameTh}" (${sample.slug}) | path d length:`, sample.vectorData?.d?.length, 'chars');
  }

  await mongoose.disconnect();
}

check().catch(console.error);
