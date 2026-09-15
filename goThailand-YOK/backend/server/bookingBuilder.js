/**
 * bookingBuilder.js
 * ------------------------------------------------------------
 * Builds the `bookings` (order header) and `booking_items`
 * (transaction item) documents per DATA.md, using data fetched
 * fresh from MongoDB (car/property) rather than trusting price
 * figures sent by the client.
 *
 * One order can contain MULTIPLE items (e.g. a car AND an
 * accommodation booked together in one checkout) — the route
 * handler in index.js builds one item per cart slot present,
 * sums their totals into a single order header, and inserts
 * everything under one shared `booking_ref`.
 * ------------------------------------------------------------
 */

function diffDays(fromISO, toISO) {
  const diff = Math.round((new Date(toISO) - new Date(fromISO)) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function generateRandomRef(prefix = "GT") {
  const stamp = new Date();
  const yy = String(stamp.getFullYear()).slice(-2);
  const mm = String(stamp.getMonth() + 1).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${yy}${mm}-${rand}`;
}

const PAYMENT_METHOD_MAP = { Card: "credit_card", Bank: "bank_transfer", QR: "promptpay_qr" };

function resolvePaymentMethod(customerInfo) {
  return PAYMENT_METHOD_MAP[customerInfo.payMethod] || customerInfo.payMethod || "credit_card";
}

/** เลขที่ order เดียวสำหรับทั้งตะกร้า (ไม่ว่าจะมีกี่ item ข้างใน) */
export function generateOrderRef() {
  return generateRandomRef("GT");
}

/**
 * buildCarItem — ประกอบ 1 รายการ (booking_items) สำหรับรถเช่า
 * คืน { item, subtotal, tax, total } — subtotal/tax/total ใช้รวมเข้า order header
 * ไม่ได้เก็บเป็น field ในตัว item เอง (item เก็บราคาไว้ใน item.pricing อยู่แล้ว)
 */
export function buildCarItem({ cartCar, customerInfo, car, orderId, ref, itemId }) {
  const nowISO = new Date().toISOString();
  const paymentMethod = resolvePaymentMethod(customerInfo);
  const days = diffDays(cartCar.pickupDate, cartCar.dropoffDate);
  const baseRate = car.daily_rate * days;
  const serviceFee = 0.0;
  const taxes = 0.0;
  const total = baseRate;

  const item = {
    _id: itemId,
    id: itemId,
    booking_id: orderId,
    booking_reference: ref,
    item_type: "car",
    car_id: car._id,
    car_snapshot: {
      brand: car.brand,
      model: car.model,
      license_plate: car.license_plate,
      category: car.category,
      license_category: car.registration_and_license?.license_category,
      plate_type: car.registration_and_license?.plate_type,
      commercial_insurance_policy: car.registration_and_license?.commercial_insurance?.policy_number,
      commercial_insurance_expiry: car.registration_and_license?.commercial_insurance?.expiry_date,
      tax_expiry_date: car.registration_and_license?.tax_expiry_date,
      seats: car.specs?.seats,
    },
    rental_type: "SELF_DRIVE",
    start_date: `${cartCar.pickupDate}T${cartCar.pickupTime || "10:00"}:00Z`,
    end_date: `${cartCar.dropoffDate}T${cartCar.dropoffTime || "10:00"}:00Z`,
    pickup: {
      station_id: car.current_station?.station_id || "ST-01",
      station_name: cartCar.pickupLocation || car.current_station?.name,
      location_description: "Gate 3, Arrival Hall",
      contact_phone: "02-123-4567",
    },
    dropoff: {
      station_id: car.current_station?.station_id || "ST-01",
      station_name: cartCar.dropoffLocation || cartCar.pickupLocation || car.current_station?.name,
      location_description: "Gate 3, Arrival Hall",
      contact_phone: "02-123-4567",
    },
    traveler_info: {
      full_name: customerInfo.fullName || "Siwat J.",
      email: customerInfo.email || "sj.siwat@gmail.com",
      phone: customerInfo.phone || "0812345678",
      country: customerInfo.country || "Thailand",
    },
    driver_info: {
      driver_name: customerInfo.driverName || customerInfo.fullName || "Siwat J.",
      driver_license_no: customerInfo.driverLicenseNo || "DL-12345678",
      license_country: customerInfo.country || "Thailand",
      driver_age: Number(customerInfo.driverAge) || 35,
    },
    pricing: {
      daily_rate: car.daily_rate,
      rental_days: days,
      base_rate: baseRate,
      service_fee: serviceFee,
      taxes_and_fees: { amount: 0.0, is_included: true },
      total_price: total,
    },
    payment_info: {
      payment_method: paymentMethod.toUpperCase(),
      card_info: {
        name_on_card: customerInfo.cardName || customerInfo.fullName || "Siwat J.",
        card_number_masked: "**** **** **** 0000",
        expiry_date: customerInfo.cardExpiry || "MM/YY",
      },
    },
    billing_address: {
      is_same_as_traveler: true,
      full_name: customerInfo.fullName || "Siwat J.",
      email: customerInfo.email || "sj.siwat@gmail.com",
      phone: customerInfo.phone || "0812345678",
      country: customerInfo.country || "Thailand",
    },
    special_requests: customerInfo.requests || "",
    terms_accepted: true,
    created_at: nowISO,
  };

  return { item, subtotal: baseRate, tax: taxes, total };
}

/**
 * buildAccommodationItem — ประกอบ 1 รายการ (booking_items) สำหรับที่พัก
 * คืน { item, subtotal, tax, total } เหมือน buildCarItem
 */
export function buildAccommodationItem({ cartAccommodation, customerInfo, property, room, orderId, ref, itemId }) {
  const nowISO = new Date().toISOString();
  const nights = diffDays(cartAccommodation.checkIn, cartAccommodation.checkOut);
  const roomPrice = room.price_per_night || property.base_price_per_night;
  const roomCount = cartAccommodation.rooms || 1;
  const subtotal = roomPrice * nights * roomCount;
  const serviceFee = 500;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + tax;

  const item = {
    _id: itemId,
    id: itemId,
    booking_id: orderId,
    booking_reference: ref,
    item_type: "accommodation",
    status: "confirmed",

    accommodation_id: property._id,
    hotel_id: property._id,
    room_type_id: room.room_type_id,

    accommodation_snapshot: {
      name: property.name,
      category: property.category,
      room_name: room.name,
      location_label: property.location?.address_label || String(property.location),
      featured_image: property.pictures?.[0] || property.images?.[0],
      rating_avg: property.rating_avg || property.rating,
    },

    hotel_name: property.name,
    room_type_name: room.name,
    address_snapshot: property.location?.address_label || String(property.location),

    check_in_date: cartAccommodation.checkIn,
    check_out_date: cartAccommodation.checkOut,
    nights,
    total_nights: nights,

    guest_details: {
      rooms_count: roomCount,
      adults: cartAccommodation.guests?.adults,
      children: cartAccommodation.guests?.children,
    },
    room_count: roomCount,
    adults: cartAccommodation.guests?.adults,
    children: cartAccommodation.guests?.children,
    guest_names: [customerInfo.fullName || "Siwat J."],

    price_per_night: roomPrice,
    subtotal,
    taxes_fees: tax,
    total_price: total,
    currency: "THB",

    pricing_breakdown: {
      price_per_night: roomPrice,
      accommodation_subtotal: subtotal,
      service_fee: serviceFee,
      taxes_and_fees: tax,
      item_total: total,
    },

    special_requests: customerInfo.requests || "ขอห้องชั้นสูง ไม่สูบบุหรี่",
    cancellation_policy:
      property.policies?.cancellation_policy || "Free cancellation up to 48 hours before check-in",
    created_at: nowISO,
  };

  return { item, subtotal, tax, total };
}

/** buildOrderHeader — ประกอบ document เดียวของ `bookings` จากยอดรวมทุก item ในตะกร้า */
export function buildOrderHeader({ orderId, ref, customerInfo, subtotal, tax, total }) {
  const nowISO = new Date().toISOString();
  const paymentMethod = resolvePaymentMethod(customerInfo);

  return {
    id: orderId,
    booking_ref: ref,
    user_id: 42,
    status: "confirmed",
    payment_status: "paid",
    payment_method: paymentMethod,
    contact_name: customerInfo.fullName || "Siwat J.",
    contact_email: customerInfo.email || "sj.siwat@gmail.com",
    contact_phone: customerInfo.phone || "0812345678",
    currency: "THB",
    subtotal,
    discount: 0,
    tax,
    total_price: total,
    created_at: nowISO,
    updated_at: nowISO,
    cancelled_at: null,
  };
}
