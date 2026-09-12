// scripts/seed-province-knowledge.ts
// บันทึกฐานข้อมูลเชิงลึก 77 จังหวัด (Province Knowledge Base) + ข้อมูล Vector ลง MongoDB Atlas
// รันด้วย: npx tsx --env-file=.env scripts/seed-province-knowledge.ts

import mongoose from 'mongoose';
import { THAILAND_PROVINCES, Province } from '../src/data/thailandProvinces';
import { PROVINCES_SVG_DATA } from '../src/data/northernProvincesSvg';
import ProvinceKnowledge from '../src/server/models/ProvinceKnowledge';

// ข้อมูลเชิงลึกตัวอย่างตามภูมิภาคเพื่อเสริมมิติข้อมูลการท่องเที่ยว
const REGION_VIBES_MAP: Record<string, { vibes: string[]; bestMonths: string[]; defaultTips: string }> = {
  north: {
    vibes: ['ทะเลหมอกและขุนเขา', 'วัฒนธรรมล้านนา', 'สโลว์ไลฟ์', 'โฮมสเตย์กาแฟดอย', 'ศิลปวัฒนธรรม'],
    bestMonths: ['พฤศจิกายน', 'ธันวาคม', 'มกราคม', 'กุมภาพันธ์'],
    defaultTips: 'แนะนำเดินทางช่วงฤดูหนาวและปลายฝนต้นหนาว เตรียมเสื้อกันหนาวสำหรับการขึ้นดอยสูง'
  },
  isan: {
    vibes: ['อารยธรรมขอมและประวัติศาสตร์', 'ธรรมชาติริมแม่น้ำโขง', 'สายมูเตลูและพญานาค', 'อาหารอีสานแซ่บเวอร์', 'ประเพณีท้องถิ่น'],
    bestMonths: ['ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม', 'กุมภาพันธ์'],
    defaultTips: 'เหมาะแก่การขับรถท่องเที่ยวแบบ Road Trip เลียบแม่น้ำโขง ไหว้พระธาตุประจำวันเกิด และชิมอาหารพื้นเมือง'
  },
  central: {
    vibes: ['มรดกโลกและประวัติศาสตร์', 'ตลาดน้ำและวิถีริมคลอง', 'คาเฟ่ชิคๆ', 'ไหว้พระ 9 วัด', 'ทริปครอบครัวใกล้กรุง'],
    bestMonths: ['ตลอดทั้งปี', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม'],
    defaultTips: 'เหมาะสำหรับทริปวันเดย์ทริปและพักผ่อน 2 วัน 1 คืน เดินทางสะดวกจากกรุงเทพฯ'
  },
  south: {
    vibes: ['ทะเลและหมู่เกาะระดับโลก', 'ดำน้ำดูปะการัง', 'อาหารใต้รสจัดจ้าน', 'เมืองเก่าชิโนโปรตุกีส', 'ธรรมชาติป่าดงดิบ'],
    bestMonths: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน'],
    defaultTips: 'ฝั่งอันดามันเหมาะเที่ยวช่วง พ.ย. - เม.ย. ฝั่งอ่าวไทยเหมาะเที่ยวช่วง พ.ค. - ก.ย.'
  },
  east: {
    vibes: ['ชายหาดและเกาะสวย', 'สวรรค์ของผลไม้ฤดูร้อน', 'อาหารทะเลสดใหม่', 'กิจกรรมแอดเวนเจอร์ทางน้ำ'],
    bestMonths: ['พฤศจิกายน', 'ธันวาคม', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน'],
    defaultTips: 'เดินทางง่ายจากกรุงเทพฯ พลาดไม่ได้กับเทศกาลผลไม้ ทุเรียน เงาะ สละ ช่วงเดือนพฤษภาคม-มิถุนายน'
  },
  west: {
    vibes: ['ขุนเขาและสายน้ำ', 'ประวัติศาสตร์สะพานข้ามแม่น้ำแคว', 'นอนแพริมน้ำ', 'ฟาร์มสไตล์ยุโรป', 'แช่น้ำแร่ธรรมชาติ'],
    bestMonths: ['ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม'],
    defaultTips: 'เหมาะสำหรับการพักผ่อนรีชาร์จพลังท่ามกลางป่าเขาและแม่น้ำ ล่องแพเปียก และชมธรรมชาติอุทยานแห่งชาติ'
  }
};

// จุดเด่นและอาหารเฉพาะของจังหวัดสำคัญ
const PROVINCE_SPECIFIC_MAP: Record<
  string,
  {
    slogan?: string;
    summary?: string;
    unseenGems: string[];
    signatureFood: string[];
    extraVibes?: string[];
  }
> = {
  bangkok: {
    slogan: 'กรุงเทพฯ ดุจเทพสร้าง เมืองศูนย์กลางการปกครอง วัดวังงามเรืองรอง เมืองหลวงของประเทศไทย',
    summary: 'มหานครแห่งสีสัน ผสมผสานวัดวาอารามอันวิจิตร สตรีทฟู้ดระดับโลก และห้างสรรพสินค้าริมแม่น้ำเจ้าพระยา',
    unseenGems: ['ชุมชนกุฎีจีน', 'ตลาดน้อย เจริญกรุง', 'สวนลอยฟ้าเจ้าพระยา', 'คลองโอ่งอ่าง'],
    signatureFood: ['ผัดไทยประตูผี', 'กวยจั๊บเยาวราช', 'ข้าวแช่ชาววัง', 'ต้มยำกุ้งแม่น้ำ'],
    extraVibes: ['สตรีทฟู้ดระดับโลก', 'แสงสียามค่ำคืน', 'ช้อปปิ้ง', 'ไหว้พระวัดดัง']
  },
  phuket: {
    slogan: 'ไข่มุกอันดามัน สวรรค์เมืองใต้ หาดทรายสีทอง สองวีรสตรี เลื่องลือวัฒนธรรมเพอรานากัน',
    summary: 'เกาะสวรรค์ระดับโลก โดดเด่นด้วยหาดทรายขาว น้ำทะเลใส เมืองเก่าสถาปัตยกรรมชิโนโปรตุกีส และอาหารพื้นเมืองรางวัลมิชลิน',
    unseenGems: ['แหลมกระทิง', 'หาดกล้วย (Banana Beach)', 'สะพานสารสินยามอาทิตย์อัสดง', 'ผาหินดำ'],
    signatureFood: ['หมูฮ้อง', 'โอวต้าว', 'โลบะ', 'ติ่มซำภูเก็ต', 'น้ำพริกกุ้งเสียบ', 'โอ้เอ๋ว'],
    extraVibes: ['เกาะสวรรค์ระดับโลก', 'อาหารมิชลิน', 'ย่านเมืองเก่า', 'เซิร์ฟบอร์ดและบีชคลับ']
  },
  'chiang-mai': {
    slogan: 'ดอยสุเทพเป็นศรี ประเพณีเป็นสง่า บุปผาชาติตระการตา นามระบือล้ำ ค่านครพิงค์',
    summary: 'ศูนย์กลางวัฒนธรรมล้านนา โอบล้อมด้วยเทือกเขาสูง คาเฟ่ระดับสากล และธรรมชาติอันเงียบสงบในทุกฤดูกาล',
    unseenGems: ['บ้านแม่แมะ เชียงดาว', 'น้ำตกบัวตอง', 'ขุนแปะ', 'ห้วยกุ๊บกั๊บ'],
    signatureFood: ['ข้าวซอยไก่', 'ไส้อั่วสมุนไพร', 'น้ำพริกหนุ่ม-แคบหมู', 'แกงฮังเล'],
    extraVibes: ['คาเฟ่ฮอปปิ้ง', 'ยอดดอยหนาว', 'เดินป่าธรรมชาติ', 'งานคราฟต์และศิลปะ']
  },
  krabi: {
    slogan: 'กระบี่ เมืองน่าอยู่ ผู้คนน่ารัก แหล่งหอยหวาน หาดทรายงาม ปะการังใต้ทะเล',
    summary: 'ดินแดนแห่งหน้าผาหินปูน มหัศจรรย์ทะเลแหวก สระมรกต และเกาะแก่งธรรมชาติที่สวยงามติดอันดับโลก',
    unseenGems: ['แหลมจมูกควาย', 'คลองน้ำใสหนองทะเล', 'อ่าวท่าเลน พายคายัค', 'เขาหงอนนาค'],
    signatureFood: ['หอยชักตีนลวกจิ้ม', 'ขนมจีนน้ำยาปู', 'โรตีกรอบกระบี่'],
    extraVibes: ['ปีนผาไร่เลย์', 'พายคายัคป่าโกงกาง', 'ทะเลแหวก', 'สระมรกตธรรมชาติ']
  },
  'chon-buri': {
    slogan: 'ทะเลงาม ข้าวหลามอร่อย อ้อยหวาน จักสานดี ประเพณีวิ่งควาย',
    summary: 'เมืองท่องเที่ยวชายทะเลครบวงจร พัทยา บางแสน เกาะล้าน และสวนน้ำระดับสากล เหมาะกับทุกเพศทุกวัย',
    unseenGems: ['เกาะขาม สัตหีบ', 'แกรนด์แคนยอนชลบุรี', 'อ่างเก็บน้ำบางพระ', 'เกาะแสมสาร'],
    signatureFood: ['ข้าวหลามหนองมน', 'หอยจ๊อปูแม่วรรณา', 'แจงลอนปิ้ง', 'อาหารทะเลอ่างศิลา'],
    extraVibes: ['ปาร์ตี้ริมหาด', 'ดำน้ำเกาะแสมสาร', 'คาเฟ่ริมทะเล', 'สวนน้ำสวนสนุก']
  },
  kanchanaburi: {
    slogan: 'แคว้นโบราณ ด่านเจดีย์ มณีเมืองกาญจน์ สะพานข้ามแม่น้ำแคว แหล่งแร่น้ำตก',
    summary: 'มนต์เสน่ห์แห่งสายน้ำแคว ขุนเขาชายแดนตะวันตก ประวัติศาสตร์สงครามโลก และวิถีชีวิตชาวมอญสังขละบุรี',
    unseenGems: ['น้ำตกเอราวัณชั้น 7', 'เหมืองปิล็อก บ้านอีต่อง', 'สะพานมอญสังขละบุรี', 'ทางรถไฟสายมรณะถ้ำกระแซ'],
    signatureFood: ['แกงป่าเมืองกาญจน์', 'ปลาคังลวกจิ้ม', 'ทองม้วนสด', 'เห็ดโคน'],
    extraVibes: ['นอนแพริมน้ำ', 'เดินป่าขึ้นเขาช้างเผือก', 'สะพานมอญยามเช้า', 'แคมป์ปิ้งริมเขื่อน']
  },
  'nakhon-ratchasima': {
    slogan: 'เมืองหญิงกล้า ผ้าไหมดี หมี่โคราช ปราสาทหิน ดินด่านเกวียน',
    summary: 'ประตูสู่อีสาน แหล่งโอโซนบริสุทธิ์อันดับ 7 ของโลกที่เขาใหญ่ วังน้ำเขียว และมรดกประวัติศาสตร์พิมาย',
    unseenGems: ['ผาเก็บตะวัน วังน้ำเขียว', 'น้ำผุดธรรมชาติปากช่อง', 'เขายายเที่ยงกังหันลม', 'ปราสาทหินพิมาย'],
    signatureFood: ['ผัดหมี่โคราช', 'ส้มตำโคราช', 'ไก่ย่างด่านขุนทด', 'ไส้กรอกอีสานปากช่อง'],
    extraVibes: ['แกลมปิ้งเขาใหญ่', 'ชมสวนดอกไม้', 'ปั่นจักรยานรับลมหนาว', 'ไหว้ท้าวสุรนารี']
  },
  nan: {
    slogan: 'แข่งเรือลือเลื่อง เมืองงาช้างดำ จิตรกรรมวัดภูมินทร์ แดนดินส้มสีทอง ชวนมองธรรมชาติ',
    summary: 'เมืองสโลว์ไลฟ์กลางหุบเขา อุ่นไอวัฒนธรรมกระซิบรักบันลือโลก และถนนลอยฟ้าที่สวยที่สุดแห่งหนึ่งในไทย',
    unseenGems: ['ดอยสกาด ปัว', 'หมู่บ้านสะปัน บ่อเกลือ', 'ถนนลอยฟ้าหมายเลข 3', 'ดอยเสมอดาว'],
    signatureFood: ['ไก่ทอดมะแขว่น', 'ข้าวซอยน้ำหน้า', 'แกงแคไก่บ้าน'],
    extraVibes: ['กระซิบรักวัดภูมินทร์', 'นาข้าวขั้นบันได', 'กาแฟดอยชมหมอก', 'ถนนลอยฟ้า']
  }
};

async function seedProvinceKnowledge() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('กรุณาตั้ง MONGODB_URI ในไฟล์ .env');
  }

  console.log('⏳ กำลังเชื่อมต่อ MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ เชื่อมต่อ MongoDB สำเร็จ');

  console.log('📦 กำลังจัดเตรียมข้อมูลเชิงลึก 77 จังหวัด...');

  let count = 0;
  for (const prov of THAILAND_PROVINCES) {
    const regionInfo = REGION_VIBES_MAP[prov.region] || REGION_VIBES_MAP.central;
    const specific = PROVINCE_SPECIFIC_MAP[prov.slug] || {};

    // Get exact vector path data from PROVINCES_SVG_DATA
    const svgData = PROVINCES_SVG_DATA[prov.slug] || PROVINCES_SVG_DATA[prov.slug.replace(/-/g, '')];

    const highlights = prov.popularDestinations && prov.popularDestinations.length > 0
      ? prov.popularDestinations
      : [`แหล่งท่องเที่ยวใจกลางเมือง ${prov.nameTh}`, `จุดชมวิวธรรมชาติ ${prov.nameTh}`];

    const unseenGems = specific.unseenGems && specific.unseenGems.length > 0
      ? specific.unseenGems
      : [`วัดศักดิ์สิทธิ์ประจำจังหวัด ${prov.nameTh}`, `ตลาดท้องถิ่นวิถีชุมชน ${prov.nameTh}`, `จุดชมวิวพระอาทิตย์ขึ้น ${prov.nameTh}`];

    const signatureFood = specific.signatureFood && specific.signatureFood.length > 0
      ? specific.signatureFood
      : [`อาหารพื้นบ้านประจำจังหวัด ${prov.nameTh}`, `ของฝากขึ้นชื่อ ${prov.nameTh}`];

    const vibes = Array.from(
      new Set([
        ...regionInfo.vibes,
        ...(specific.extraVibes || []),
        `#${prov.nameTh}`,
        `#เที่ยว${prov.nameTh}`
      ])
    );

    const summary = specific.summary || `จังหวัด ${prov.nameTh} (${prov.nameEn}) ตั้งอยู่ใน${prov.region === 'north' ? 'ภาคเหนือ' : prov.region === 'south' ? 'ภาคใต้' : prov.region === 'isan' ? 'ภาคอีสาน' : prov.region === 'east' ? 'ภาคตะวันออก' : prov.region === 'west' ? 'ภาคตะวันตก' : 'ภาคกลาง'}ของประเทศไทย มีเสน่ห์เฉพาะตัวด้านธรรมชาติ วัฒนธรรมท้องถิ่น และสถานที่ท่องเที่ยวที่หลากหลาย`;

    const docData: Record<string, unknown> = {
      provinceId: prov.id,
      slug: prov.slug,
      nameTh: prov.nameTh,
      nameEn: prov.nameEn,
      region: prov.region,
      slogan: specific.slogan || `ยินดีต้อนรับสู่จังหวัด ${prov.nameTh}`,
      summary,
      highlights,
      unseenGems,
      signatureFood,
      bestMonths: regionInfo.bestMonths,
      vibes,
      travelTips: specific.summary ? `${regionInfo.defaultTips}` : regionInfo.defaultTips,
    };

    if (svgData) {
      docData.vectorData = {
        viewBox: svgData.viewBox,
        width: svgData.width,
        height: svgData.height,
        d: svgData.d
      };
    }

    // Upsert into MongoDB
    await ProvinceKnowledge.findOneAndUpdate(
      { slug: prov.slug },
      { $set: docData },
      { upsert: true, new: true }
    );

    count++;
  }

  console.log(`🎉 สำเร็จ! บันทึกข้อมูลความรู้และ Vector ครบทั้ง ${count} จังหวัดลง MongoDB เรียบร้อยแล้ว`);
  await mongoose.disconnect();
}

seedProvinceKnowledge().catch((err) => {
  console.error('❌ เกิดข้อผิดพลาดในการรัน Seed:', err);
  process.exit(1);
});
