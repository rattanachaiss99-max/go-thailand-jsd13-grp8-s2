/**
 * properties.js
 * ------------------------------------------------------------
 * Master Collection: Accommodation (ข้อมูลที่พักหลัก)
 * สอดคล้องกับ Data Schema ของระบบ GoThailand
 *
 * ประกอบด้วย:
 *  - _id, name, category, categories, description
 *  - location: { city, district, address_label, map_coordinates, nearby_landmarks }
 *  - rating_avg, total_reviews, is_featured, status
 *  - facilities, special_options
 *  - base_price_per_night, currency, pricing_rules
 *  - rooms: [{ room_type_id, name, bed_type, max_guests, price_per_night, available_quantity }]
 *  - pictures, policies: { cancellation_policy, check_in_time, check_out_time }
 *  - created_at, updated_at
 * พร้อม backward-compatibility aliases/getters เพื่อให้ UI เดิมทำงานได้ต่อเนื่อง 100%
 * ------------------------------------------------------------
 */

export { hotelCategories, hotelSpecialOptions } from "./masters.js";

function imagesFor(id) {
  return [1, 2, 3, 4, 5].map((n) => `/images/${id}/${n}.jpg`);
}

function makeLocation(city, district, addressLabel, lat, lng, nearby) {
  const loc = {
    city,
    district,
    address_label: addressLabel,
    map_coordinates: { lat, lng },
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
  categories = [category],
  region,
  city,
  district,
  addressLabel,
  lat = 13.7563,
  lng = 100.5018,
  ratingAvg,
  totalReviews,
  isFeatured = false,
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
  pricingRules = [
    {
      id: 1,
      name: "Weekend Surcharge",
      effective_days: ["Friday", "Saturday"],
      additional_charge: 500.0,
    },
  ],
  amenities = [],
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
    categories,
    region,
    description,
    descriptionExtra,
    location: makeLocation(city, district, addressLabel, lat, lng, nearby),
    rating_avg: ratingAvg,
    total_reviews: totalReviews,
    is_featured: isFeatured,
    status: "active",
    facilities,
    special_options: specialOptions,
    base_price_per_night: basePrice,
    currency: "THB",
    pricing_rules: pricingRules,
    rooms: defaultRooms,
    pictures,
    policies,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",

    // --- Backward Compatibility Aliases สำหรับ UI เดิม ---
    type: category,
    rating: ratingAvg,
    reviews: totalReviews,
    pricePerNight: basePrice,
    images: pictures,
    bedrooms,
    renovatedMonthsAgo,
    tags: specialOptions.slice(0, 3),
    keywords: facilities.slice(0, 4),
    amenities,
    nearby,
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
    categories: ["Private Villa", "Luxury Resort"],
    region: "central",
    city: "Bangkok",
    district: "Riverside",
    addressLabel: "Riverside, Bangkok, Thailand",
    lat: 13.7234,
    lng: 100.5147,
    ratingAvg: 5.0,
    totalReviews: 124,
    isFeatured: true,
    basePrice: 12500,
    bedrooms: 2,
    renovatedMonthsAgo: 3,
    description:
      "Experience unparalleled luxury in the heart of Bangkok. The Siam Heritage Sanctuary offers a profound sense of place, blending deep-rooted Thai architectural traditions with exquisite contemporary comfort. Set amidst lush, manicured gardens along the historic Chao Phraya River, this exclusive retreat promises serenity and absolute privacy.",
    descriptionExtra:
      "Each villa is a masterpiece of design — teak interiors, towering vaulted ceilings and curated antiques. Step outside to your expansive private deck, where a personal infinity pool merges visually with the river beyond.",
    facilities: [
      "Free High-Speed Wi-Fi",
      "Private Infinity Pool",
      "24/7 Butler Service",
      "Holistic Spa",
      "State-of-the-Art Gym",
      "Fine Dining",
    ],
    specialOptions: [
      "Breakfast Included",
      "Free Cancellation",
      "Private Pool",
      "Beachfront",
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
    pricingRules: [
      {
        id: 1,
        name: "Weekend Surcharge",
        effective_days: ["Friday", "Saturday"],
        additional_charge: 500.0,
      },
      {
        id: 2,
        name: "Thai New Year / Songkran",
        effective_from: "2026-04-10T00:00:00Z",
        effective_to: "2026-04-19T23:59:59Z",
        additional_charge: 1500.0,
      },
    ],
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
  }),

  buildAccommodation({
    _id: 2,
    id: "skyline-executive-suites",
    name: "Skyline Executive Suites",
    category: "Luxury Hotel",
    categories: ["Luxury Hotel"],
    region: "central",
    city: "Bangkok",
    district: "Sukhumvit",
    addressLabel: "Sukhumvit, Bangkok, Thailand",
    lat: 13.7423,
    lng: 100.5612,
    ratingAvg: 4.7,
    totalReviews: 88,
    isFeatured: true,
    basePrice: 14200,
    bedrooms: 1,
    renovatedMonthsAgo: 8,
    description:
      "Sleek executive suites high above Sukhumvit, with panoramic skyline views and direct access to the BTS for effortless city exploring.",
    descriptionExtra:
      "Floor-to-ceiling glass wraps every suite, turning the Bangkok skyline into the room's centrepiece day and night.",
    facilities: ["Free Wi-Fi", "Pool", "Gym", "Rooftop Bar"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    amenities: [
      { icon: "🌆", label: "Skyline city view" },
      { icon: "🍸", label: "Rooftop bar" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Rooftop infinity pool" },
      { icon: "🏋️", label: "24-hour gym" },
      { icon: "🚇", label: "BTS access" },
    ],
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
    categories: ["B&B"],
    region: "central",
    city: "Ayutthaya",
    district: "Phra Nakhon Si Ayutthaya",
    addressLabel: "Ayutthaya, Thailand",
    lat: 14.3532,
    lng: 100.5684,
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
    amenities: [
      { icon: "🏛️", label: "Historical temple view" },
      { icon: "🛶", label: "Private longtail boat" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍳", label: "Breakfast included" },
      { icon: "🚲", label: "Bicycle tour" },
      { icon: "🌿", label: "Herb garden" },
    ],
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
    categories: ["Luxury Resort"],
    region: "central",
    city: "Kanchanaburi",
    district: "Sai Yok",
    addressLabel: "Sai Yok, Kanchanaburi, Thailand",
    lat: 14.2831,
    lng: 98.9842,
    ratingAvg: 4.6,
    totalReviews: 70,
    basePrice: 6500,
    bedrooms: 1,
    renovatedMonthsAgo: 15,
    description:
      "Floating eco-villas moored on the Kwai Noi River, surrounded by sheer limestone cliffs and untouched rainforest.",
    descriptionExtra:
      "Step directly from your bedroom terrace into the cool, flowing river water for an authentic jungle experience.",
    facilities: ["River Access", "Spa", "Free Wi-Fi"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    amenities: [
      { icon: "🌊", label: "Direct river access" },
      { icon: "🛶", label: "Bamboo rafting" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🌿", label: "Jungle spa" },
      { icon: "🍽️", label: "Floating restaurant" },
      { icon: "🔥", label: "Campfire lounge" },
    ],
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
    categories: ["Private Villa"],
    region: "central",
    city: "Prachuap Khiri Khan",
    district: "Hua Hin",
    addressLabel: "Hua Hin, Thailand",
    lat: 12.5684,
    lng: 99.9577,
    ratingAvg: 4.9,
    totalReviews: 104,
    basePrice: 16800,
    bedrooms: 3,
    renovatedMonthsAgo: 5,
    description:
      "Colonial-inspired beachfront residence with a manicured lawn rolling down to the golden sands of Hua Hin's royal coast.",
    descriptionExtra:
      "Generous veranda living, private infinity pool and dedicated staff make this villa the choice for multi-generational escapes.",
    facilities: ["Free Wi-Fi", "Pool", "Beach Access", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Private Pool", "Beachfront"],
    amenities: [
      { icon: "🏖️", label: "Direct beach access" },
      { icon: "🏊", label: "Private lap pool" },
      { icon: "🍳", label: "Private chef service" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "⛳", label: "Golf course nearby" },
      { icon: "🌅", label: "Sunrise deck" },
    ],
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
    categories: ["Luxury Resort"],
    region: "north",
    city: "Chiang Mai",
    district: "Mae Rim",
    addressLabel: "Mae Rim, Chiang Mai, Thailand",
    lat: 18.9142,
    lng: 98.9452,
    ratingAvg: 4.7,
    totalReviews: 76,
    basePrice: 9500,
    bedrooms: 1,
    renovatedMonthsAgo: 4,
    description:
      "Canopy tents suspended above a private valley, with open-air bathing, forest dining and guided morning treks through the highlands surrounding Chiang Mai.",
    descriptionExtra:
      "A rare blend of adventure and comfort — wake to birdsong and mist rolling through the canopy below your deck.",
    facilities: ["Free Wi-Fi", "Breakfast Included", "Forest Dining"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
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
  }),

  buildAccommodation({
    _id: 7,
    id: "doi-mist-mountain-lodge",
    name: "Doi Mist Mountain Lodge",
    category: "B&B",
    categories: ["B&B"],
    region: "north",
    city: "Mae Hong Son",
    district: "Pai",
    addressLabel: "Pai, Mae Hong Son, Thailand",
    lat: 19.3582,
    lng: 98.4412,
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
  }),

  buildAccommodation({
    _id: 8,
    id: "lanna-riverside-boutique",
    name: "Lanna Riverside Boutique",
    category: "Luxury Hotel",
    categories: ["Luxury Hotel"],
    region: "north",
    city: "Chiang Rai",
    district: "Mueang Chiang Rai",
    addressLabel: "Chiang Rai, Thailand",
    lat: 19.9072,
    lng: 99.8325,
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
    amenities: [
      { icon: "🌊", label: "Kok River view" },
      { icon: "🏊", label: "Courtyard pool" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍵", label: "Afternoon tea service" },
      { icon: "🎨", label: "Lanna art workshop" },
      { icon: "🍽️", label: "Riverside dining" },
    ],
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
    categories: ["B&B"],
    region: "isan",
    city: "Ubon Ratchathani",
    district: "Warin Chamrap",
    addressLabel: "Ubon Ratchathani, Thailand",
    lat: 15.1984,
    lng: 104.8623,
    ratingAvg: 4.8,
    totalReviews: 45,
    basePrice: 4200,
    bedrooms: 1,
    renovatedMonthsAgo: 7,
    description:
      "Elevated teak wood pavilions surrounded by emerald paddies, offering an authentic glimpse of rural northeast living.",
    descriptionExtra:
      "Participate in morning sticky rice rituals, cycle quiet village lanes and fall asleep to the gentle chorus of the fields.",
    facilities: ["Free Wi-Fi", "Breakfast Included", "Cooking Class"],
    specialOptions: ["Breakfast Included", "Free Cancellation"],
    amenities: [
      { icon: "🌾", label: "Paddy field view" },
      { icon: "🍳", label: "Farm-to-table breakfast" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🚲", label: "Complimentary bikes" },
      { icon: "🍲", label: "Isan cooking class" },
      { icon: "🧵", label: "Silk weaving demo" },
    ],
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
    categories: ["Luxury Resort"],
    region: "isan",
    city: "Nong Khai",
    district: "Tha Bo",
    addressLabel: "Nong Khai, Thailand",
    lat: 17.8472,
    lng: 102.5831,
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
    amenities: [
      { icon: "🌊", label: "Mekong River view" },
      { icon: "🌅", label: "Sunset cocktail bar" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Riverfront pool" },
      { icon: "🍳", label: "Breakfast included" },
      { icon: "🧘", label: "Morning yoga deck" },
    ],
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
    categories: ["Private Villa"],
    region: "isan",
    city: "Nakhon Ratchasima",
    district: "Pak Chong",
    addressLabel: "Khao Yai, Thailand",
    lat: 14.5423,
    lng: 101.4112,
    ratingAvg: 4.9,
    totalReviews: 83,
    basePrice: 11000,
    bedrooms: 2,
    renovatedMonthsAgo: 2,
    description:
      "Tuscan-inspired private stone villas tucked between rolling grapevines with cool mountain breezes year-round.",
    descriptionExtra:
      "Private wine tastings on your terrace, outdoor fireplace for chilly evenings, and waking to mist over the vines.",
    facilities: ["Free Wi-Fi", "Wine Tasting", "Pool", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Private Pool"],
    amenities: [
      { icon: "🍇", label: "Vineyard view" },
      { icon: "🍷", label: "Private wine tasting" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🏊", label: "Private plunge pool" },
      { icon: "🔥", label: "Outdoor fireplace" },
      { icon: "🍽️", label: "Fine dining on-site" },
    ],
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
    categories: ["Private Villa", "Luxury Resort"],
    region: "south",
    city: "Phuket",
    district: "Cherngtalay",
    addressLabel: "Pansea Beach, Phuket, Thailand",
    lat: 7.9842,
    lng: 98.2778,
    ratingAvg: 4.9,
    totalReviews: 142,
    isFeatured: true,
    basePrice: 18500,
    bedrooms: 2,
    renovatedMonthsAgo: 1,
    description:
      "Iconic pavilions set within a coconut grove overlooking the Andaman Sea, setting the global standard for secluded coastal luxury.",
    descriptionExtra:
      "Private black-tiled swimming pool, direct steps to Pansea Beach's secluded cove and a holistic wellness centre.",
    facilities: ["Free Wi-Fi", "Pool", "Spa", "Gym", "Beach Access"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Private Pool", "Beachfront"],
    amenities: [
      { icon: "🏖️", label: "Private beach access" },
      { icon: "🏊", label: "Private infinity pool" },
      { icon: "🌿", label: "Holistic wellness spa" },
      { icon: "⛵", label: "Private yacht charter" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍽️", label: "Japanese & Thai dining" },
    ],
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
    categories: ["Luxury Resort"],
    region: "south",
    city: "Krabi",
    district: "Ao Nang",
    addressLabel: "Railay Beach, Krabi, Thailand",
    lat: 8.0121,
    lng: 98.8398,
    ratingAvg: 4.7,
    totalReviews: 89,
    basePrice: 13500,
    bedrooms: 1,
    renovatedMonthsAgo: 9,
    description:
      "Accessible only by sea, these cliffside pavilions sit wedged between towering limestone karsts and turquoise Andaman waters.",
    descriptionExtra:
      "Listen to the gentle slap of waves against the rocks below while watching rock climbers scale the sheer limestone faces.",
    facilities: ["Free Wi-Fi", "Pool", "Beach Access", "Spa"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Beachfront"],
    amenities: [
      { icon: "🧗", label: "Rock climbing access" },
      { icon: "🏖️", label: "Steps to Railay West" },
      { icon: "🏊", label: "Cliffside infinity pool" },
      { icon: "🛶", label: "Sea kayaking" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍹", label: "Sunset bar" },
    ],
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
    categories: ["Private Villa", "Luxury Resort"],
    region: "south",
    city: "Surat Thani",
    district: "Koh Samui",
    addressLabel: "Koh Samui, Thailand",
    lat: 9.5784,
    lng: 100.0124,
    ratingAvg: 4.8,
    totalReviews: 116,
    basePrice: 17200,
    bedrooms: 2,
    renovatedMonthsAgo: 3,
    description:
      "Hillside pool villas cascading down a private bay with uninterrupted views across the Gulf of Thailand.",
    descriptionExtra:
      "Surrounded by tropical gardens and fruit orchards, every villa offers an infinity-edge pool that merges with the horizon.",
    facilities: ["Free Wi-Fi", "Pool", "Beach Access", "Spa", "Gym"],
    specialOptions: ["Breakfast Included", "Free Cancellation", "Private Pool", "Beachfront"],
    amenities: [
      { icon: "🌊", label: "Gulf of Thailand views" },
      { icon: "🏊", label: "Private plunge pool" },
      { icon: "🏖️", label: "Private sandy cove" },
      { icon: "🥊", label: "Muay Thai ring on-site" },
      { icon: "📶", label: "Free Wi-Fi" },
      { icon: "🍽️", label: "Beachfront grill" },
    ],
    nearby: [
      { name: "Choeng Mon Beach", distance: "2.0 km" },
      { name: "Fisherman's Village", distance: "6.0 km" },
      { name: "Big Buddha Temple", distance: "5.5 km" },
      { name: "Samui Airport", distance: "7.0 km" },
    ],
  }),
];

/** ค้นหาที่พักจาก id หรือ _id */
export function getPropertyById(id) {
  return properties.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );
}

/** คืนค่าที่พักอื่น ๆ ที่ไม่ใช่ id ที่ระบุ — ใช้กับ "You might also like" */
export function getOtherProperties(excludeId, count = 3) {
  return properties
    .filter((p) => String(p.id) !== String(excludeId) && String(p._id) !== String(excludeId))
    .slice(0, count);
}

/**
 * รายชื่อ keyword สิ่งอำนวยความสะดวกทั้งหมดแบบไม่ซ้ำ
 */
export const facilityKeywords = [
  ...new Set(properties.flatMap((p) => p.keywords)),
].sort();

/**
 * ตัวเลือกของตัวกรอง "Number of bedrooms"
 */
export const bedroomOptions = [
  { value: "1", label: "1 bedroom/studio", test: (bedrooms) => bedrooms === 1 },
  { value: "2", label: "2 bedrooms", test: (bedrooms) => bedrooms === 2 },
  { value: "3+", label: "3+ bedrooms", test: (bedrooms) => bedrooms >= 3 },
];

/**
 * ตัวเลือกของตัวกรอง "Opening/renovation time"
 */
export const renovationOptions = [
  { value: "6m", label: "Within 6 months", maxMonths: 6 },
  { value: "1y", label: "Within 1 year", maxMonths: 12 },
  { value: "2y", label: "Within 2 years", maxMonths: 24 },
];
