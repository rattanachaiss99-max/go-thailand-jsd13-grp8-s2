/**
 * thailandProvinces.ts
 * ----------------------------------------------------------------------------
 * Master Data: ข้อมูล 77 จังหวัดของประเทศไทย
 * รองรับทั้งการแบ่งภาคแบบ 4 ภาคหลัก (Tourism/Properties) และ 6 ภาคทางภูมิศาสตร์
 * มีรหัส ISO 3166-2:TH สำหรับผูกกับ SVG Vector Paths
 * ----------------------------------------------------------------------------
 */

export type RegionKey = 'north' | 'isan' | 'central' | 'south' | 'east' | 'west';

export interface RegionMeta {
  id: RegionKey;
  labelTh: string;
  labelEn: string;
  color: string;
  bgLight: string;
}

export const REGION_METAS: Record<RegionKey, RegionMeta> = {
  north: {
    id: 'north',
    labelTh: 'ภาคเหนือ',
    labelEn: 'Northern',
    color: '#0284c7', // Sky blue
    bgLight: '#e0f2fe'
  },
  isan: {
    id: 'isan',
    labelTh: 'ภาคอีสาน',
    labelEn: 'Northeastern (Isan)',
    color: '#d97706', // Amber
    bgLight: '#fef3c7'
  },
  central: {
    id: 'central',
    labelTh: 'ภาคกลาง',
    labelEn: 'Central',
    color: '#16a34a', // Emerald green
    bgLight: '#dcfce7'
  },
  south: {
    id: 'south',
    labelTh: 'ภาคใต้',
    labelEn: 'Southern',
    color: '#2563eb', // Indigo/Blue
    bgLight: '#dbeafe'
  },
  east: {
    id: 'east',
    labelTh: 'ภาคตะวันออก',
    labelEn: 'Eastern',
    color: '#ea580c', // Orange
    bgLight: '#ffedd5'
  },
  west: {
    id: 'west',
    labelTh: 'ภาคตะวันตก',
    labelEn: 'Western',
    color: '#9333ea', // Purple
    bgLight: '#f3e8ff'
  }
};

export interface Province {
  id: string;        // รหัส ISO (เช่น "TH-10", "TH-50")
  slug: string;      // URL slug (เช่น "bangkok", "chiang-mai")
  nameTh: string;    // ชื่อภาษาไทย
  nameEn: string;    // ชื่อภาษาอังกฤษ
  region: RegionKey; // ภาค
  simplifiedRegion: 'north' | 'isan' | 'central' | 'south'; // สำหรับกรอง 4 ภาคหลัก
  popularDestinations?: string[];
  approxStayCount?: number;
}

