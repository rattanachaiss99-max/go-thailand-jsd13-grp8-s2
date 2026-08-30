// ============================================================================
// Mock places — ทำหน้าที่เหมือน collection `places`
// `wishlist` ใน Customer เก็บแต่ placeId (string) จึงต้อง join กับที่นี่
// เพื่อแสดงชื่อ/จังหวัด/รูป — ตอนต่อ DB จริงเปลี่ยนเป็น $lookup
// placeId ทุกตัวต้องตรงกับ mockUser.wishlist
// ============================================================================

export const mockPlaces = [
  {
    placeId: 'wat-arun-bkk',
    name: 'Wat Arun',
    province: 'Bangkok',
    category: 'temple',
    image: '/images/places/wat-arun.png'
  },
  {
    placeId: 'doi-inthanon',
    name: 'Doi Inthanon National Park',
    province: 'Chiang Mai',
    category: 'nature',
    image: '/images/places/doi-inthanon.png'
  },
  {
    placeId: 'maya-bay',
    name: 'Maya Bay',
    province: 'Krabi',
    category: 'beach',
    image: '/images/places/maya-bay.png'
  },
  {
    placeId: 'phi-phi-leh',
    name: 'Phi Phi Leh Lagoon',
    province: 'Krabi',
    category: 'beach',
    image: '/images/places/phi-phi-leh.png'
  },
  {
    placeId: 'ayutthaya-park',
    name: 'Ayutthaya Historical Park',
    province: 'Phra Nakhon Si Ayutthaya',
    category: 'heritage',
    image: '/images/places/ayutthaya-park.png'
  },
  {
    placeId: 'erawan-falls',
    name: 'Erawan Waterfall',
    province: 'Kanchanaburi',
    category: 'nature',
    image: '/images/places/erawan-falls.png'
  },
  {
    placeId: 'railay-beach',
    name: 'Railay Beach',
    province: 'Krabi',
    category: 'beach',
    image: '/images/places/railay-beach.png'
  },
  {
    placeId: 'chatuchak-market',
    name: 'Chatuchak Weekend Market',
    province: 'Bangkok',
    category: 'market',
    image: '/images/places/chatuchak-market.png'
  }
];

export default mockPlaces;
