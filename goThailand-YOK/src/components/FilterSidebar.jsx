import { facilityKeywords, bedroomOptions, renovationOptions } from "../data/properties";

/**
 * FilterSidebar
 * ------------------------------------------------------------
 * แถบตัวกรองด้านซ้ายของหน้ารายการค้นหา ประกอบด้วย:
 *  - ช่วงราคาสูงสุด (maxPrice) — กรองที่พักที่แพงกว่าราคาที่เลือกออก
 *  - Popular Filters (facilityKeywords) — checkbox เรียบ ๆ ดึงจาก
 *    ฟิลด์ `keywords` ของ properties จริงโดยตรง
 *  - คะแนนรีวิว — ตัวกรอง UI เสริม (ยังไม่ผูก logic)
 *  - Number of bedrooms (bedroomOptions) — radio เลือกได้ทีละ 1 ค่า
 *    เทียบกับฟิลด์ `bedrooms` ของที่พัก กดตัวเลือกที่เลือกอยู่ซ้ำเพื่อ
 *    ยกเลิกการเลือกได้ (ไม่บังคับต้องเลือกเสมอ)
 *  - Opening/renovation time (renovationOptions) — checkbox เลือกได้
 *    หลายค่า เทียบกับฟิลด์ `renovatedMonthsAgo` ของที่พัก
 * ค่าตัวกรองทั้งหมดถูกยกขึ้นไปเก็บที่หน้า AccommodationListing
 * (controlled component) เพื่อให้ผลการกรองสะท้อนไปยังรายการที่พักที่
 * แสดงจริงได้ทันที
 * ------------------------------------------------------------
 */
export default function FilterSidebar({
  maxPrice,
  onMaxPriceChange,
  selectedKeywords,
  onToggleKeyword,
  selectedBedroom,
  onSelectBedroom,
  selectedRenovations,
  onToggleRenovation,
}) {
  return (
    <div className="card sticky" style={{ padding: 24 }}>
      <div className="filter-title">Price Range (per night)</div>
      <input
        type="range"
        min="1500"
        max="20000"
        step="500"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--color-primary)" }}
      />
      <div className="between" style={{ fontSize: ".85rem", color: "var(--color-muted)", marginTop: 6 }}>
        <span>฿1,500</span>
        <span>up to ฿{maxPrice.toLocaleString()}</span>
      </div>
      <div className="divider" />

      <div className="filter-title">Popular Filters</div>
      {facilityKeywords.map((keyword) => (
        <label className="check" key={keyword}>
          <input
            type="checkbox"
            checked={selectedKeywords.includes(keyword)}
            onChange={() => onToggleKeyword(keyword)}
          />
          {keyword}
        </label>
      ))}
      <div className="divider" />

      <div className="filter-title">Rating</div>
      <label className="check">
        <input type="checkbox" defaultChecked /> <span className="stars">★★★★★</span>
      </label>
      <label className="check">
        <input type="checkbox" /> <span className="stars">★★★★</span>☆
      </label>
      <div className="divider" />

      <div className="filter-title">Number of bedrooms</div>
      {bedroomOptions.map((opt) => (
        <label className="check" key={opt.value}>
          <input
            type="radio"
            name="bedrooms"
            checked={selectedBedroom === opt.value}
            onClick={() => onSelectBedroom(opt.value)}
            onChange={() => {}}
          />
          {opt.label}
        </label>
      ))}
      <div className="divider" />

      <div className="filter-title">Opening/renovation time</div>
      {renovationOptions.map((opt) => (
        <label className="check" key={opt.value}>
          <input
            type="checkbox"
            checked={selectedRenovations.includes(opt.value)}
            onChange={() => onToggleRenovation(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
