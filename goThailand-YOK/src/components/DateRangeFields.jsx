import { useBooking } from "../context/BookingContext";

/**
 * DateRangeFields
 * ------------------------------------------------------------
 * ช่องเลือกวันที่ "เข้าพัก" และ "ออก" แบบคู่ อ่าน/แก้ไขค่าตรงกับ
 * BookingContext เอง จึงเรียกใช้ได้ทันทีโดยไม่ต้องส่ง props ใช้ซ้ำได้
 * ทุกจุดที่ต้องเลือกช่วงวันของการจอง (กล่องจองในหน้า Detail และตอน
 * แก้ไขการจองในหน้า Cart) จำกัดไม่ให้เลือกวันเข้าพักย้อนหลังกว่าวันนี้
 * และวันออกต้องอยู่หลังวันเข้าพักอย่างน้อย 1 วันเสมอ
 * ------------------------------------------------------------
 */
export default function DateRangeFields() {
  const { booking, todayISO, updateDates } = useBooking();
  const minCheckOut = addDays(booking.checkIn, 1);

  return (
    <div className="date-grid">
      <div>
        <label className="fl" htmlFor="checkInInput">Check-in</label>
        <input
          id="checkInInput"
          type="date"
          className="date-input"
          value={booking.checkIn}
          min={todayISO}
          onChange={(e) => updateDates({ checkIn: e.target.value })}
        />
      </div>
      <div>
        <label className="fl" htmlFor="checkOutInput">Check-out</label>
        <input
          id="checkOutInput"
          type="date"
          className="date-input"
          value={booking.checkOut}
          min={minCheckOut}
          onChange={(e) => updateDates({ checkOut: e.target.value })}
        />
      </div>
    </div>
  );
}

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
