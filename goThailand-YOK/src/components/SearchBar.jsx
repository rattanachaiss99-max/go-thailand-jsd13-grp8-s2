import { useState } from "react";

/** แปลง Date เป็นสตริง YYYY-MM-DD สำหรับ <input type="date"> */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const TODAY = toISODate(new Date());
const IN_THREE_DAYS = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return toISODate(d);
})();

/**
 * SearchBar
 * ------------------------------------------------------------
 * แถบค้นหาที่พัก (ปลายทาง / วันเข้าพัก-ออก / จำนวนผู้เข้าพัก)
 * แสดงอยู่บนสุดของหน้ารายการค้นหา (AccommodationListing) ลอยทับ
 * ขอบล่างของ hero banner เก็บ state ในตัวเองเพราะเป็นฟอร์มค้นหา
 * แบบ demo ยังไม่ได้ต่อกับการ fetch ข้อมูลจริง — ค่าเริ่มต้นของวันที่
 * ใช้ "วันนี้" เสมอ (เช่นเดียวกับกล่องจองในหน้า Detail)
 * ------------------------------------------------------------
 */
export default function SearchBar() {
  const [destination, setDestination] = useState("Bangkok, Thailand");
  const [checkIn, setCheckIn] = useState(TODAY);
  const [checkOut, setCheckOut] = useState(IN_THREE_DAYS);
  const [guests, setGuests] = useState("2 Adults, 1 Room");

  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="fl" htmlFor="dest">Destination</label>
        <input
          className="inp"
          id="dest"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to?"
        />
      </div>
      <div>
        <label className="fl" htmlFor="ci">Check-in</label>
        <input
          className="inp"
          id="ci"
          type="date"
          value={checkIn}
          min={TODAY}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      <div>
        <label className="fl" htmlFor="co">Check-out</label>
        <input
          className="inp"
          id="co"
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div>
        <label className="fl" htmlFor="gu">Guests</label>
        <select
          className="inp"
          id="gu"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          <option>2 Adults, 1 Room</option>
          <option>2 Adults, 2 Rooms</option>
          <option>4 Adults, 2 Rooms</option>
        </select>
      </div>
      <button className="btn btn-primary btn-lg" type="submit">
        Search
      </button>
    </form>
  );
}
