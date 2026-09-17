/**
 * properties.js
 * ------------------------------------------------------------
 * Master Collection: Accommodation (ข้อมูลที่พักหลัก)
 * สอดคล้องกับ Data Schema ของระบบ GoThailand
 *
 * ประกอบด้วย:
 *  - _id, name, category, description
 *  - location: { city, district, address_label, nearby_landmarks }
 *  - rating_avg, total_reviews
 *  - facilities, special_options
 *  - base_price_per_night
 *  - rooms: [{ room_type_id, name, bed_type, max_guests, price_per_night, available_quantity }]
 *  - pictures, policies: { cancellation_policy, check_in_time, check_out_time }
 * bedrooms/renovatedMonthsAgo เป็น metadata เสริมให้ FilterSidebar ใช้กรอง
 * ("Number of bedrooms" / "Opening/renovation time") ไม่ใช่ alias ของ field อื่น
 * (ตัด categories, is_featured, status, currency, pricing_rules, created_at,
 * updated_at, amenities, top-level nearby alias, location.map_coordinates
 * (lat/lng — ไม่มี component ไหน render แผนที่จริงที่ใช้พิกัด), images alias,
 * และ backward-compatibility aliases อื่น (type, rating, reviews, tags,
 * keywords, pricePerNight) ออกแล้ว — UI ฝั่ง frontend เปลี่ยนไปอ่าน canonical
 * field ตรงๆ หมดแล้ว (category, rating_avg, total_reviews, special_options,
 * facilities, base_price_per_night))
 * ------------------------------------------------------------
 */

function imagesFor(id) {
  return [1, 2, 3, 4, 5].map((n) => `/images/${id}/${n}.jpg`);
}

function makeLocation(city, district, addressLabel, nearby) {
  const loc = {
    city,
    district,
    address_label: addressLabel,
    nearby_landmarks: nearby.map((item) => ({
      name: item.name,
      distance: item.distance,
    })),
  };
  // เพิ่ม toString เพื่อให้ ${property.location} ใน UI ที่คาดหวัง string ยังแสดงผลได้สวยงาม
  loc.toString = () => addressLabel;
  return loc;
}

function buildAccommodation({
  _id,
  id,
  name,
  category,
  region,
  city,
  district,
  addressLabel,
  ratingAvg,
  totalReviews,
  basePrice,
  bedrooms = 1,
  renovatedMonthsAgo = 6,
  description,
  descriptionExtra = "",
  facilities = [],
  specialOptions = ["Free Cancellation", "Breakfast Included"],
  rooms = [],
  pictures = imagesFor(id),
  policies = {
    cancellation_policy: "Free cancellation up to 48 hours before check-in",
    check_in_time: "15:00",
    check_out_time: "12:00",
  },
  nearby = [],
}) {
  const defaultRooms = rooms.length > 0 ? rooms : [
    {
      room_type_id: `rm-${id}-01`,
      name: `${name} Standard Suite`,
      bed_type: bedrooms >= 2 ? "1 King Bed + 1 Queen Bed" : "1 King Bed",
      max_guests: {
        adults: bedrooms >= 2 ? 4 : 2,
        children: 1,
      },
      price_per_night: basePrice,
      available_quantity: 4,
    },
    {
      room_type_id: `rm-${id}-02`,
      name: `${name} Deluxe Villa`,
      bed_type: "1 Super King Bed",
      max_guests: {
        adults: 2,
        children: 2,
      },
      price_per_night: Math.round(basePrice * 1.25),
      available_quantity: 2,
    },
  ];

  return {
    // --- Data Schema Master Specification ---
    _id,
    id, // String slug สำหรับ URL route
    name,
    category,
    region,
    description,
    descriptionExtra,
    location: makeLocation(city, district, addressLabel, nearby),
    rating_avg: ratingAvg,
    total_reviews: totalReviews,
    facilities,
    special_options: specialOptions,
    base_price_per_night: basePrice,
    rooms: defaultRooms,
    pictures,
    policies,

    // --- Filter metadata (ไม่ใช่ alias — ไม่มี field อื่นซ้ำอยู่) ---
    bedrooms,
    renovatedMonthsAgo,
  };
}

