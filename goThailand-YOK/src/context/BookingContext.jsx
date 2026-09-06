import { createContext, useContext, useMemo, useState } from "react";
import { properties, getPropertyById } from "../data/properties";
import { cars, getCarById, pickupLocations } from "../data/cars";

/**
 * BookingContext
 * ------------------------------------------------------------
 * ศูนย์กลางจัดการสถานะการจอง (ทั้ง Accommodation และ Car Rental)
 * เชื่อมโยงกับ Data Schema ของระบบ GoThailand:
 *  1. `bookings`       — ข้อมูลหัวออเดอร์ (Order Header)
 *  2. `booking_items`  — รายการย่อยและ Snapshot การจอง (Transaction Item)
 * ------------------------------------------------------------
 */
const BookingContext = createContext(null);

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return toISODate(d);
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

function buildDefaultBooking() {
  const today = new Date();
  const checkOutDate = new Date(today);
  checkOutDate.setDate(checkOutDate.getDate() + 3);
  const firstProp = properties[0];

  return {
    cartType: "accommodation", // "accommodation" | "car"
    // Accommodation fields
    propertyId: firstProp.id,
    roomTypeId: firstProp.rooms?.[0]?.room_type_id || "rm-default",
    checkIn: toISODate(today),
    checkOut: toISODate(checkOutDate),
    guests: { adults: 2, children: 0 },
    rooms: 1,

    // Car fields
    carId: cars[0].id,
    pickupLocation: pickupLocations[0],
    dropoffLocation: pickupLocations[0],
    pickupDate: toISODate(today),
    pickupTime: "10:00",
    dropoffDate: toISODate(checkOutDate),
    dropoffTime: "10:00",
  };
}

