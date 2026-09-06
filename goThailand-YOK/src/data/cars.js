/**
 * cars.js
 * ------------------------------------------------------------
 * Master Collection: cars (ข้อมูลรถเช่าหลัก)
 * สอดคล้องกับ Data Schema ของระบบ GoThailand
 *
 * ประกอบด้วย:
 *  - _id, brand, model, license_plate, category
 *  - registration_and_license: { plate_type, license_category, usage_type, service_scope, transport_permit_number, tax_expiry_date, compulsory_insurance_expiry_date, commercial_insurance }
 *  - specs: { seats, doors, transmission, fuel_type, luggage }
 *  - daily_rate, status, current_station
 *  - reviews_summary: { average_star, total_reviews }, reviews: [...]
 *  - pictures: [...], description, descriptionExtra
 * พร้อม backward-compatibility aliases/getters สำหรับ UI เดิม
 * ------------------------------------------------------------
 */

const GALLERY_INTERIOR = "/images/cars/interior.jpg";
const GALLERY_TRUNK = "/images/cars/trunk.jpg";

function galleryFor(mainImage) {
  return [mainImage, mainImage, GALLERY_INTERIOR, GALLERY_TRUNK];
}

function buildCar({
  _id,
  id,
  brand,
  model,
  licensePlate = "นข-9999 กรุงเทพมหานคร",
  category = "SUV",
  doors = 4,
  seats = 5,
  transmission = "Automatic",
  fuelType = "Petrol",
  luggage = "3 Large Bags",
  dailyRate = 2000,
  stationId = "ST-01",
  stationName = "Suvarnabhumi Airport Branch",
  stationCity = "Bangkok",
  averageStar = 4.8,
  totalReviews = 80,
  reviews = [],
  imagePath,
  description,
  descriptionExtra = "",
  insurancePolicy = "INS-COMM-998822",
  permitNumber = "TP-BKK-2026-0089",
}) {
  const pictures = galleryFor(imagePath);
  const fullName = `${brand} ${model}`;

  return {
    // --- Data Schema Master Specification ---
    _id,
    id, // String slug สำหรับ URL route
    brand,
    model,
    name: fullName,
    license_plate: licensePlate,
    category,
    registration_and_license: {
      plate_type: "GREEN_PLATE",
      license_category: "รถยนต์บริการธุรกิจ / รถยนต์บริการทัศนาจร (ป้ายเขียว)",
      usage_type: "RENTAL_SELF_DRIVE_AND_CHAUFFEUR",
      service_scope: "NATIONWIDE",
      transport_permit_number: permitNumber,
      tax_expiry_date: "2027-03-31",
      compulsory_insurance_expiry_date: "2027-03-31",
      commercial_insurance: {
        policy_number: insurancePolicy,
        insurance_company: "Viriyah Insurance",
        coverage_type: "First Class Commercial (ชั้น 1 เพื่อการพาณิชย์/รถเช่า)",
        expiry_date: "2027-03-31",
      },
    },
    specs: {
      seats,
      doors,
      transmission,
      fuel_type: fuelType,
      luggage,
    },
    daily_rate: dailyRate,
    status: "available",
    current_station: {
      station_id: stationId,
      name: stationName,
      city: stationCity,
    },
    reviews_summary: {
      average_star: averageStar,
      total_reviews: totalReviews,
    },
    reviews: reviews.length > 0 ? reviews : [
      { reviewer: "User A", star: 5, message: "รถสะอาดมาก ขับสนุก เครื่องแรงดี", date: "2024-10-01" },
      { reviewer: "User B", star: 4, message: "รับรถตรงเวลา บริการประทับใจ", date: "2024-09-28" },
    ],
    pictures,
    description,
    descriptionExtra,

    // --- Backward Compatibility Aliases สำหรับ UI เดิม ---
    type: category,
    image: imagePath,
    images: pictures,
    rating: averageStar,
    reviewsCount: totalReviews,
    reviewsList: reviews,
    pricePerDay: dailyRate,
    seats,
    transmission: transmission === "Automatic" ? "Auto" : transmission,
    fuel: fuelType,
    luggage,
  };
}

