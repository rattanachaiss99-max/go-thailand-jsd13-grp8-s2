/**
 * properties.js
 * ------------------------------------------------------------
 * Mock data ของที่พัก ใช้แทนการเรียก API จริง แบ่งกลุ่มตาม "ภาค"
 * (ดู regions.js) — ภาคเหนือ/อีสาน/ใต้ ภาคละ 3 ที่พัก, ภาคกลาง 5 ที่พัก
 * รูปภาพเป็นภาพถ่ายจริงจาก Unsplash (ดาวน์โหลดเก็บไว้ใน public/images/)
 * ที่พักละ 5 รูป ใช้ทั้งในหน้ารายการค้นหา (AccommodationListing),
 * หน้ารายละเอียด (AccommodationDetail) และหน้า "You might also like"
 * ในหน้า Cart / Success
 * ------------------------------------------------------------
 */

/** สร้าง path รูปภาพ 5 รูปของที่พัก จากโฟลเดอร์ public/images/<id>/1.jpg..5.jpg */
function imagesFor(id) {
  return [1, 2, 3, 4, 5].map((n) => `/images/${id}/${n}.jpg`);
}

export const properties = [
  /* ================= ภาคเหนือ (North) ================= */
  {
    id: "emerald-jungle-retreat",
    name: "Emerald Jungle Retreat",
    type: "Jungle Retreat",
    region: "north",
    location: "Mae Rim, Chiang Mai",
    rating: 4.7,
    reviews: 76,
    pricePerNight: 9500,
    bedrooms: 1,
    renovatedMonthsAgo: 4,
    images: imagesFor("emerald-jungle-retreat"),
    tags: ["Breakfast", "Guided Trek"],
    keywords: ["Free Wi-Fi", "Breakfast Included"],
    description:
      "Canopy tents suspended above a private valley, with open-air bathing, forest dining and guided morning treks through the highlands surrounding Chiang Mai.",
    descriptionExtra:
      "A rare blend of adventure and comfort — wake to birdsong and mist rolling through the canopy below your deck.",
    amenities: [
      { icon: "🍳", label: "Breakfast included" },
      { icon: "🥾", label: "Guided trek" },
      { icon: "🛁", label: "Open-air bath" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🔥", label: "Campfire deck" },
      { icon: "🍽️", label: "Forest dining" },
    ],
    nearby: [
      { name: "Mae Sa Waterfall", distance: "4.2 km" },
      { name: "Elephant Sanctuary", distance: "6.0 km" },
      { name: "Chiang Mai Old City", distance: "18 km" },
      { name: "Chiang Mai Airport", distance: "24 km" },
    ],
  },
  {
    id: "doi-mist-mountain-lodge",
    name: "Doi Mist Mountain Lodge",
    type: "Mountain Lodge",
    region: "north",
    location: "Pai, Mae Hong Son",
    rating: 4.6,
    reviews: 58,
    pricePerNight: 7500,
    bedrooms: 1,
    renovatedMonthsAgo: 10,
    images: imagesFor("doi-mist-mountain-lodge"),
    tags: ["Mountain View", "Bonfire"],
    keywords: ["Free Wi-Fi", "Breakfast Included", "Mountain View"],
    description:
      "Perched on a ridge above the Pai valley, this timber lodge wakes to a sea of morning mist rolling between the hills.",
    descriptionExtra:
      "Floor-to-ceiling windows frame the valley from every room, with a wraparound deck built for slow mountain mornings.",
    amenities: [
      { icon: "🏔️", label: "Mountain view" },
      { icon: "🔥", label: "Evening bonfire" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍳", label: "Breakfast included" },
      { icon: "🚲", label: "Bicycle rental" },
      { icon: "☕", label: "Local coffee bar" },
    ],
    nearby: [
      { name: "Pai Canyon", distance: "3.5 km" },
      { name: "Pai Walking Street", distance: "5.0 km" },
      { name: "Mo Paeng Waterfall", distance: "8.0 km" },
      { name: "Pai Airport", distance: "4.0 km" },
    ],
  },
  {
    id: "lanna-riverside-boutique",
    name: "Lanna Riverside Boutique",
    type: "Boutique Hotel",
    region: "north",
    location: "Chiang Rai",
    rating: 4.5,
    reviews: 64,
    pricePerNight: 6800,
    bedrooms: 1,
    renovatedMonthsAgo: 20,
    images: imagesFor("lanna-riverside-boutique"),
    tags: ["Free Wi-Fi", "River View"],
    keywords: ["Free Wi-Fi", "River View"],
    description:
      "A handful of Lanna-style teak suites set along the Kok River, blending northern Thai craftsmanship with quiet boutique comfort.",
    descriptionExtra:
      "Each suite is furnished with hand-carved teak and local textiles, opening onto a shared riverside terrace at dusk.",
    amenities: [
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🌊", label: "River view" },
      { icon: "🍵", label: "Tea ceremony" },
      { icon: "🚗", label: "Airport transfer" },
      { icon: "🍽️", label: "Northern Thai dining" },
      { icon: "🧘", label: "Morning yoga deck" },
    ],
    nearby: [
      { name: "White Temple (Wat Rong Khun)", distance: "12 km" },
      { name: "Chiang Rai Night Bazaar", distance: "2.5 km" },
      { name: "Blue Temple", distance: "4.0 km" },
      { name: "Chiang Rai Airport", distance: "9.0 km" },
    ],
  },

  /* ================= ภาคอีสาน (Isan / Northeast) ================= */
  {
    id: "isan-ricefield-homestay",
    name: "Isan Rice Field Homestay",
    type: "Rice Field Homestay",
    region: "isan",
    location: "Khon Kaen",
    rating: 4.4,
    reviews: 41,
    pricePerNight: 4200,
    bedrooms: 2,
    renovatedMonthsAgo: 30,
    images: imagesFor("isan-ricefield-homestay"),
    tags: ["Farm Breakfast", "Cultural Tour"],
    keywords: ["Free Wi-Fi", "Breakfast Included"],
    description:
      "Raised timber homes overlooking emerald rice paddies, offering a genuine taste of Isan farm life just outside Khon Kaen.",
    descriptionExtra:
      "Guests join the family for a farm-to-table breakfast each morning, with sunset walks along the paddy dikes.",
    amenities: [
      { icon: "🌾", label: "Rice field view" },
      { icon: "🍳", label: "Farm breakfast" },
      { icon: "🚴", label: "Bicycle tours" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🎎", label: "Cultural activities" },
      { icon: "🐃", label: "Buffalo farm visit" },
    ],
    nearby: [
      { name: "Bueng Kaen Nakhon Lake", distance: "6.0 km" },
      { name: "Khon Kaen National Museum", distance: "7.5 km" },
      { name: "Wat Nong Wang", distance: "8.0 km" },
      { name: "Khon Kaen Airport", distance: "9.0 km" },
    ],
  },
  {
    id: "mekong-riverside-retreat",
    name: "Mekong Riverside Retreat",
    type: "Riverside Retreat",
    region: "isan",
    location: "Nong Khai",
    rating: 4.5,
    reviews: 47,
    pricePerNight: 5200,
    bedrooms: 1,
    renovatedMonthsAgo: 5,
    images: imagesFor("mekong-riverside-retreat"),
    tags: ["River View", "Sunset Deck"],
    keywords: ["Free Wi-Fi", "River View"],
    description:
      "A quiet riverside retreat facing the Mekong and the hills of Laos beyond, built around long lazy sunsets on the deck.",
    descriptionExtra:
      "Rooms open directly onto the riverbank, with hammocks strung between frangipani trees for the afternoon heat.",
    amenities: [
      { icon: "🌊", label: "Mekong river view" },
      { icon: "🌅", label: "Sunset deck" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🚴", label: "Bicycle rental" },
      { icon: "🍽️", label: "Riverside dining" },
      { icon: "🛶", label: "Longtail boat trips" },
    ],
    nearby: [
      { name: "Sala Kaew Ku Sculpture Park", distance: "5.0 km" },
      { name: "Nong Khai Riverside Walk", distance: "1.5 km" },
      { name: "Friendship Bridge", distance: "3.0 km" },
      { name: "Udon Thani Airport", distance: "55 km" },
    ],
  },
  {
    id: "khaoyai-vineyard-villas",
    name: "Khao Yai Vineyard Villas",
    type: "Vineyard Villa",
    region: "isan",
    location: "Nakhon Ratchasima",
    rating: 4.7,
    reviews: 69,
    pricePerNight: 8900,
    bedrooms: 3,
    renovatedMonthsAgo: 14,
    images: imagesFor("khaoyai-vineyard-villas"),
    tags: ["Vineyard View", "Wine Tasting"],
    keywords: ["Free Wi-Fi", "Pool"],
    description:
      "Private villas set among the rolling vineyards at the edge of Khao Yai National Park, cool and green year-round.",
    descriptionExtra:
      "Evenings begin with a guided tasting on the terrace, looking out over vine rows toward the misty mountains.",
    amenities: [
      { icon: "🍇", label: "Vineyard view" },
      { icon: "🍷", label: "Wine tasting" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Infinity pool" },
      { icon: "🍽️", label: "Farm-to-table dining" },
      { icon: "🚴", label: "Vineyard cycling" },
    ],
    nearby: [
      { name: "Khao Yai National Park", distance: "10 km" },
      { name: "PB Valley Vineyard", distance: "3.0 km" },
      { name: "Primo Piazza", distance: "5.5 km" },
      { name: "Don Mueang Airport", distance: "140 km" },
    ],
  },

  /* ================= ภาคกลาง (Central) ================= */
  {
    id: "siam-heritage-sanctuary",
    name: "The Siam Heritage Sanctuary",
    type: "Luxury Resort",
    region: "central",
    location: "Riverside, Bangkok",
    rating: 5.0,
    reviews: 124,
    pricePerNight: 12500,
    bedrooms: 2,
    renovatedMonthsAgo: 3,
    images: imagesFor("siam-heritage-sanctuary"),
    tags: ["Free Wi-Fi", "Spa", "Infinity Pool"],
    keywords: ["Free Wi-Fi", "Pool", "Spa", "Gym"],
    description:
      "Experience unparalleled luxury in the heart of Bangkok. The Siam Heritage Sanctuary offers a profound sense of place, blending deep-rooted Thai architectural traditions with exquisite contemporary comfort. Set amidst lush, manicured gardens along the historic Chao Phraya River, this exclusive retreat promises serenity and absolute privacy.",
    descriptionExtra:
      "Each villa is a masterpiece of design — teak interiors, towering vaulted ceilings and curated antiques. Step outside to your expansive private deck, where a personal infinity pool merges visually with the river beyond.",
    amenities: [
      { icon: "📶", label: "Free high-speed Wi-Fi" },
      { icon: "🏊", label: "Private infinity pool" },
      { icon: "🛎️", label: "24/7 butler service" },
      { icon: "🌿", label: "Holistic spa" },
      { icon: "🏋️", label: "State-of-the-art gym" },
      { icon: "🍽️", label: "Fine dining" },
    ],
    nearby: [
      { name: "The Grand Palace", distance: "2.5 km" },
      { name: "Wat Arun (Temple of Dawn)", distance: "1.8 km" },
      { name: "ICONSIAM Luxury Mall", distance: "3.0 km" },
      { name: "Suvarnabhumi Airport", distance: "35 km" },
    ],
  },
  {
    id: "skyline-executive-suites",
    name: "Skyline Executive Suites",
    type: "City Suite",
    region: "central",
    location: "Sukhumvit, Bangkok",
    rating: 4.7,
    reviews: 88,
    pricePerNight: 14200,
    bedrooms: 1,
    renovatedMonthsAgo: 8,
    images: imagesFor("skyline-executive-suites"),
    tags: ["City View", "Rooftop Bar"],
    keywords: ["Free Wi-Fi", "Pool", "Gym"],
    description:
      "Sleek executive suites high above Sukhumvit, with panoramic skyline views and direct access to the BTS for effortless city exploring.",
    descriptionExtra:
      "Floor-to-ceiling glass wraps every suite, turning the Bangkok skyline into the room's centrepiece day and night.",
    amenities: [
      { icon: "🌆", label: "Skyline city view" },
      { icon: "🍸", label: "Rooftop bar" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Rooftop infinity pool" },
      { icon: "🏋️", label: "24-hour gym" },
      { icon: "🚇", label: "BTS access" },
    ],
    nearby: [
      { name: "Terminal 21", distance: "0.8 km" },
      { name: "Benjakitti Park", distance: "1.5 km" },
      { name: "EmQuartier", distance: "2.0 km" },
      { name: "Suvarnabhumi Airport", distance: "28 km" },
    ],
  },
  {
    id: "ayutthaya-heritage-riverside",
    name: "Ayutthaya Heritage Riverside",
    type: "Heritage Hotel",
    region: "central",
    location: "Ayutthaya",
    rating: 4.5,
    reviews: 53,
    pricePerNight: 6500,
    bedrooms: 1,
    renovatedMonthsAgo: 36,
    images: imagesFor("ayutthaya-heritage-riverside"),
    tags: ["Temple View", "Free Bicycle"],
    keywords: ["Free Wi-Fi", "River View"],
    description:
      "A restored riverside residence facing the ancient temple ruins of Ayutthaya, steps from the old capital's UNESCO World Heritage site.",
    descriptionExtra:
      "Sunset views over the crumbling chedis from the rooftop terrace make this one of the most atmospheric stays in the old capital.",
    amenities: [
      { icon: "🛕", label: "Temple ruin view" },
      { icon: "🚲", label: "Free bicycle" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍽️", label: "Riverside dining" },
      { icon: "🛶", label: "Sunset boat tour" },
      { icon: "🏛️", label: "Heritage architecture" },
    ],
    nearby: [
      { name: "Wat Mahathat", distance: "1.2 km" },
      { name: "Wat Chaiwatthanaram", distance: "3.5 km" },
      { name: "Ayutthaya Historical Park", distance: "1.0 km" },
      { name: "Don Mueang Airport", distance: "65 km" },
    ],
  },
  {
    id: "river-kwai-jungle-raft",
    name: "River Kwai Jungle Raft",
    type: "Floating Raft Resort",
    region: "central",
    location: "Kanchanaburi",
    rating: 4.6,
    reviews: 61,
    pricePerNight: 5800,
    bedrooms: 1,
    renovatedMonthsAgo: 18,
    images: imagesFor("river-kwai-jungle-raft"),
    tags: ["No Electricity", "River Raft"],
    keywords: ["River View"],
    description:
      "Bamboo raft rooms floating on the River Kwai, lit by lantern at night, framed by limestone cliffs and dense jungle on every side.",
    descriptionExtra:
      "Deliberately unplugged — no electricity after dark — so evenings are spent by candlelight to the sound of the river below.",
    amenities: [
      { icon: "🕯️", label: "Candlelit evenings" },
      { icon: "🌊", label: "River raft rooms" },
      { icon: "🥾", label: "Jungle trekking" },
      { icon: "🐘", label: "Elephant sanctuary visit" },
      { icon: "🍽️", label: "Riverside dining" },
      { icon: "🛶", label: "Bamboo rafting" },
    ],
    nearby: [
      { name: "Sai Yok Noi Waterfall", distance: "5.0 km" },
      { name: "Bridge on the River Kwai", distance: "35 km" },
      { name: "Erawan National Park", distance: "40 km" },
      { name: "Kanchanaburi Town", distance: "35 km" },
    ],
  },
  {
    id: "hua-hin-royal-beachfront",
    name: "Hua Hin Royal Beachfront",
    type: "Beachfront Resort",
    region: "central",
    location: "Hua Hin",
    rating: 4.6,
    reviews: 92,
    pricePerNight: 9800,
    bedrooms: 2,
    renovatedMonthsAgo: 11,
    images: imagesFor("hua-hin-royal-beachfront"),
    tags: ["Beachfront", "Golf Access"],
    keywords: ["Free Wi-Fi", "Pool", "Spa", "Beachfront"],
    description:
      "A grand beachfront resort in Thailand's original royal seaside town, with sweeping lawns running straight onto the sand.",
    descriptionExtra:
      "Colonial-era architecture meets modern beach resort comfort, with easy access to Hua Hin's celebrated golf courses.",
    amenities: [
      { icon: "🏖️", label: "Beachfront access" },
      { icon: "⛳", label: "Golf course access" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Beachfront pool" },
      { icon: "🌿", label: "Garden spa" },
      { icon: "🍽️", label: "Seafood dining" },
    ],
    nearby: [
      { name: "Hua Hin Beach", distance: "0.1 km" },
      { name: "Hua Hin Night Market", distance: "2.0 km" },
      { name: "Khao Takiab Viewpoint", distance: "4.5 km" },
      { name: "Hua Hin Airport", distance: "6.0 km" },
    ],
  },

  /* ================= ภาคใต้ (South) ================= */
  {
    id: "amanpuri-retreat-villas",
    name: "Amanpuri Retreat Villas",
    type: "Private Villa",
    region: "south",
    location: "Surin Beach, Phuket",
    rating: 4.8,
    reviews: 98,
    pricePerNight: 18000,
    bedrooms: 3,
    renovatedMonthsAgo: 7,
    images: imagesFor("amanpuri-retreat-villas"),
    tags: ["Private Pool", "Butler Service"],
    keywords: ["Free Wi-Fi", "Pool", "Spa"],
    description:
      "Nestled within a coconut plantation overlooking the Andaman Sea, these exclusive villas offer total privacy, a dedicated butler and a sunset deck built for two.",
    descriptionExtra:
      "Every villa opens directly onto its own infinity-edge pool, with indoor-outdoor living spaces designed for the tropics.",
    amenities: [
      { icon: "📶", label: "Free high-speed Wi-Fi" },
      { icon: "🏊", label: "Private pool" },
      { icon: "🛎️", label: "Butler service" },
      { icon: "🌿", label: "Garden spa" },
      { icon: "🚗", label: "Airport transfer" },
      { icon: "🍽️", label: "In-villa dining" },
    ],
    nearby: [
      { name: "Surin Beach", distance: "0.2 km" },
      { name: "Bang Tao Beach", distance: "3.5 km" },
      { name: "Porto de Phuket", distance: "4.0 km" },
      { name: "Phuket Airport", distance: "18 km" },
    ],
  },
  {
    id: "railay-cliff-beach-villas",
    name: "Railay Cliff Beach Villas",
    type: "Cliffside Villa",
    region: "south",
    location: "Railay, Krabi",
    rating: 4.8,
    reviews: 71,
    pricePerNight: 11500,
    bedrooms: 2,
    renovatedMonthsAgo: 2,
    images: imagesFor("railay-cliff-beach-villas"),
    tags: ["Cliff View", "Rock Climbing"],
    keywords: ["Free Wi-Fi", "Beachfront"],
    description:
      "Villas tucked beneath the towering limestone cliffs of Railay, accessible only by longtail boat — no roads reach this peninsula.",
    descriptionExtra:
      "World-class rock climbing routes rise straight from the beach, with turquoise water and karst islands framing every view.",
    amenities: [
      { icon: "🧗", label: "Rock climbing access" },
      { icon: "🏖️", label: "Beachfront" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🛶", label: "Kayak rental" },
      { icon: "🍽️", label: "Beachside dining" },
      { icon: "⛴️", label: "Longtail boat transfer" },
    ],
    nearby: [
      { name: "Railay West Beach", distance: "0.1 km" },
      { name: "Phra Nang Cave Beach", distance: "0.8 km" },
      { name: "Diamond Cave", distance: "1.0 km" },
      { name: "Krabi Airport", distance: "45 km (by boat + road)" },
    ],
  },
  {
    id: "four-seasons-samui-cove",
    name: "Four Seasons Samui Cove",
    type: "Beach Cove Resort",
    region: "south",
    location: "Koh Samui",
    rating: 4.9,
    reviews: 112,
    pricePerNight: 15500,
    bedrooms: 4,
    renovatedMonthsAgo: 23,
    images: imagesFor("four-seasons-samui-cove"),
    tags: ["Private Beach", "Overwater Deck"],
    keywords: ["Pool", "Spa", "Beachfront"],
    description:
      "Hillside villas tumbling down to a private cove on Koh Samui's northwest coast, each with an overwater sundeck above its own pool.",
    descriptionExtra:
      "The resort's private cove stays sheltered and calm year-round, framed by longtail boats and coconut groves.",
    amenities: [
      { icon: "🏖️", label: "Private beach cove" },
      { icon: "🏊", label: "Private pool" },
      { icon: "🛎️", label: "24/7 villa host" },
      { icon: "🌿", label: "Hillside spa" },
      { icon: "🍽️", label: "Beachfront dining" },
      { icon: "🛥️", label: "Sunset cruise" },
    ],
    nearby: [
      { name: "Choeng Mon Beach", distance: "2.0 km" },
      { name: "Fisherman's Village", distance: "6.0 km" },
      { name: "Big Buddha Temple", distance: "5.5 km" },
      { name: "Samui Airport", distance: "7.0 km" },
    ],
  },
];

/** ค้นหาที่พักจาก id — ใช้ในหน้า Detail เพื่ออ่านพารามิเตอร์จาก URL */
export function getPropertyById(id) {
  return properties.find((p) => p.id === id);
}

/** คืนค่าที่พักอื่น ๆ ที่ไม่ใช่ id ที่ระบุ — ใช้กับ "You might also like" */
export function getOtherProperties(excludeId, count = 3) {
  return properties.filter((p) => p.id !== excludeId).slice(0, count);
}

/**
 * รายชื่อ "keyword สิ่งอำนวยความสะดวก" ทั้งหมดแบบไม่ซ้ำ ดึงมาจากฟิลด์
 * `keywords` ของ properties จริงโดยตรง (ไม่ hardcode) ใช้เป็นตัวกรอง
 * แบบ Popular Filters ใน FilterSidebar — ที่พักแต่ละแห่งต้องมี keyword
 * อยู่ใน `keywords` array ของตัวเองจริง ๆ ถึงจะถูกนับว่าตรงกับตัวกรอง
 */
export const facilityKeywords = [...new Set(properties.flatMap((p) => p.keywords))].sort();

/**
 * ตัวเลือกของตัวกรอง "Number of bedrooms" ใน FilterSidebar — radio
 * เลือกได้ทีละ 1 ตัวเลือก แต่ละตัวเลือกมี `test(bedrooms)` สำหรับเช็ค
 * ว่าจำนวนห้องนอนจริงของที่พัก (ฟิลด์ `bedrooms`) เข้าเกณฑ์ตัวเลือก
 * นั้นหรือไม่ ("3+" ครอบคลุมตั้งแต่ 3 ห้องขึ้นไป)
 */
export const bedroomOptions = [
  { value: "1", label: "1 bedroom/studio", test: (bedrooms) => bedrooms === 1 },
  { value: "2", label: "2 bedrooms", test: (bedrooms) => bedrooms === 2 },
  { value: "3+", label: "3+ bedrooms", test: (bedrooms) => bedrooms >= 3 },
];

/**
 * ตัวเลือกของตัวกรอง "Opening/renovation time" ใน FilterSidebar —
 * checkbox เลือกได้หลายตัวเลือก (OR กัน) เทียบกับฟิลด์
 * `renovatedMonthsAgo` ของที่พัก (จำนวนเดือนที่ผ่านมาตั้งแต่เปิด/
 * ปรับปรุงล่าสุด)
 */
export const renovationOptions = [
  { value: "6m", label: "Within 6 months", maxMonths: 6 },
  { value: "1y", label: "Within 1 year", maxMonths: 12 },
  { value: "2y", label: "Within 2 years", maxMonths: 24 },
];