export const THAILAND_PROVINCES: Province[] = [
  // ภาคเหนือ (Northern - 9 จังหวัด)
  { id: 'TH-50', slug: 'chiang-mai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'north', simplifiedRegion: 'north', popularDestinations: ['ดอยอินทนนท์', 'นิมมาน', 'แม่กำปอง'], approxStayCount: 42 },
  { id: 'TH-57', slug: 'chiang-rai', nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'north', simplifiedRegion: 'north', popularDestinations: ['วัดร่องขุ่น', 'ดอยแม่สลอง'], approxStayCount: 28 },
  { id: 'TH-52', slug: 'lampang', nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'north', simplifiedRegion: 'north', approxStayCount: 14 },
  { id: 'TH-51', slug: 'lamphun', nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'north', simplifiedRegion: 'north', approxStayCount: 9 },
  { id: 'TH-58', slug: 'mae-hong-son', nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'north', simplifiedRegion: 'north', popularDestinations: ['ปาย', 'ปางอุ๋ง'], approxStayCount: 22 },
  { id: 'TH-55', slug: 'nan', nameTh: 'น่าน', nameEn: 'Nan', region: 'north', simplifiedRegion: 'north', popularDestinations: ['ปัว', 'บ่อเกลือ'], approxStayCount: 25 },
  { id: 'TH-56', slug: 'phayao', nameTh: 'พะเยา', nameEn: 'Phayao', region: 'north', simplifiedRegion: 'north', approxStayCount: 11 },
  { id: 'TH-54', slug: 'phrae', nameTh: 'แพร่', nameEn: 'Phrae', region: 'north', simplifiedRegion: 'north', approxStayCount: 8 },
  { id: 'TH-53', slug: 'uttaradit', nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'north', simplifiedRegion: 'north', approxStayCount: 7 },

  // ภาคอีสาน (Northeastern - 20 จังหวัด)
  { id: 'TH-37', slug: 'amnat-charoen', nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 5 },
  { id: 'TH-38', slug: 'bueng-kan', nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['หินสามวาฬ'], approxStayCount: 10 },
  { id: 'TH-31', slug: 'buri-ram', nameTh: 'บุรีรัมย์', nameEn: 'Buri Ram', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['ปราสาทพนมรุ้ง'], approxStayCount: 18 },
  { id: 'TH-36', slug: 'chaiyaphum', nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 12 },
  { id: 'TH-46', slug: 'kalasin', nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 8 },
  { id: 'TH-40', slug: 'khon-kaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 30 },
  { id: 'TH-42', slug: 'loei', nameTh: 'เลย', nameEn: 'Loei', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['เชียงคาน', 'ภูกระดึง'], approxStayCount: 24 },
  { id: 'TH-44', slug: 'maha-sarakham', nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 9 },
  { id: 'TH-49', slug: 'mukdahan', nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 8 },
  { id: 'TH-48', slug: 'nakhon-phanom', nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['พระธาตุพนม'], approxStayCount: 15 },
  { id: 'TH-30', slug: 'nakhon-ratchasima', nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima (Khao Yai)', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['เขาใหญ่', 'วังน้ำเขียว'], approxStayCount: 55 },
  { id: 'TH-39', slug: 'nong-bua-lam-phu', nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 6 },
  { id: 'TH-43', slug: 'nong-khai', nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 16 },
  { id: 'TH-45', slug: 'roi-et', nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 11 },
  { id: 'TH-47', slug: 'sakon-nakhon', nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 10 },
  { id: 'TH-33', slug: 'si-sa-ket', nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 9 },
  { id: 'TH-32', slug: 'surin', nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 10 },
  { id: 'TH-34', slug: 'ubon-ratchathani', nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['ผาแต้ม', 'สามพันโบก'], approxStayCount: 20 },
  { id: 'TH-41', slug: 'udon-thani', nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'isan', simplifiedRegion: 'isan', popularDestinations: ['ทะเลบัวแดง', 'คำชะโนด'], approxStayCount: 22 },
  { id: 'TH-35', slug: 'yasothon', nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'isan', simplifiedRegion: 'isan', approxStayCount: 6 },

  // ภาคกลาง (Central - 22 จังหวัด)
  { id: 'TH-10', slug: 'bangkok', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'central', simplifiedRegion: 'central', popularDestinations: ['วัดพระแก้ว', 'เยาวราช', 'ไอคอนสยาม'], approxStayCount: 120 },
  { id: 'TH-14', slug: 'ayutthaya', nameTh: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'central', simplifiedRegion: 'central', popularDestinations: ['อุทยานประวัติศาสตร์'], approxStayCount: 32 },
  { id: 'TH-13', slug: 'pathum-thani', nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'central', simplifiedRegion: 'central', approxStayCount: 15 },
  { id: 'TH-12', slug: 'nonthaburi', nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'central', simplifiedRegion: 'central', approxStayCount: 18 },
  { id: 'TH-11', slug: 'samut-prakan', nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'central', simplifiedRegion: 'central', approxStayCount: 20 },
  { id: 'TH-74', slug: 'samut-sakhon', nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'central', simplifiedRegion: 'central', approxStayCount: 9 },
  { id: 'TH-75', slug: 'samut-songkhram', nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'central', simplifiedRegion: 'central', popularDestinations: ['อัมพวา'], approxStayCount: 19 },
  { id: 'TH-73', slug: 'nakhon-pathom', nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'central', simplifiedRegion: 'central', approxStayCount: 14 },
  { id: 'TH-26', slug: 'nakhon-nayok', nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'central', simplifiedRegion: 'central', approxStayCount: 16 },
  { id: 'TH-16', slug: 'lop-buri', nameTh: 'ลพบุรี', nameEn: 'Lop Buri', region: 'central', simplifiedRegion: 'central', approxStayCount: 10 },
  { id: 'TH-19', slug: 'sara-buri', nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'central', simplifiedRegion: 'central', approxStayCount: 15 },
  { id: 'TH-17', slug: 'sing-buri', nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'central', simplifiedRegion: 'central', approxStayCount: 5 },
  { id: 'TH-18', slug: 'chai-nat', nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'central', simplifiedRegion: 'central', approxStayCount: 6 },
  { id: 'TH-15', slug: 'ang-thong', nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'central', simplifiedRegion: 'central', approxStayCount: 5 },
  { id: 'TH-60', slug: 'nakhon-sawan', nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'central', simplifiedRegion: 'central', approxStayCount: 14 },
  { id: 'TH-61', slug: 'uthai-thani', nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'central', simplifiedRegion: 'central', approxStayCount: 9 },
  { id: 'TH-62', slug: 'kamphaeng-phet', nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'central', simplifiedRegion: 'central', approxStayCount: 8 },
  { id: 'TH-65', slug: 'phitsanulok', nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'central', simplifiedRegion: 'central', approxStayCount: 17 },
  { id: 'TH-66', slug: 'phichit', nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'central', simplifiedRegion: 'central', approxStayCount: 7 },
  { id: 'TH-67', slug: 'phetchabun', nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'central', simplifiedRegion: 'central', popularDestinations: ['เขาค้อ', 'ภูทับเบิก'], approxStayCount: 36 },
  { id: 'TH-64', slug: 'sukhothai', nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'central', simplifiedRegion: 'central', popularDestinations: ['อุทยานประวัติศาสตร์สุโขทัย'], approxStayCount: 16 },
  { id: 'TH-72', slug: 'suphan-buri', nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'central', simplifiedRegion: 'central', approxStayCount: 11 },

  // ภาคตะวันออก (Eastern - 7 จังหวัด)
  { id: 'TH-20', slug: 'chon-buri', nameTh: 'ชลบุรี (พัทยา)', nameEn: 'Chon Buri (Pattaya)', region: 'east', simplifiedRegion: 'central', popularDestinations: ['พัทยา', 'เกาะล้าน', 'บางแสน'], approxStayCount: 90 },
  { id: 'TH-21', slug: 'rayong', nameTh: 'ระยอง', nameEn: 'Rayong', region: 'east', simplifiedRegion: 'central', popularDestinations: ['เกาะเสม็ด'], approxStayCount: 38 },
  { id: 'TH-22', slug: 'chanthaburi', nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'east', simplifiedRegion: 'central', approxStayCount: 22 },
  { id: 'TH-23', slug: 'trat', nameTh: 'ตราด', nameEn: 'Trat', region: 'east', simplifiedRegion: 'central', popularDestinations: ['เกาะช้าง', 'เกาะกูด'], approxStayCount: 35 },
  { id: 'TH-24', slug: 'chachoengsao', nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'east', simplifiedRegion: 'central', approxStayCount: 12 },
  { id: 'TH-25', slug: 'prachin-buri', nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'east', simplifiedRegion: 'central', approxStayCount: 11 },
  { id: 'TH-27', slug: 'sa-kaeo', nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'east', simplifiedRegion: 'central', approxStayCount: 7 },

  // ภาคตะวันตก (Western - 5 จังหวัด)
  { id: 'TH-71', slug: 'kanchanaburi', nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'west', simplifiedRegion: 'central', popularDestinations: ['สะพานข้ามแม่น้ำแคว', 'สังขละบุรี'], approxStayCount: 45 },
  { id: 'TH-70', slug: 'ratchaburi', nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'west', simplifiedRegion: 'central', popularDestinations: ['สวนผึ้ง'], approxStayCount: 26 },
  { id: 'TH-63', slug: 'tak', nameTh: 'ตาก', nameEn: 'Tak', region: 'west', simplifiedRegion: 'north', popularDestinations: ['น้ำตกทีลอซู', 'แม่สอด'], approxStayCount: 12 },
  { id: 'TH-76', slug: 'phetchaburi', nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi (Cha-am)', region: 'west', simplifiedRegion: 'central', popularDestinations: ['ชะอำ', 'แก่งกระจาน'], approxStayCount: 34 },
  { id: 'TH-77', slug: 'prachuap-khiri-khan', nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan (Hua Hin)', region: 'west', simplifiedRegion: 'central', popularDestinations: ['หัวหิน', 'ปราณบุรี'], approxStayCount: 58 },

  // ภาคใต้ (Southern - 14 จังหวัด)
  { id: 'TH-86', slug: 'chumphon', nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'south', simplifiedRegion: 'south', approxStayCount: 16 },
  { id: 'TH-85', slug: 'ranong', nameTh: 'ระนอง', nameEn: 'Ranong', region: 'south', simplifiedRegion: 'south', approxStayCount: 14 },
  { id: 'TH-84', slug: 'surat-thani', nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani (Koh Samui)', region: 'south', simplifiedRegion: 'south', popularDestinations: ['เกาะสมุย', 'เกาะพะงัน', 'เกาะเต่า', 'เขาสก'], approxStayCount: 88 },
  { id: 'TH-82', slug: 'phang-nga', nameTh: 'พังงา', nameEn: 'Phang Nga', region: 'south', simplifiedRegion: 'south', popularDestinations: ['เขาหลัก', 'อ่าวพังงา'], approxStayCount: 40 },
  { id: 'TH-83', slug: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'south', simplifiedRegion: 'south', popularDestinations: ['ป่าตอง', 'เมืองเก่าภูเก็ต', 'แหลมพรหมเทพ'], approxStayCount: 130 },
  { id: 'TH-81', slug: 'krabi', nameTh: 'กระบี่', nameEn: 'Krabi', region: 'south', simplifiedRegion: 'south', popularDestinations: ['อ่าวนาง', 'เกาะพีพี', 'ไร่เลย์'], approxStayCount: 75 },
  { id: 'TH-80', slug: 'nakhon-si-thammarat', nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'south', simplifiedRegion: 'south', popularDestinations: ['คีรีวง', 'วัดเจดีย์ไอ้ไข่'], approxStayCount: 22 },
  { id: 'TH-92', slug: 'trang', nameTh: 'ตรัง', nameEn: 'Trang', region: 'south', simplifiedRegion: 'south', approxStayCount: 18 },
  { id: 'TH-93', slug: 'phatthalung', nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'south', simplifiedRegion: 'south', approxStayCount: 12 },
  { id: 'TH-91', slug: 'satun', nameTh: 'สตูล', nameEn: 'Satun', region: 'south', simplifiedRegion: 'south', popularDestinations: ['เกาะหลีเป๊ะ'], approxStayCount: 26 },
  { id: 'TH-90', slug: 'songkhla', nameTh: 'สงขลา (หาดใหญ่)', nameEn: 'Songkhla (Hat Yai)', region: 'south', simplifiedRegion: 'south', popularDestinations: ['หาดใหญ่'], approxStayCount: 35 },
  { id: 'TH-94', slug: 'pattani', nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'south', simplifiedRegion: 'south', approxStayCount: 6 },
  { id: 'TH-95', slug: 'yala', nameTh: 'ยะลา (เบตง)', nameEn: 'Yala (Betong)', region: 'south', simplifiedRegion: 'south', popularDestinations: ['เบตง'], approxStayCount: 14 },
  { id: 'TH-96', slug: 'narathiwat', nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'south', simplifiedRegion: 'south', approxStayCount: 7 }
];

/** ค้นหาจังหวัดจาก ID หรือ Slug (รองรับทั้งแบบมี -province หรือไม่มี และแบบเว้นวรรค/ขีด) */
export function getProvinceByIdOrSlug(query: string): Province | undefined {
  const raw = query.toLowerCase().trim();
  const q = raw.replace(/[-_]province$/, '');
  const cleanQ = q.replace(/[-\s_]/g, '');

  return THAILAND_PROVINCES.find(
    (p) =>
      p.id.toLowerCase() === raw ||
      p.id.toLowerCase() === q ||
      p.slug === raw ||
      p.slug === q ||
      p.slug.replace(/-/g, '') === cleanQ ||
      p.nameEn.toLowerCase() === raw ||
      p.nameEn.toLowerCase() === q ||
      p.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQ) ||
      p.nameTh === raw ||
      p.nameTh === q
  );
}

/** ดึงรายชื่อจังหวัดตามภาค (6 ภาค หรือ 4 ภาคหลัก) */
export function getProvincesByRegion(region: RegionKey | 'all'): Province[] {
  if (region === 'all') return THAILAND_PROVINCES;
  return THAILAND_PROVINCES.filter((p) => p.region === region);
}

/** ค้นหาจังหวัดแบบพิมพ์คำค้น (Autocomplete search) */
export function searchProvinces(term: string): Province[] {
  if (!term.trim()) return [];
  const t = term.toLowerCase().trim();
  return THAILAND_PROVINCES.filter(
    (p) =>
      p.nameTh.includes(t) ||
      p.nameEn.toLowerCase().includes(t) ||
      p.slug.includes(t) ||
      p.popularDestinations?.some((dest) => dest.toLowerCase().includes(t))
  );
}