export const properties = [
  /* ================= ภาคกลาง (Central) ================= */
  // รายการหลักที่ตรงกับ Schema ตัวอย่างเป๊ะ ๆ (id: 1, The Siam Heritage Sanctuary)
  buildAccommodation({
    _id: 1,
    id: "siam-heritage-sanctuary",
    name: "The Siam Heritage Sanctuary",
    category: "Luxury Resort",
    region: "central",
    city: "Bangkok",
    district: "Riverside",
    addressLabel: "Riverside, Bangkok, Thailand",
    ratingAvg: 5.0,
    totalReviews: 124,
    basePrice: 12500,
    bedrooms: 2,
    renovatedMonthsAgo: 3,
    description:
      "Experience unparalleled luxury in the heart of Bangkok. The Siam Heritage Sanctuary offers a profound sense of place, blending deep-rooted Thai architectural traditions with exquisite contemporary comfort. Set amidst lush, manicured gardens along the historic Chao Phraya River, this exclusive retreat promises serenity and absolute privacy.",
    descriptionExtra:
      "Each villa is a masterpiece of design — teak interiors, towering vaulted ceilings and curated antiques. Step outside to your expansive private deck, where a personal infinity pool merges visually with the river beyond.",
    facilities: [
      "24/7 Butler Service",
      "Spa",
      "Fine Dining",
    ],
    specialOptions: [
      "Breakfast Included",
      "Free Cancellation",
      "Parking",
      "Hotel Transfer",
    ],
    rooms: [
      {
        room_type_id: "rm-villa-01",
        name: "Royal Riverside Villa",
        bed_type: "1 King Bed",
        max_guests: {
          adults: 2,
          children: 1,
        },
        price_per_night: 12500.0,
        available_quantity: 4,
      },
      {
        room_type_id: "rm-villa-02",
        name: "Grand Chao Phraya Penthouse",
        bed_type: "2 King Beds",
        max_guests: {
          adults: 4,
          children: 2,
        },
        price_per_night: 22000.0,
        available_quantity: 2,
      },
    ],
    nearby: [
      { name: "The Grand Palace", distance: "2.5 km" },
      { name: "Wat Arun (Temple of Dawn)", distance: "1.8 km" },
      { name: "ICONSIAM Luxury Mall", distance: "3.0 km" },
      { name: "Suvarnabhumi Airport", distance: "35 km" },
    ],
  }),

  buildAccommodation({
    _id: 2,
    id: "skyline-executive-suites",
    name: "Skyline Executive Suites",
    category: "Luxury Hotel",
    region: "central",
    city: "Bangkok",
    district: "Sukhumvit",
    addressLabel: "Sukhumvit, Bangkok, Thailand",
    ratingAvg: 4.7,
    totalReviews: 88,
    basePrice: 14200,
    bedrooms: 1,
    renovatedMonthsAgo: 8,
    description:
      "Sleek executive suites high above Sukhumvit, with panoramic skyline views and direct access to the BTS for effortless city exploring.",
    descriptionExtra:
      "Floor-to-ceiling glass wraps every suite, turning the Bangkok skyline into the room's centrepiece day and night.",
    facilities: ["Free Wi-Fi", "Pool", "Gym", "Rooftop Bar"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Terminal 21 Mall", distance: "0.3 km" },
      { name: "Benjakitti Forest Park", distance: "1.2 km" },
      { name: "EmQuartier Shopping Centre", distance: "1.5 km" },
      { name: "Suvarnabhumi Airport", distance: "28 km" },
    ],
  }),

  buildAccommodation({
    _id: 3,
    id: "ayutthaya-heritage-riverside",
    name: "Ayutthaya Heritage Riverside",
    category: "B&B",
    region: "central",
    city: "Ayutthaya",
    district: "Phra Nakhon Si Ayutthaya",
    addressLabel: "Ayutthaya, Thailand",
    ratingAvg: 4.8,
    totalReviews: 92,
    basePrice: 8200,
    bedrooms: 2,
    renovatedMonthsAgo: 11,
    description:
      "A peaceful riverside estate facing the ancient temples of Ayutthaya, blending traditional wooden pavilions with modern comforts.",
    descriptionExtra:
      "Dine on the river terrace as illuminated stupas glow in the distance, then retire to bedrooms scented with natural cedar.",
    facilities: ["Free Wi-Fi", "Breakfast Included", "River View"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Wat Chaiwatthanaram", distance: "1.2 km" },
      { name: "Ayutthaya Historical Park", distance: "2.8 km" },
      { name: "Chao Sam Phraya Museum", distance: "3.5 km" },
      { name: "Don Mueang Airport", distance: "55 km" },
    ],
  }),

  buildAccommodation({
    _id: 4,
    id: "river-kwai-jungle-raft",
    name: "River Kwai Jungle Raft Resort",
    category: "Luxury Resort",
    region: "central",
    city: "Kanchanaburi",
    district: "Sai Yok",
    addressLabel: "Sai Yok, Kanchanaburi, Thailand",
    ratingAvg: 4.6,
    totalReviews: 70,
    basePrice: 6500,
    bedrooms: 1,
    renovatedMonthsAgo: 15,
    description:
      "Floating eco-villas moored on the Kwai Noi River, surrounded by sheer limestone cliffs and untouched rainforest.",
    descriptionExtra:
      "Step directly from your bedroom terrace into the cool, flowing river water for an authentic jungle experience.",
    facilities: ["Spa", "Free Wi-Fi"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Hellfire Pass Memorial", distance: "12 km" },
      { name: "Sai Yok Noi Waterfall", distance: "18 km" },
      { name: "Bridge on River Kwai", distance: "52 km" },
      { name: "Suvarnabhumi Airport", distance: "190 km" },
    ],
  }),

  buildAccommodation({
    _id: 5,
    id: "hua-hin-royal-beachfront",
    name: "Hua Hin Royal Beachfront Villa",
    category: "Private Villa",
    region: "central",
    city: "Prachuap Khiri Khan",
    district: "Hua Hin",
    addressLabel: "Hua Hin, Thailand",
    ratingAvg: 4.9,
    totalReviews: 104,
    basePrice: 16800,
    bedrooms: 3,
    renovatedMonthsAgo: 5,
    description:
      "Colonial-inspired beachfront residence with a manicured lawn rolling down to the golden sands of Hua Hin's royal coast.",
    descriptionExtra:
      "Generous veranda living, private infinity pool and dedicated staff make this villa the choice for multi-generational escapes.",
    facilities: ["Free Wi-Fi", "Pool", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Parking", "Hotel Transfer"],
    nearby: [
      { name: "Cicada Night Market", distance: "1.5 km" },
      { name: "Royal Hua Hin Golf Club", distance: "3.2 km" },
      { name: "Khao Takiab Temple", distance: "4.0 km" },
      { name: "Hua Hin Airport", distance: "9.5 km" },
    ],
  }),

  /* ================= ภาคเหนือ (North) ================= */
  buildAccommodation({
    _id: 6,
    id: "emerald-jungle-retreat",
    name: "Emerald Jungle Retreat",
    category: "Luxury Resort",
    region: "north",
    city: "Chiang Mai",
    district: "Mae Rim",
    addressLabel: "Mae Rim, Chiang Mai, Thailand",
    ratingAvg: 4.7,
    totalReviews: 76,
    basePrice: 9500,
    bedrooms: 1,
    renovatedMonthsAgo: 4,
    description:
      "Canopy tents suspended above a private valley, with open-air bathing, forest dining and guided morning treks through the highlands surrounding Chiang Mai.",
    descriptionExtra:
      "A rare blend of adventure and comfort — wake to birdsong and mist rolling through the canopy below your deck.",
    facilities: ["Free Wi-Fi", "Breakfast Included"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Mae Sa Waterfall", distance: "4.2 km" },
      { name: "Elephant Sanctuary", distance: "6.0 km" },
      { name: "Chiang Mai Old City", distance: "18 km" },
      { name: "Chiang Mai Airport", distance: "24 km" },
    ],
  }),

  buildAccommodation({
    _id: 7,
    id: "doi-mist-mountain-lodge",
    name: "Doi Mist Mountain Lodge",
    category: "B&B",
    region: "north",
    city: "Mae Hong Son",
    district: "Pai",
    addressLabel: "Pai, Mae Hong Son, Thailand",
    ratingAvg: 4.6,
    totalReviews: 58,
    basePrice: 7500,
    bedrooms: 1,
    renovatedMonthsAgo: 10,
    description:
      "Perched on a ridge above the Pai valley, this timber lodge wakes to a sea of morning mist rolling between the hills.",
    descriptionExtra:
      "Floor-to-ceiling windows frame the valley from every room, with a wraparound deck built for slow mountain mornings.",
    facilities: ["Free Wi-Fi", "Breakfast Included", "Mountain View"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Pai Canyon", distance: "3.5 km" },
      { name: "Pai Walking Street", distance: "5.0 km" },
      { name: "Mo Paeng Waterfall", distance: "8.0 km" },
      { name: "Pai Airport", distance: "4.0 km" },
    ],
  }),

  buildAccommodation({
    _id: 8,
    id: "lanna-riverside-boutique",
    name: "Lanna Riverside Boutique",
    category: "Luxury Hotel",
    region: "north",
    city: "Chiang Rai",
    district: "Mueang Chiang Rai",
    addressLabel: "Chiang Rai, Thailand",
    ratingAvg: 4.5,
    totalReviews: 64,
    basePrice: 6800,
    bedrooms: 1,
    renovatedMonthsAgo: 20,
    description:
      "Traditional northern architecture meets serene Kok River frontage, featuring handcrafted teak furnishings and landscaped gardens.",
    descriptionExtra:
      "Every detail honors Lanna craftsmanship — woven textiles, carved lintels and a quiet courtyard courtyard shaded by rain trees.",
    facilities: ["Free Wi-Fi", "River View", "Pool"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Wat Rong Khun (White Temple)", distance: "11 km" },
      { name: "Baan Dam Museum", distance: "8.5 km" },
      { name: "Chiang Rai Night Bazaar", distance: "2.0 km" },
      { name: "Mae Fah Luang Airport", distance: "7.0 km" },
    ],
  }),

  /* ================= ภาคอีสาน (Isan) ================= */
  buildAccommodation({
    _id: 9,
    id: "isan-ricefield-homestay",
    name: "Isan Ricefield Heritage Homestay",
    category: "B&B",
    region: "isan",
    city: "Ubon Ratchathani",
    district: "Warin Chamrap",
    addressLabel: "Ubon Ratchathani, Thailand",
    ratingAvg: 4.8,
    totalReviews: 45,
    basePrice: 4200,
    bedrooms: 1,
    renovatedMonthsAgo: 7,
    description:
      "Elevated teak wood pavilions surrounded by emerald paddies, offering an authentic glimpse of rural northeast living.",
    descriptionExtra:
      "Participate in morning sticky rice rituals, cycle quiet village lanes and fall asleep to the gentle chorus of the fields.",
    facilities: ["Free Wi-Fi", "Breakfast Included"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Wat Nong Pah Pong", distance: "6.0 km" },
      { name: "Ubon Ratchathani Museum", distance: "8.5 km" },
      { name: "Thung Si Mueang Park", distance: "9.0 km" },
      { name: "Ubon Airport", distance: "12 km" },
    ],
  }),

  buildAccommodation({
    _id: 10,
    id: "mekong-riverside-retreat",
    name: "Mekong Riverside Retreat",
    category: "Luxury Resort",
    region: "isan",
    city: "Nong Khai",
    district: "Tha Bo",
    addressLabel: "Nong Khai, Thailand",
    ratingAvg: 4.6,
    totalReviews: 52,
    basePrice: 5600,
    bedrooms: 1,
    renovatedMonthsAgo: 16,
    description:
      "Boutique villas right on the edge of the mighty Mekong, watching local longtail boats drift toward sunset over Laos.",
    descriptionExtra:
      "An open-air riverside pavilion serves fresh Mekong fish prepared with local herbs as the border lights flicker across the water.",
    facilities: ["Free Wi-Fi", "River View", "Pool"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    nearby: [
      { name: "Sala Keoku Sculpture Park", distance: "7.5 km" },
      { name: "Thai-Lao Friendship Bridge", distance: "5.0 km" },
      { name: "Tha Sadet Market", distance: "3.2 km" },
      { name: "Udon Thani Airport", distance: "58 km" },
    ],
  }),

  buildAccommodation({
    _id: 11,
    id: "khaoyai-vineyard-villas",
    name: "Khao Yai Vineyard Villas",
    category: "Private Villa",
    region: "isan",
    city: "Nakhon Ratchasima",
    district: "Pak Chong",
    addressLabel: "Khao Yai, Thailand",
    ratingAvg: 4.9,
    totalReviews: 83,
    basePrice: 11000,
    bedrooms: 2,
    renovatedMonthsAgo: 2,
    description:
      "Tuscan-inspired private stone villas tucked between rolling grapevines with cool mountain breezes year-round.",
    descriptionExtra:
      "Private wine tastings on your terrace, outdoor fireplace for chilly evenings, and waking to mist over the vines.",
    facilities: ["Free Wi-Fi", "Pool", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Parking"],
    nearby: [
      { name: "Khao Yai National Park Gate", distance: "8.0 km" },
      { name: "PB Valley Winery", distance: "4.5 km" },
      { name: "Primo Piazza", distance: "6.0 km" },
      { name: "Don Mueang Airport", distance: "135 km" },
    ],
  }),

  /* ================= ภาคใต้ (South) ================= */
  buildAccommodation({
    _id: 12,
    id: "amanpuri-retreat-villas",
    name: "Amanpuri Retreat Villas",
    category: "Private Villa",
    region: "south",
    city: "Phuket",
    district: "Cherngtalay",
    addressLabel: "Pansea Beach, Phuket, Thailand",
    ratingAvg: 4.9,
    totalReviews: 142,
    basePrice: 18500,
    bedrooms: 2,
    renovatedMonthsAgo: 1,
    description:
      "Iconic pavilions set within a coconut grove overlooking the Andaman Sea, setting the global standard for secluded coastal luxury.",
    descriptionExtra:
      "Private black-tiled swimming pool, direct steps to Pansea Beach's secluded cove and a holistic wellness centre.",
    facilities: ["Free Wi-Fi", "Pool", "Spa", "Gym"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Parking", "Hotel Transfer"],
    nearby: [
      { name: "Pansea Beach", distance: "0.1 km" },
      { name: "Surin Beach", distance: "1.2 km" },
      { name: "Catch Beach Club", distance: "4.5 km" },
      { name: "Phuket International Airport", distance: "22 km" },
    ],
  }),

  buildAccommodation({
    _id: 13,
    id: "railay-cliff-beach-villas",
    name: "Railay Cliff Beach Villas",
    category: "Luxury Resort",
    region: "south",
    city: "Krabi",
    district: "Ao Nang",
    addressLabel: "Railay Beach, Krabi, Thailand",
    ratingAvg: 4.7,
    totalReviews: 89,
    basePrice: 13500,
    bedrooms: 1,
    renovatedMonthsAgo: 9,
    description:
      "Accessible only by sea, these cliffside pavilions sit wedged between towering limestone karsts and turquoise Andaman waters.",
    descriptionExtra:
      "Listen to the gentle slap of waves against the rocks below while watching rock climbers scale the sheer limestone faces.",
    facilities: ["Free Wi-Fi", "Pool", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Hotel Transfer"],
    nearby: [
      { name: "Railay West Beach", distance: "0.2 km" },
      { name: "Phra Nang Cave Beach", distance: "0.8 km" },
      { name: "Railay Viewpoint", distance: "0.6 km" },
      { name: "Krabi Airport", distance: "28 km (via boat)" },
    ],
  }),

  buildAccommodation({
    _id: 14,
    id: "four-seasons-samui-cove",
    name: "Four Seasons Samui Cove",
    category: "Private Villa",
    region: "south",
    city: "Surat Thani",
    district: "Koh Samui",
    addressLabel: "Koh Samui, Thailand",
    ratingAvg: 4.8,
    totalReviews: 116,
    basePrice: 17200,
    bedrooms: 2,
    renovatedMonthsAgo: 3,
    description:
      "Hillside pool villas cascading down a private bay with uninterrupted views across the Gulf of Thailand.",
    descriptionExtra:
      "Surrounded by tropical gardens and fruit orchards, every villa offers an infinity-edge pool that merges with the horizon.",
    facilities: ["Free Wi-Fi", "Pool", "Spa", "Gym"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Parking", "Hotel Transfer"],
    nearby: [
      { name: "Choeng Mon Beach", distance: "2.0 km" },
      { name: "Fisherman's Village", distance: "6.0 km" },
      { name: "Big Buddha Temple", distance: "5.5 km" },
      { name: "Samui Airport", distance: "7.0 km" },
    ],
  }),
];

