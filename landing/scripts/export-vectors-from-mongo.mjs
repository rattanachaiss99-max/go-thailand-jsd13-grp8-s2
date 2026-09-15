import fs from 'fs';
import path from 'path';
import mongoose from '../car-service/node_modules/mongoose/index.js';

const uri = 'mongodb://rattanachaiss99_db_user:toUigmhsuszJeBTa@ac-d7hbbcc-shard-00-00.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-01.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-02.ms885cg.mongodb.net:27017/gothailand_user?ssl=true&replicaSet=atlas-rnbrym-shard-0&authSource=admin&appName=Cluster0';

async function dump() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('provinceknowledges');
  const docs = await col.find(
    { 'vectorData.d': { $exists: true } },
    { projection: { provinceId: 1, slug: 1, nameTh: 1, nameEn: 1, region: 1, vectorData: 1, _id: 0 } }
  ).toArray();

  console.log('Fetched provinces with vectorData from MongoDB:', docs.length);
  
  const map = {};
  for (const d of docs) {
    map[d.slug] = {
      slug: d.slug,
      provinceId: d.provinceId,
      nameTh: d.nameTh,
      nameEn: d.nameEn,
      region: d.region,
      viewBox: d.vectorData.viewBox,
      width: d.vectorData.width,
      height: d.vectorData.height,
      d: d.vectorData.d
    };
  }

  const outDir = path.resolve('scripts/data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'provinces-svg.json'), JSON.stringify(map, null, 2), 'utf8');
  console.log(`Saved ${Object.keys(map).length} provinces to landing/scripts/data/provinces-svg.json!`);
  await mongoose.disconnect();
}

dump().catch(console.error);
