Car
1. Master Collection: cars (ข้อมูลรถเช่าหลัก) 

{
  "_id": 9,
  "brand": "Toyota",
  "model": "Camry", // ** ในภาพตัวอย่างเป็น Camry แต่ข้อมูลด้านในเป็น SUV/Fortuner **
  "license_plate": "นข-9999 กรุงเทพมหานคร",
  "category": "SUV", // ** แก้ไข: จาก "Sedan" เป็น "SUV" ให้ตรงกับภาพ **
  
  "registration_and_license": {
    "plate_type": "GREEN_PLATE",
    "license_category": "รถยนต์บริการธุรกิจ / รถยนต์บริการทัศนาจร (ป้ายเขียว)",
    "usage_type": "RENTAL_SELF_DRIVE_AND_CHAUFFEUR",
    "service_scope": "NATIONWIDE",
    "transport_permit_number": "TP-BKK-2026-0089",
    "tax_expiry_date": "2027-03-31",
    "compulsory_insurance_expiry_date": "2027-03-31",
    "commercial_insurance": {
      "policy_number": "INS-COMM-998822",
      "insurance_company": "Viriyah Insurance",
      "coverage_type": "First Class Commercial (ชั้น 1 เพื่อการพาณิชย์/รถเช่า)",
      "expiry_date": "2027-03-31"
    }
  },

  "specs": {
    "seats": 7, // ** แก้ไข: จาก 5 เป็น 7 **
    "doors": 4,
    "transmission": "Automatic",
    "fuel_type": "Diesel", // ** แก้ไข: จาก Gasoline 95 เป็น Diesel **
    "luggage": "4 Large Bags" // ** เพิ่มใหม่: ข้อมูลจำนวนกระเป๋า **
  },
  
  "daily_rate": 2500.00, // ** แก้ไข: จาก 1500.00 เป็น 2500.00 **
  "status": "available",
  "current_station": {
    "station_id": "ST-01",
    "name": "Suvarnabhumi Airport Branch",
    "city": "Bangkok"
  },

  "reviews_summary": { // ** เพิ่มใหม่: สรุปคะแนนรีวิว **
    "average_star": 4.9,
    "total_reviews": 97
  },
  
  "reviews": [
    { "reviewer": "User A", "star": 5, "message": "xxxx", "date": "2024-10-01" },
    { "reviewer": "User B", "star": 4, "message": "xxxx", "date": "2024-09-28" }
    // ...
  ],
  "pictures": [
    "/images/cars/fortuner_main.jpg", // ** ภาพหลักขนาดใหญ่ **
    "/images/cars/fortuner_interior_1.jpg", // ** ภาพเล็กด้านล่าง **
    "/images/cars/fortuner_interior_2.jpg",
    "/images/cars/fortuner_rear.jpg"
  ],
  "description": "Experience unparalleled comfort and capability with the Toyota Fortuner. Ideal for family trips or navigating both city streets and scenic routes in Thailand. This premium SUV offers a spacious interior, advanced safety features, and robust performance to elevate your journey." 
}

Transaction: BookingItems (เมื่อเกิดการจองรถเช่า) 