const GUEST_LIMITS = { adults: [1, 10], children: [0, 6], rooms: [1, 6] };

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(buildDefaultBooking);
  const [customer, setCustomer] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [confirmedItem, setConfirmedItem] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);

  // ดึงข้อมูล Property ปัจจุบัน
  const selectedProperty = useMemo(() => {
    return getPropertyById(booking.propertyId) || properties[0];
  }, [booking.propertyId]);

  // ดึงห้องพักที่เลือก
  const selectedRoom = useMemo(() => {
    if (!selectedProperty?.rooms?.length) return null;
    return (
      selectedProperty.rooms.find((r) => r.room_type_id === booking.roomTypeId) ||
      selectedProperty.rooms[0]
    );
  }, [selectedProperty, booking.roomTypeId]);

  // ดึงข้อมูล Car ปัจจุบัน
  const selectedCar = useMemo(() => {
    return getCarById(booking.carId) || cars[0];
  }, [booking.carId]);

  // คำนวณจำนวนคืน (Accommodation)
  const nights = useMemo(() => {
    const inDate = new Date(booking.checkIn);
    const outDate = new Date(booking.checkOut);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [booking.checkIn, booking.checkOut]);

  // คำนวณจำนวนวัน (Car Rental)
  const carDays = useMemo(() => {
    const pDate = new Date(booking.pickupDate);
    const dDate = new Date(booking.dropoffDate);
    const diff = Math.round((dDate - pDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [booking.pickupDate, booking.dropoffDate]);

  /** เลือกที่พัก */
  const selectProperty = (propertyId, roomTypeId = null) => {
    const prop = getPropertyById(propertyId) || properties[0];
    const targetRoomId = roomTypeId || prop.rooms?.[0]?.room_type_id || "rm-default";
    setBooking((prev) => ({
      ...prev,
      cartType: "accommodation",
      propertyId: prop.id,
      roomTypeId: targetRoomId,
    }));
    setConfirmedOrder(null);
    setConfirmedItem(null);
    setBookingRef(null);
  };

  /** เลือกประเภทห้องพัก */
  const selectRoomType = (roomTypeId) => {
    setBooking((prev) => ({
      ...prev,
      roomTypeId,
    }));
  };

  /** เลือกจองรถเช่า */
  const selectCar = (carConfig) => {
    setBooking((prev) => ({
      ...prev,
      cartType: "car",
      ...carConfig,
    }));
    setConfirmedOrder(null);
    setConfirmedItem(null);
    setBookingRef(null);
  };

  /** อัปเดตวันที่ของที่พัก */
  const updateDates = (patch) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch };
      if (new Date(next.checkOut) <= new Date(next.checkIn)) {
        const forcedCheckOut = new Date(next.checkIn);
        forcedCheckOut.setDate(forcedCheckOut.getDate() + 1);
        next.checkOut = toISODate(forcedCheckOut);
      }
      return next;
    });
  };

  /** อัปเดตวันเวลารถเช่า */
  const updateCarDates = (patch) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch };
      if (new Date(next.dropoffDate) <= new Date(next.pickupDate)) {
        next.dropoffDate = addDays(next.pickupDate, 1);
      }
      return next;
    });
  };

  /** ปรับจำนวนผู้เข้าพัก */
  const changeGuestCount = (field, delta) => {
    const [min, max] = GUEST_LIMITS[field];
    setBooking((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [field]: Math.min(max, Math.max(min, prev.guests[field] + delta)),
      },
    }));
  };

  /** ปรับจำนวนห้อง */
  const changeRoomCount = (delta) => {
    const [min, max] = GUEST_LIMITS.rooms;
    setBooking((prev) => ({
      ...prev,
      rooms: Math.min(max, Math.max(min, prev.rooms + delta)),
    }));
  };

  /**
   * confirmBooking
   * ------------------------------------------------------------
   * สร้าง Transaction Data ที่สอดคล้องกับ DATA.md:
   *  1. `bookings`       — Order Header Object
   *  2. `booking_items`  — Transaction Item Snapshot Object
   * ------------------------------------------------------------
   */
  const confirmBooking = (customerInfo) => {
    const nowISO = new Date().toISOString();
    const isCar = booking.cartType === "car";
    const ref = isCar
      ? `GT-CR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      : generateRandomRef("GT");

    const orderId = Math.floor(100 + Math.random() * 900);
    const itemId = Math.floor(70000 + Math.random() * 20000);

    let orderHeader = null;
    let transactionItem = null;

    const paymentMethodMap = {
      Card: "credit_card",
      Bank: "bank_transfer",
      QR: "promptpay_qr",
    };
    const paymentMethod =
      paymentMethodMap[customerInfo.payMethod] || customerInfo.payMethod || "credit_card";

    if (isCar) {
      const car = selectedCar;
      const days = carDays;
      const baseRate = car.daily_rate * days;
      const serviceFee = 0.0;
      const taxes = 0.0;
      const total = baseRate;

      // 1. bookings Header
      orderHeader = {
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
        subtotal: baseRate,
        discount: 0,
        tax: taxes,
        total_price: total,
        created_at: nowISO,
        updated_at: nowISO,
        cancelled_at: null,
      };

      // 2. booking_items Transaction
      transactionItem = {
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
          commercial_insurance_policy:
            car.registration_and_license?.commercial_insurance?.policy_number,
          commercial_insurance_expiry:
            car.registration_and_license?.commercial_insurance?.expiry_date,
          tax_expiry_date: car.registration_and_license?.tax_expiry_date,
          seats: car.specs?.seats,
        },
        rental_type: "SELF_DRIVE",
        start_date: `${booking.pickupDate}T${booking.pickupTime || "10:00"}:00Z`,
        end_date: `${booking.dropoffDate}T${booking.dropoffTime || "10:00"}:00Z`,
        pickup: {
          station_id: car.current_station?.station_id || "ST-01",
          station_name: booking.pickupLocation || car.current_station?.name,
          location_description: "Gate 3, Arrival Hall",
          contact_phone: "02-123-4567",
        },
        dropoff: {
          station_id: car.current_station?.station_id || "ST-01",
          station_name:
            booking.dropoffLocation || booking.pickupLocation || car.current_station?.name,
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
          taxes_and_fees: {
            amount: 0.0,
            is_included: true,
          },
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
    } else {
      // Accommodation Flow
      const prop = selectedProperty;
      const room = selectedRoom || {
        room_type_id: "rm-villa-01",
        name: "Standard Room",
        price_per_night: prop.base_price_per_night || prop.pricePerNight,
      };
      const roomPrice = room.price_per_night || prop.base_price_per_night;
      const roomCount = booking.rooms || 1;
      const subtotal = roomPrice * nights * roomCount;
      const serviceFee = 500;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + serviceFee + tax;

      // 1. bookings Header
      orderHeader = {
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

      // 2. booking_items Transaction
      transactionItem = {
        _id: itemId,
        id: itemId,
        booking_id: orderId,
        booking_reference: ref,
        item_type: "accommodation",
        status: "confirmed",

        accommodation_id: prop._id,
        hotel_id: prop._id,
        room_type_id: room.room_type_id,

        accommodation_snapshot: {
          name: prop.name,
          category: prop.category,
          room_name: room.name,
          location_label: prop.location?.address_label || String(prop.location),
          featured_image: prop.pictures?.[0] || prop.images?.[0],
          rating_avg: prop.rating_avg || prop.rating,
        },

        hotel_name: prop.name,
        room_type_name: room.name,
        address_snapshot: prop.location?.address_label || String(prop.location),

        check_in_date: booking.checkIn,
        check_out_date: booking.checkOut,
        nights,
        total_nights: nights,

        guest_details: {
          rooms_count: roomCount,
          adults: booking.guests.adults,
          children: booking.guests.children,
        },
        room_count: roomCount,
        adults: booking.guests.adults,
        children: booking.guests.children,
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
          prop.policies?.cancellation_policy || "Free cancellation up to 48 hours before check-in",
        created_at: nowISO,
      };
    }

    setCustomer(customerInfo);
    setBookingRef(ref);
    setConfirmedOrder(orderHeader);
    setConfirmedItem(transactionItem);

    return { order: orderHeader, item: transactionItem, ref };
  };

  const resetBooking = () => {
    setBooking(buildDefaultBooking());
    setCustomer(null);
    setConfirmedOrder(null);
    setConfirmedItem(null);
    setBookingRef(null);
  };

  const value = {
    booking,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    customer,
    bookingRef,
    confirmedOrder,
    confirmedItem,
    guestLimits: GUEST_LIMITS,
    todayISO: toISODate(new Date()),
    selectProperty,
    selectRoomType,
    selectCar,
    updateDates,
    updateCarDates,
    changeGuestCount,
    changeRoomCount,
    confirmBooking,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
