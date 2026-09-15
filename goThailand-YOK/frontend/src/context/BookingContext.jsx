import { createContext, useContext, useMemo, useState } from "react";
import { useCatalog } from "./CatalogContext";
import { createBooking } from "../api/client";

/**
 * BookingContext
 * ------------------------------------------------------------
 * ศูนย์กลางจัดการ "ตะกร้า" การจอง รองรับจองที่พัก + จองรถเช่า
 * พร้อมกันในตะกร้าเดียว (อย่างละ 1 รายการต่อครั้ง) — `cart.accommodation`
 * และ `cart.car` เป็นอิสระต่อกันโดยสิ้นเชิง การจองรถใหม่ไม่ล้างที่พัก
 * ที่เลือกไว้ และในทางกลับกัน
 *
 * แต่ละ slot มี field `inCart` บอกว่า "ผู้ใช้ตั้งใจจะจองจริง" (กด Book
 * Now/Reserve) หรือแค่ "ค่าฟอร์มที่เตรียมไว้" (ยังไม่กดยืนยัน) — หน้า
 * Cart/Checkout จะแสดง/ส่งเฉพาะ slot ที่ inCart: true เท่านั้น
 *
 * เชื่อมโยงกับ Data Schema ของระบบ GoThailand:
 *  1. `bookings`       — ข้อมูลหัวออเดอร์ (Order Header) 1 รายการต่อการ checkout
 *  2. `booking_items`  — รายการย่อยและ Snapshot การจอง (อาจมีมากกว่า 1
 *     ชิ้นต่อออเดอร์ ถ้าจองทั้งรถและที่พักพร้อมกัน)
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

function diffDays(fromISO, toISO) {
  const diff = Math.round((new Date(toISO) - new Date(fromISO)) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function buildDefaultCart(properties, cars, pickupLocations) {
  const today = new Date();
  const checkOutDate = new Date(today);
  checkOutDate.setDate(checkOutDate.getDate() + 3);
  const firstProp = properties[0];

  return {
    accommodation: {
      inCart: false,
      propertyId: firstProp.id,
      roomTypeId: firstProp.rooms?.[0]?.room_type_id || "rm-default",
      checkIn: toISODate(today),
      checkOut: toISODate(checkOutDate),
      guests: { adults: 2, children: 0 },
      rooms: 1,
    },
    car: {
      inCart: false,
      carId: cars[0].id,
      pickupLocation: pickupLocations[0],
      dropoffLocation: pickupLocations[0],
      pickupDate: toISODate(today),
      pickupTime: "10:00",
      dropoffDate: toISODate(checkOutDate),
      dropoffTime: "10:00",
    },
  };
}

const GUEST_LIMITS = { adults: [1, 10], children: [0, 6], rooms: [1, 6] };

export function BookingProvider({ children }) {
  const { properties, cars, getPropertyById, getCarById, pickupLocations } = useCatalog();
  const [cart, setCart] = useState(() => buildDefaultCart(properties, cars, pickupLocations));
  const [customer, setCustomer] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [bookingRef, setBookingRef] = useState(null);

  // ดึงข้อมูล Property ปัจจุบัน (จาก cart.accommodation.propertyId)
  const selectedProperty = useMemo(() => {
    return getPropertyById(cart.accommodation.propertyId) || properties[0];
  }, [cart.accommodation.propertyId]);

  // ดึงห้องพักที่เลือก
  const selectedRoom = useMemo(() => {
    if (!selectedProperty?.rooms?.length) return null;
    return (
      selectedProperty.rooms.find((r) => r.room_type_id === cart.accommodation.roomTypeId) ||
      selectedProperty.rooms[0]
    );
  }, [selectedProperty, cart.accommodation.roomTypeId]);

  // ดึงข้อมูล Car ปัจจุบัน (จาก cart.car.carId)
  const selectedCar = useMemo(() => {
    return getCarById(cart.car.carId) || cars[0];
  }, [cart.car.carId]);

  // คำนวณจำนวนคืน (Accommodation)
  const nights = useMemo(
    () => diffDays(cart.accommodation.checkIn, cart.accommodation.checkOut),
    [cart.accommodation.checkIn, cart.accommodation.checkOut]
  );

  // คำนวณจำนวนวัน (Car Rental)
  const carDays = useMemo(
    () => diffDays(cart.car.pickupDate, cart.car.dropoffDate),
    [cart.car.pickupDate, cart.car.dropoffDate]
  );

  const clearConfirmedState = () => {
    setConfirmedOrder(null);
    setConfirmedItems([]);
    setBookingRef(null);
  };

  /**
   * previewProperty — อัปเดตที่พัก/ห้องที่ "กำลังดูอยู่" สำหรับหน้า Detail
   * (แก้วันที่/จำนวนคนได้ตามปกติ) แต่ยังไม่ถือว่า "อยู่ในตะกร้า" จนกว่า
   * จะกด Book Now/Reserve (ดู selectProperty ด้านล่าง)
   */
  const previewProperty = (propertyId, roomTypeId = null) => {
    const prop = getPropertyById(propertyId) || properties[0];
    const targetRoomId = roomTypeId || prop.rooms?.[0]?.room_type_id || "rm-default";
    setCart((prev) => ({
      ...prev,
      accommodation: { ...prev.accommodation, propertyId: prop.id, roomTypeId: targetRoomId },
    }));
  };

  /** เลือกที่พัก + ใส่เข้าตะกร้าจริง (กด Book Now/Reserve) — ไม่กระทบรถที่อยู่ในตะกร้าอยู่แล้ว */
  const selectProperty = (propertyId, roomTypeId = null) => {
    previewProperty(propertyId, roomTypeId);
    setCart((prev) => ({
      ...prev,
      accommodation: { ...prev.accommodation, inCart: true },
    }));
    clearConfirmedState();
  };

  /** เลือกประเภทห้องพัก */
  const selectRoomType = (roomTypeId) => {
    setCart((prev) => ({
      ...prev,
      accommodation: { ...prev.accommodation, roomTypeId },
    }));
  };

  /** เลือกจองรถเช่า + ใส่เข้าตะกร้าจริง (กด Book Now) — ไม่กระทบที่พักที่อยู่ในตะกร้าอยู่แล้ว */
  const selectCar = (carConfig) => {
    setCart((prev) => ({
      ...prev,
      car: { ...prev.car, ...carConfig, inCart: true },
    }));
    clearConfirmedState();
  };

  /** เอารายการประเภทที่ระบุออกจากตะกร้า (type: "accommodation" | "car") */
  const removeFromCart = (type) => {
    setCart((prev) => ({
      ...prev,
      [type]: { ...prev[type], inCart: false },
    }));
  };

  /** อัปเดตวันที่ของที่พัก */
  const updateDates = (patch) => {
    setCart((prev) => {
      const next = { ...prev.accommodation, ...patch };
      if (new Date(next.checkOut) <= new Date(next.checkIn)) {
        const forcedCheckOut = new Date(next.checkIn);
        forcedCheckOut.setDate(forcedCheckOut.getDate() + 1);
        next.checkOut = toISODate(forcedCheckOut);
      }
      return { ...prev, accommodation: next };
    });
  };

  /** อัปเดตวันเวลารถเช่า */
  const updateCarDates = (patch) => {
    setCart((prev) => {
      const next = { ...prev.car, ...patch };
      if (new Date(next.dropoffDate) <= new Date(next.pickupDate)) {
        next.dropoffDate = addDays(next.pickupDate, 1);
      }
      return { ...prev, car: next };
    });
  };

  /** ปรับจำนวนผู้เข้าพัก */
  const changeGuestCount = (field, delta) => {
    const [min, max] = GUEST_LIMITS[field];
    setCart((prev) => ({
      ...prev,
      accommodation: {
        ...prev.accommodation,
        guests: {
          ...prev.accommodation.guests,
          [field]: Math.min(max, Math.max(min, prev.accommodation.guests[field] + delta)),
        },
      },
    }));
  };

  /** ปรับจำนวนห้อง */
  const changeRoomCount = (delta) => {
    const [min, max] = GUEST_LIMITS.rooms;
    setCart((prev) => ({
      ...prev,
      accommodation: {
        ...prev.accommodation,
        rooms: Math.min(max, Math.max(min, prev.accommodation.rooms + delta)),
      },
    }));
  };

  /**
   * confirmBooking
   * ------------------------------------------------------------
   * ส่งเฉพาะ slot ที่ `inCart: true` ไปที่ POST /api/bookings ในคำขอ
   * เดียว — backend เป็นคนหารถ/ที่พักจาก MongoDB สดๆ คำนวณราคา และ
   * ประกอบ document ตาม schema `bookings`/`booking_items` เอง (รองรับ
   * ได้มากกว่า 1 item ต่อ order ถ้าจองทั้งคู่พร้อมกัน) แล้วบันทึกลง
   * MongoDB จริง เราแค่เก็บผลลัพธ์ที่ backend ส่งกลับมาไว้ใน state
   * ------------------------------------------------------------
   */
  const confirmBooking = async (customerInfo) => {
    const cartPayload = {};
    if (cart.accommodation.inCart) cartPayload.accommodation = cart.accommodation;
    if (cart.car.inCart) cartPayload.car = cart.car;

    const { order, items, ref } = await createBooking({ cart: cartPayload, customerInfo });

    setCustomer(customerInfo);
    setBookingRef(ref);
    setConfirmedOrder(order);
    setConfirmedItems(items);

    // เคลียร์ตะกร้าหลังจองสำเร็จ (เหมือน checkout เสร็จแล้วตะกร้าว่าง)
    setCart((prev) => ({
      accommodation: { ...prev.accommodation, inCart: false },
      car: { ...prev.car, inCart: false },
    }));

    return { order, items, ref };
  };

  const resetBooking = () => {
    setCart(buildDefaultCart(properties, cars, pickupLocations));
    setCustomer(null);
    clearConfirmedState();
  };

  const value = {
    cart,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    hasAccommodationInCart: cart.accommodation.inCart,
    hasCarInCart: cart.car.inCart,
    customer,
    bookingRef,
    confirmedOrder,
    confirmedItems,
    guestLimits: GUEST_LIMITS,
    todayISO: toISODate(new Date()),
    previewProperty,
    selectProperty,
    selectRoomType,
    selectCar,
    removeFromCart,
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