{
  "_id": 77777,
  "booking_id": 99999,
  "booking_reference": "GT-CR-2026-00128", // ** เพิ่มใหม่: เลขอ้างอิงการจองจากหน้า Confirmation **
  "item_type": "car",
  "car_id": 9,
  
  "car_snapshot": {
    "brand": "Toyota",
    "model": "Camry",
    "license_plate": "นข-9999 กรุงเทพมหานคร",
    "category": "SUV", // ** เพิ่ม/แก้ไขให้ตรงกับภาพ **
    "license_category": "รถยนต์บริการธุรกิจ / รถยนต์บริการทัศนาจร (ป้ายเขียว)",
    "plate_type": "GREEN_PLATE",
    "commercial_insurance_policy": "INS-COMM-998822",
    "commercial_insurance_expiry": "2027-03-31",
    "tax_expiry_date": "2027-03-31",
    "seats": 7 // ** แก้ไข: จาก 5 เป็น 7 **
  },
  
  "rental_type": "SELF_DRIVE",
  "start_date": "2024-10-15T03:00:00Z", // ** เวลา 10:00 AM ICT (UTC+7) **
  "end_date": "2024-10-18T03:00:00Z",   // ** เวลา 10:00 AM ICT (UTC+7) **
  
  "pickup": {
    "station_id": "ST-01",
    "station_name": "Bangkok (BKK) Suvarnabhumi Airport",
    "location_description": "Gate 3, Arrival Hall",
    "contact_phone": "02-123-4567"
  },
  "dropoff": {
    "station_id": "ST-01",
    "station_name": "Bangkok (BKK) Suvarnabhumi Airport",
    "location_description": "Gate 3, Arrival Hall",
    "contact_phone": "02-123-4567"
  },
  "traveler_info": { // ** เพิ่มใหม่: ข้อมูลผู้เดินทาง **
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 234 567 890",
    "country": "United States"
  },
  "driver_info": {
    "driver_name": "John Doe",
    "driver_license_no": "DL-12345678",
    "license_country": "United States", // ** เพิ่มใหม่ **
    "driver_age": 35 // ** เพิ่มใหม่ **
  },
  
  "pricing": { // ** จัดกลุ่มข้อมูลราคาใหม่ **
    "daily_rate": 2500.00, // ** แก้ไข: จาก 1500 เป็น 2500 **
    "rental_days": 3,
    "base_rate": 7500.00, // ** (2500 x 3) **
    "service_fee": 0.00, // ** ในภาพเป็น 0 **
    "taxes_and_fees": { // ** ในภาพบอกว่า included **
      "amount": 0.00,
      "is_included": true
    },
    "total_price": 7500.00 // ** แก้ไข: จาก 4500 เป็น 7500 **
  },
  
  "payment_info": { // ** เพิ่มใหม่: จากหน้า Checkout **
    "payment_method": "CREDIT_DEBIT_CARD",
    "card_info": {
      "name_on_card": "John Doe",
      "card_number_masked": "**** **** **** 0000",
      "expiry_date": "MM/YY"
    }
  },
  
  "billing_address": { // ** เพิ่มใหม่: แม้จะ "Same as traveler" ก็ควรเก็บข้อมูลไว้ **
    "is_same_as_traveler": true,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 234 567 890",
    "country": "United States"
    // ที่อยู่รายละเอียดเพิ่มเติม...
  },
  
  "special_requests": "", // ** เพิ่มใหม่: ช่องใส่ Request พิเศษ **
  "terms_accepted": true // ** เพิ่มใหม่: ยอมรับเงื่อนไขการเช่า **
}


Guide

2. Master Collection: guides (ข้อมูลไกด์หลัก) 

{
  "_id": 501,
  "name": "Narin S.",
  "nickname": "Narin",
  "gender": "male",
  "avatar_url": "https://images.example.com/guides/narin-avatar.jpg",
  "phone": "081-234-5678",
  "email": "narin.guide@example.com",
  "line_id": "narin_tour",
  
  "license": {
    "license_number": "11-99999",
    "license_category": "มัคคุเทศก์ทั่วไป (บรอนซ์เงิน)",
    "scope_type": "NATIONWIDE",
    "scope_description": "นำเที่ยวได้ทั่วราชอาณาจักร (ทั่วประเทศ)",
    "permitted_regions": ["ALL"],
    "issue_date": "2024-01-15T00:00:00Z",
    "expiry_date": "2029-01-14T00:00:00Z",
    "verified": true
  },

  "languages": ["English", "Thai"],
  "specialties": ["Culture & History", "Local Food"],
  "service_areas": ["Bangkok", "Ayutthaya"],
  "location_label": "Bangkok, Thailand",

  "daily_fee": 2500.00,
  "overtime_rate_per_hour": 300.00,
  "status": "active",
  
  "rating_avg": 4.9,
  "total_reviews": 128,
  "years_experience": 5,
  "total_travelers": 500,

  "description": "Sawasdee krub! I specialize in showing you the authentic heart of Bangkok. From hidden street food stalls to serene lesser-known temples, let's explore my city beyond the guidebooks.",

  "specialized_services": [
    {
      "service_id": "srv-01",
      "title": "Bangkok City Tour",
      "description": "A comprehensive overview of the city's iconic landmarks and vibrant neighborhoods.",
      "image_url": "https://images.example.com/tours/bangkok-city.jpg"
    },
    {
      "service_id": "srv-02",
      "title": "Local Food Tour",
      "description": "Dive into the flavors of Chinatown and hidden alleys tasting authentic street cuisine.",
      "image_url": "https://images.example.com/tours/food-tour.jpg"
    }
  ],

  "pictures": [
    "https://images.example.com/guides/narin-1.jpg",
    "https://images.example.com/guides/narin-2.jpg"
  ],

  "reviews": [
    {
      "reviewer_name": "Sarah T.",
      "star": 5,
      "message": "Narin was fantastic! We saw so many hidden gems in Bangkok.",
      "created_at": "2026-08-10T14:20:00Z"
    }
  ],

  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2026-08-20T10:00:00Z"
}









 Transaction: BookingItems 

