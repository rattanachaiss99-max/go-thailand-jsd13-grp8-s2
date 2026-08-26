/**
 * cars.js
 * ------------------------------------------------------------
 * ข้อมูลจำลอง (mock data) ของรถให้เช่า ใช้หลักการเดียวกับ properties.js
 * คือเก็บทุกอย่างไว้ที่ไฟล์เดียว (single source of truth) แล้วให้หน้า/
 * component อื่น ๆ import ไปใช้ต่อ แทนที่จะ hardcode ซ้ำหลายที่
 * แต่ละคัน: id, name, type (ใช้เป็นทั้ง badge บนรูป และตัวกรอง Car Type),
 * image (รูปหลัก ใช้ในการ์ด), images (แกลเลอรี 4 รูป ใช้ในหน้า Detail),
 * rating, reviews, seats/transmission/fuel/luggage (แถวไอคอน + "Key
 * Specifications" ในหน้า Detail), pricePerDay, description/descriptionExtra
 * (ข้อความแนะนำรถในหน้า Detail)
 * ------------------------------------------------------------
 */

// รูปแกลเลอรีที่ใช้ร่วมกันทุกคัน (interior/trunk) เพื่อไม่ต้องหารูปจริง
// แยกทีละคัน 6 x 2 รูป — ยังคงได้แกลเลอรี 4 รูปต่อคันตามดีไซน์ต้นแบบ
// (รูปหลักซ้ำเป็นรูปแรกของแกลเลอรี + รูป interior/trunk กลาง + รูปหลัก
// ซ้ำอีกครั้งเป็นช่องสุดท้ายที่จะโชว์ป้าย "+N Photos" ทับ)
const GALLERY_INTERIOR = "/images/cars/interior.jpg";
const GALLERY_TRUNK = "/images/cars/trunk.jpg";

function galleryFor(mainImage) {
  return [mainImage, mainImage, GALLERY_INTERIOR, GALLERY_TRUNK];
}

export const cars = [
  {
    id: "toyota-yaris",
    name: "Toyota Yaris",
    type: "Economy",
    image: "/images/cars/toyota-yaris.jpg",
    images: galleryFor("/images/cars/toyota-yaris.jpg"),
    rating: 4.8,
    reviews: 86,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    luggage: "2 Large Bags",
    pricePerDay: 1200,
    description:
      "A nimble, fuel-efficient hatchback that's perfect for weaving through city traffic and squeezing into tight parking spots. Easy to drive, easy on the budget.",
    descriptionExtra:
      "Great pick for solo travellers or couples exploring Bangkok and nearby day trips without needing extra space.",
  },
  {
    id: "honda-civic",
    name: "Honda Civic",
    type: "Sedan",
    image: "/images/cars/honda-civic.jpg",
    images: galleryFor("/images/cars/honda-civic.jpg"),
    rating: 4.9,
    reviews: 124,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    luggage: "3 Large Bags",
    pricePerDay: 1800,
    description:
      "A refined, comfortable sedan with a smooth ride and confident handling — ideal for longer highway drives between provinces.",
    descriptionExtra:
      "Spacious cabin and a generous trunk make it a solid choice for a small family trip or a business commute in comfort.",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    type: "SUV",
    image: "/images/cars/toyota-fortuner.jpg",
    images: galleryFor("/images/cars/toyota-fortuner.jpg"),
    rating: 4.9,
    reviews: 97,
    seats: 7,
    transmission: "Auto",
    fuel: "Diesel",
    luggage: "4 Large Bags",
    pricePerDay: 2500,
    description:
      "Experience unparalleled comfort and capability with the Toyota Fortuner. Ideal for family trips or navigating both city streets and scenic routes in Thailand.",
    descriptionExtra:
      "This premium SUV offers a spacious interior, advanced safety features, and robust performance to elevate your journey.",
  },
  {
    id: "honda-hrv",
    name: "Honda HR-V",
    type: "SUV",
    image: "/images/cars/honda-hrv.jpg",
    images: galleryFor("/images/cars/honda-hrv.jpg"),
    rating: 4.8,
    reviews: 73,
    seats: 5,
    transmission: "Auto",
    fuel: "Hybrid",
    luggage: "3 Large Bags",
    pricePerDay: 2200,
    description:
      "A stylish compact SUV with a hybrid drivetrain — quiet, efficient, and just tall enough to see the road clearly through busy streets.",
    descriptionExtra:
      "A great balance between city agility and weekend-trip versatility, without the fuel bill of a full-size SUV.",
  },
  {
    id: "toyota-veloz",
    name: "Toyota Veloz",
    type: "MPV",
    image: "/images/cars/toyota-veloz.jpg",
    images: galleryFor("/images/cars/toyota-veloz.jpg"),
    rating: 4.7,
    reviews: 61,
    seats: 7,
    transmission: "Auto",
    fuel: "Petrol",
    luggage: "4 Large Bags",
    pricePerDay: 2000,
    description:
      "A practical 7-seat MPV built for groups — three rows of seating and plenty of room for luggage make it the easy choice for family holidays.",
    descriptionExtra:
      "Sliding doors and a low step-in height make loading passengers and bags quick at every stop along the way.",
  },
  {
    id: "mercedes-cclass",
    name: "Mercedes-Benz C-Class",
    type: "Luxury",
    image: "/images/cars/mercedes-cclass.jpg",
    images: galleryFor("/images/cars/mercedes-cclass.jpg"),
    rating: 4.9,
    reviews: 42,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    luggage: "3 Large Bags",
    pricePerDay: 4500,
    description:
      "Arrive in style. The Mercedes-Benz C-Class pairs a hushed, premium cabin with confident performance for special occasions or executive travel.",
    descriptionExtra:
      "Leather upholstery, ambient lighting, and a smooth ride make every trip feel like an occasion of its own.",
  },
];

// รายชื่อประเภทรถทั้งหมด ดึงจาก cars จริงโดยตรง (ไม่ hardcode ซ้ำ)
// เพื่อให้ตัวกรอง "Car Type" ในแถบด้านซ้ายตรงกับข้อมูลจริงเสมอ
export const carTypes = [...new Set(cars.map((c) => c.type))];

// ทำเลรับ-คืนรถที่เลือกได้ในหน้า Detail (ยังไม่ผูกกับข้อมูลจริง เป็น demo
// เหมือน select ประเทศในหน้า Checkout)
export const pickupLocations = [
  "Bangkok (BKK Airport)",
  "Bangkok (DMK Airport)",
  "Phuket (HKT Airport)",
  "Chiang Mai (CNX Airport)",
];

/** หารถคันเดียวจาก id ใช้ในหน้า CarDetail (เหมือน getPropertyById ของที่พัก) */
export function getCarById(id) {
  return cars.find((c) => c.id === id);
}
