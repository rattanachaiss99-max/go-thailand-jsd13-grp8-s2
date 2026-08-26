import { createContext, useContext, useMemo, useState } from "react";
import { properties } from "../data/properties";

/**
 * BookingContext
 * ------------------------------------------------------------
 * "คลังข้อมูลกลาง" ของขั้นตอนการจอง ใช้ React Context เพื่อแชร์สถานะ
 * การจอง (ที่พักที่เลือก, วันเข้าพัก/ออก, จำนวนผู้เข้าพัก, ข้อมูลลูกค้า)
 * ข้ามหน้า Detail -> Cart -> Checkout -> Success โดยไม่ต้องส่ง props
 * ทีละชั้น (prop drilling)
 *
 * ทำไมต้องมี: ผู้ใช้เลือกที่พักในหน้า Detail แล้วกด "Reserve" ไปหน้า Cart,
 * กด "Checkout" ไปหน้า Checkout, กรอกฟอร์มเสร็จไปหน้า Success — ทุกหน้า
 * ต้องอ่าน/แก้ข้อมูลการจองเดียวกัน จึงรวมไว้ที่เดียวแทนการส่งผ่าน props
 * ------------------------------------------------------------
 */
const BookingContext = createContext(null);

/** แปลง Date เป็นสตริง YYYY-MM-DD (รูปแบบที่ <input type="date"> ต้องการ) */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** ค่าเริ่มต้นของการจอง: เช็คอิน = วันนี้เสมอ, เช็คเอาท์ = วันนี้ + 3 คืน */
function buildDefaultBooking() {
  const today = new Date();
  const checkOutDate = new Date(today);
  checkOutDate.setDate(checkOutDate.getDate() + 3);
  return {
    propertyId: properties[0].id, // กันหน้าว่างเปล่าเวลาเข้าหน้า Cart/Checkout ตรง ๆ โดยยังไม่เคยเลือกที่พัก
    checkIn: toISODate(today),
    checkOut: toISODate(checkOutDate),
    guests: { adults: 2, children: 0 },
    rooms: 1,
  };
}

const GUEST_LIMITS = { adults: [1, 10], children: [0, 6], rooms: [1, 6] };

export function BookingProvider({ children }) {
  // lazy initializer เพื่อให้ "วันนี้" ถูกคำนวณครั้งเดียวตอนแอปเริ่มทำงานจริง
  const [booking, setBooking] = useState(buildDefaultBooking);
  const [customer, setCustomer] = useState(null); // ข้อมูลลูกค้าจากฟอร์ม Checkout
  const [bookingRef, setBookingRef] = useState(null); // เลขที่การจอง สร้างตอนยืนยันสำเร็จ

  /** เลือกที่พัก (เรียกตอนกดปุ่ม Reserve/Book Now ในหน้า Listing/Detail) */
  const selectProperty = (propertyId) => {
    setBooking((prev) => ({ ...prev, propertyId }));
  };

  /** แก้ไขวันที่เข้าพัก/ออก — ถ้าเลื่อนวันเข้าพักจนเลยวันออก จะเลื่อนวันออกตามไปอัตโนมัติ (อย่างน้อย 1 คืน) */
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

  /** เพิ่ม/ลดจำนวนผู้เข้าพัก (adults/children) ทีละ 1 หน่วย โดยไม่ให้เกินขอบเขตที่กำหนด */
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

  /** เพิ่ม/ลดจำนวนห้องพัก ทีละ 1 ห้อง โดยไม่ให้เกินขอบเขตที่กำหนด */
  const changeRoomCount = (delta) => {
    const [min, max] = GUEST_LIMITS.rooms;
    setBooking((prev) => ({
      ...prev,
      rooms: Math.min(max, Math.max(min, prev.rooms + delta)),
    }));
  };

  /** จำนวนคืนที่เข้าพัก คำนวณจากวันเข้า-ออก ใช้แสดงในหลายหน้า */
  const nights = useMemo(() => {
    const inDate = new Date(booking.checkIn);
    const outDate = new Date(booking.checkOut);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [booking.checkIn, booking.checkOut]);

  /** ที่พักที่กำลังถูกจองอยู่ตอนนี้ */
  const selectedProperty =
    properties.find((p) => p.id === booking.propertyId) || properties[0];

  /** สร้างเลขที่การจองแบบสุ่ม (จำลอง) แล้วบันทึกข้อมูลลูกค้า — เรียกตอนกด Confirm Booking */
  const confirmBooking = (customerInfo) => {
    setCustomer(customerInfo);
    const stamp = new Date();
    const y = stamp.getFullYear();
    const m = String(stamp.getMonth() + 1).padStart(2, "0");
    const d = String(stamp.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ref = `GT${y}${m}${d}${rand}`;
    setBookingRef(ref);
    return ref;
  };

  const value = {
    booking,
    selectedProperty,
    nights,
    customer,
    bookingRef,
    guestLimits: GUEST_LIMITS,
    todayISO: toISODate(new Date()),
    selectProperty,
    updateDates,
    changeGuestCount,
    changeRoomCount,
    confirmBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

/** Hook สำหรับดึงข้อมูล/ฟังก์ชันการจองไปใช้ในทุก component */
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