{
  "_id": 77778,
  "booking_id": 99999,
  "item_type": "guide",
  "guide_id": 501,

  "guide_snapshot": {
    "name": "Narin S.",
    "avatar_url": "https://images.example.com/guides/narin-avatar.jpg",
    "phone": "081-234-5678",
    "specialties": ["Culture & History", "Local Food"],
    "rating_avg": 4.9,
    "total_reviews": 128,
    "license_number": "11-99999",
    "license_category": "มัคคุเทศก์ทั่วไป (บรอนซ์เงิน)"
  },

  "tour_date": "2026-09-15",
  "duration_type": "full_day",
  "duration_hours": 8,
  "duration_label": "1 Day (8 Hours)",
  "party_size": 2,

  "meeting_point": {
    "location_name": "Hotel Lobby - Siam Kempinski",
    "meeting_time": "09:00 AM",
    "address": "991/9 Rama I Rd, Pathum Wan, Bangkok 10330",
    "contact_person": "Alex Smith",
    "contact_phone": "+1 234 567 8900"
  },

  "tour_details": {
    "special_requests": ""
  },

  "guide_fee": 2500.00,
  "service_fee": 0.00,
  "service_fee_original": 150.00,
  "item_total": 2500.00
}




3. Master Collection: Accommodation
 (ข้อมูลที่พักหลัก) 
{
  "_id": 1,
  "name": "The Siam Heritage Sanctuary",
  "category": "Luxury Resort",
  "categories": ["Private Villa", "Luxury Resort"],
  "description": "Experience unparalleled luxury in the heart of Bangkok. The Siam Heritage Sanctuary offers a profound sense of place, blending deep-rooted Thai architectural traditions with exquisite contemporary comfort. Set amidst lush, manicured gardens along the historic Chao Phraya River, this exclusive retreat promises serenity and absolute privacy.",
  
  "location": {
    "city": "Bangkok",
    "district": "Riverside",
    "address_label": "Riverside, Bangkok, Thailand",
    "map_coordinates": {
      "lat": 13.7234,
      "lng": 100.5147
    },
    "nearby_landmarks": [
      { "name": "The Grand Palace", "distance": "2.5 km" },
      { "name": "Wat Arun (Temple of Dawn)", "distance": "1.8 km" },
      { "name": "ICONSIAM Luxury Mall", "distance": "3.0 km" },
      { "name": "Suvarnabhumi Airport", "distance": "35 km" }
    ]
  },

  "rating_avg": 5.0,
  "total_reviews": 124,
  "is_featured": true,
  "status": "active",

  "facilities": [
    "Free High-Speed Wi-Fi",
    "Private Infinity Pool",
    "24/7 Butler Service",
    "Holistic Spa",
    "State-of-the-Art Gym",
    "Fine Dining"
  ],
  "special_options": ["Breakfast Included", "Free Cancellation", "Private Pool", "Beachfront"],

  "base_price_per_night": 12500.00,
  "currency": "THB",

  "pricing_rules": [
    {
      "id": 1,
      "name": "Weekend Surcharge",
      "effective_days": ["Friday", "Saturday"],
      "additional_charge": 500.00
    },
    {
      "id": 2,
      "name": "Thai New Year / Songkran",
      "effective_from": "2026-04-10T00:00:00Z",
      "effective_to": "2026-04-19T23:59:59Z",
      "additional_charge": 1500.00
    }
  ],

  "rooms": [
    {
      "room_type_id": "rm-villa-01",
      "name": "Royal Riverside Villa",
      "bed_type": "1 King Bed",
      "max_guests": {
        "adults": 2,
        "children": 1
      },
      "price_per_night": 12500.00,
      "available_quantity": 4
    }
  ],

  "pictures": [
    "https://images.example.com/hotels/siam-heritage-pool.jpg",
    "https://images.example.com/hotels/siam-heritage-bedroom.jpg",
    "https://images.example.com/hotels/siam-heritage-bath.jpg",
    "https://images.example.com/hotels/siam-heritage-dining.jpg"
  ],

  "policies": {
    "cancellation_policy": "Free cancellation up to 48 hours before check-in",
    "check_in_time": "15:00",
    "check_out_time": "12:00"
  },

  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2026-08-01T00:00:00Z"
}




Transaction: BookingItems (เมื่อเกิดการจองที่พัก) 
{
  "_id": 88801,
  "booking_id": 99998,
  "item_type": "accommodation",
  "accommodation_id": 1,

  "accommodation_snapshot": {
    "name": "The Siam Heritage Sanctuary",
    "category": "Luxury Resort",
    "room_name": "Royal Riverside Villa",
    "location_label": "Riverside, Bangkok, Thailand",
    "featured_image": "https://images.example.com/hotels/siam-heritage-pool.jpg",
    "rating_avg": 5.0
  },

  "check_in_date": "2026-08-10",
  "check_out_date": "2026-08-13",
  "total_nights": 3,
  
  "guest_details": {
    "rooms_count": 1,
    "adults": 2,
    "children": 0
  },

  "special_requests": "e.g., Early check-in, high floor, quiet room",

  "pricing_breakdown": {
    "price_per_night": 5000.00,
    "accommodation_subtotal": 15000.00,
    "service_fee": 500.00,
    "taxes_and_fees": 300.00,
    "item_total": 15800.00
  }
}