export const cars = [
  // --- คันที่ 9 ตรงตาม Schema ใน prompt / DATA.md เป๊ะ ๆ ---
  buildCar({
    _id: 9,
    id: "toyota-fortuner",
    brand: "Toyota",
    model: "Fortuner",
    licensePlate: "นข-9999 กรุงเทพมหานคร",
    category: "SUV",
    doors: 4,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    luggage: "4 Large Bags",
    dailyRate: 2500,
    stationId: "ST-01",
    stationName: "Suvarnabhumi Airport Branch",
    stationCity: "Bangkok",
    averageStar: 4.9,
    totalReviews: 97,
    imagePath: "/images/cars/toyota-fortuner.jpg",
    description:
      "Experience unparalleled comfort and capability with the Toyota Fortuner. Ideal for family trips or navigating both city streets and scenic routes in Thailand. This premium SUV offers a spacious interior, advanced safety features, and robust performance to elevate your journey.",
    descriptionExtra:
      "This premium SUV offers a spacious interior, advanced safety features, and robust performance to elevate your journey.",
  }),

  buildCar({
    _id: 1,
    id: "toyota-yaris",
    brand: "Toyota",
    model: "Yaris",
    licensePlate: "กข-1234 กรุงเทพมหานคร",
    category: "Economy",
    doors: 4,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggage: "2 Large Bags",
    dailyRate: 1200,
    averageStar: 4.8,
    totalReviews: 86,
    imagePath: "/images/cars/toyota-yaris.jpg",
    description:
      "A nimble, fuel-efficient hatchback that's perfect for weaving through city traffic and squeezing into tight parking spots. Easy to drive, easy on the budget.",
    descriptionExtra:
      "Great pick for solo travellers or couples exploring Bangkok and nearby day trips without needing extra space.",
  }),

  buildCar({
    _id: 2,
    id: "honda-civic",
    brand: "Honda",
    model: "Civic",
    licensePlate: "ฎร-5678 กรุงเทพมหานคร",
    category: "Sedan",
    doors: 4,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggage: "3 Large Bags",
    dailyRate: 1800,
    averageStar: 4.9,
    totalReviews: 124,
    imagePath: "/images/cars/honda-civic.jpg",
    description:
      "A refined, comfortable sedan with a smooth ride and confident handling — ideal for longer highway drives between provinces.",
    descriptionExtra:
      "Spacious cabin and a generous trunk make it a solid choice for a small family trip or a business commute in comfort.",
  }),

  buildCar({
    _id: 3,
    id: "honda-hrv",
    brand: "Honda",
    model: "HR-V",
    licensePlate: "ฆง-4321 กรุงเทพมหานคร",
    category: "SUV",
    doors: 4,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Hybrid",
    luggage: "3 Large Bags",
    dailyRate: 2200,
    averageStar: 4.8,
    totalReviews: 73,
    imagePath: "/images/cars/honda-hrv.jpg",
    description:
      "A stylish compact SUV with a hybrid drivetrain — quiet, efficient, and just tall enough to see the road clearly through busy streets.",
    descriptionExtra:
      "A great balance between city agility and weekend-trip versatility, without the fuel bill of a full-size SUV.",
  }),

  buildCar({
    _id: 4,
    id: "toyota-veloz",
    brand: "Toyota",
    model: "Veloz",
    licensePlate: "ฮว-8765 กรุงเทพมหานคร",
    category: "MPV",
    doors: 4,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggage: "4 Large Bags",
    dailyRate: 2000,
    averageStar: 4.7,
    totalReviews: 61,
    imagePath: "/images/cars/toyota-veloz.jpg",
    description:
      "A practical 7-seat MPV built for groups — three rows of seating and plenty of room for luggage make it the easy choice for family holidays.",
    descriptionExtra:
      "Sliding doors and a low step-in height make loading passengers and bags quick at every stop along the way.",
  }),

  buildCar({
    _id: 5,
    id: "mercedes-cclass",
    brand: "Mercedes-Benz",
    model: "C-Class",
    licensePlate: "ษศ-9988 กรุงเทพมหานคร",
    category: "Luxury",
    doors: 4,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggage: "3 Large Bags",
    dailyRate: 4500,
    averageStar: 4.9,
    totalReviews: 42,
    imagePath: "/images/cars/mercedes-cclass.jpg",
    description:
      "Arrive in style. The Mercedes-Benz C-Class pairs a hushed, premium cabin with confident performance for special occasions or executive travel.",
    descriptionExtra:
      "Leather upholstery, ambient lighting, and a smooth ride make every trip feel like an occasion of its own.",
  }),
];

export const carTypes = [...new Set(cars.map((c) => c.category))];

export const pickupLocations = [
  "Bangkok (BKK) Suvarnabhumi Airport",
  "Bangkok (DMK) Don Mueang Airport",
  "Phuket (HKT) International Airport",
  "Chiang Mai (CNX) International Airport",
];

export function getCarById(id) {
  return cars.find(
    (c) => String(c._id) === String(id) || String(c.id) === String(id)
  );
}
