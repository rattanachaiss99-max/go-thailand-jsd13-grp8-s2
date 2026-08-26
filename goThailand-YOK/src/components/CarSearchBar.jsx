import { useState } from "react";
import { carTypes } from "../data/cars";

/** แปลง Date เป็นสตริง YYYY-MM-DD สำหรับ <input type="date"> (เหมือนกับ SearchBar) */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
const TODAY = toISODate(new Date());

/**
 * CarSearchBar
 * ------------------------------------------------------------
 * แถบค้นหารถเช่า (ทำเลรับ-คืนรถ / วันที่ / ประเภทรถ) ลอยทับขอบล่าง
 * ของ hero banner หน้า CarRental ใช้โครง/คลาส CSS เดียวกับ SearchBar
 * (`.search-bar`, `.inp`, `.fl`) เพื่อให้หน้าตาสอดคล้องกับหน้าจองที่พัก
 * แต่แยก component เพราะฟิลด์ต่างกันจริง (ทำเลรับ-คืนรถ, ประเภทรถ
 * แทนที่จะเป็นผู้เข้าพัก) เป็น demo form ยังไม่ต่อกับการค้นหาจริง
 * ------------------------------------------------------------
 */
export default function CarSearchBar() {
  const [location, setLocation] = useState("Bangkok, Thailand");
  const [date, setDate] = useState(TODAY);
  const [vehicleType, setVehicleType] = useState("All Types");

  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="fl" htmlFor="pickup">Pick-up &amp; Return Location</label>
        <input
          className="inp"
          id="pickup"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where to pick up?"
        />
      </div>
      <div>
        <label className="fl" htmlFor="cdate">Dates</label>
        <input
          className="inp"
          id="cdate"
          type="date"
          value={date}
          min={TODAY}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="fl" htmlFor="vtype">Vehicle Type</label>
        <select
          className="inp"
          id="vtype"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option>All Types</option>
          {carTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-gold btn-lg" type="submit">
        Search Cars
      </button>
    </form>
  );
}
