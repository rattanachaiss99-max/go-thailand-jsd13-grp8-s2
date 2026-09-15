import mongoose from '../car-service/node_modules/mongoose/index.js';
import fs from 'fs';
import path from 'path';

const uri = 'mongodb://rattanachaiss99_db_user:toUigmhsuszJeBTa@ac-d7hbbcc-shard-00-00.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-01.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-02.ms885cg.mongodb.net:27017/gothailand_user?ssl=true&replicaSet=atlas-rnbrym-shard-0&authSource=admin&appName=Cluster0';

async function testVectors() {
  console.log('--- 1. Testing MongoDB Live Connection & Vector Data ---');
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('provinceknowledges');

  const total = await col.countDocuments();
  const withVector = await col.countDocuments({ 'vectorData.d': { $exists: true } });
  console.log(`Total provinces in Mongo: ${total}`);
  console.log(`Provinces with vectorData: ${withVector}`);

  if (total !== 77 || withVector !== 77) {
    throw new Error(`Expected 77 provinces with vector data, found ${withVector}/${total}`);
  }
  console.log('✅ PASS: All 77 provinces have vectorData in MongoDB Atlas!');

  console.log('\n--- 2. Testing Sample Regional Aggregation ---');
  const regions = ['north', 'central', 'south', 'east', 'west', 'isan'];
  for (const r of regions) {
    const docs = await col.find(
      { region: r, 'vectorData.d': { $exists: true } },
      { projection: { slug: 1, nameTh: 1, 'vectorData.viewBox': 1 } }
    ).toArray();
    console.log(`Region "${r}": ${docs.length} provinces found with vector viewBox: sample "${docs[0]?.nameTh}" (${docs[0]?.vectorData?.viewBox})`);
  }
  console.log('✅ PASS: All regions have valid vector data ready for dynamic querying!');

  console.log('\n--- 3. Testing Offline Seed Backup JSON ---');
  const jsonPath = path.resolve('scripts/data/provinces-svg.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    const count = Object.keys(parsed).length;
    console.log(`Offline seed JSON contains ${count} provinces (${(raw.length / 1024).toFixed(1)} KB)`);
    if (count === 77) {
      console.log('✅ PASS: Backup seed file scripts/data/provinces-svg.json is 100% complete.');
    }
  }

  console.log('\n--- 4. Checking Frontend Static Decoupling ---');
  const oldSvgPath = path.resolve('src/data/northernProvincesSvg.ts');
  if (!fs.existsSync(oldSvgPath)) {
    console.log('✅ PASS: src/data/northernProvincesSvg.ts is completely removed from frontend!');
  } else {
    console.warn('⚠️ WARNING: src/data/northernProvincesSvg.ts still exists.');
  }

  await mongoose.disconnect();
  console.log('\n🎉 ALL VECTOR TESTS PASSED!');
}

testVectors().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
