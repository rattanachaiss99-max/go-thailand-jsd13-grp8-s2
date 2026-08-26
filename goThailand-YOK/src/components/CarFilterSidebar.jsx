import { carTypes, cars } from "../data/cars";

/**
 * CarFilterSidebar
 * ------------------------------------------------------------
 * แถบตัวกรองด้านซ้ายของหน้า CarRental ใช้คลาส CSS ชุดเดียวกับ
 * FilterSidebar (`.card.sticky`, `.filter-title`, `.check`, `.divider`)
 * เพื่อให้หน้าตาเข้าชุดกับตัวกรองหน้าที่พัก แต่แยก component เพราะ
 * ตัวเลือก (Car Type, ราคา/วัน) เป็นข้อมูลคนละชุดกับที่พักโดยสิ้นเชิง
 *  - Car Type (carTypes) — checkbox เลือกได้หลายค่า พร้อมจำนวนรถ
 *    ในแต่ละประเภท (นับจาก cars จริง ไม่ hardcode)
 *  - Price per day — slider ราคาสูงสุดต่อวัน
 * ค่าตัวกรองถูกยกขึ้นไปเก็บที่หน้า CarRental (controlled component)
 * ------------------------------------------------------------
 */
export default function CarFilterSidebar({
  selectedTypes,
  onToggleType,
  maxPrice,
  onMaxPriceChange,
}) {
  return (
    <div className="card sticky" style={{ padding: 24 }}>
      <div className="filter-title">Car Type</div>
      {carTypes.map((type) => {
        const count = cars.filter((c) => c.type === type).length;
        return (
          <label className="check" key={type}>
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => onToggleType(type)}
            />
            {type} ({count})
          </label>
        );
      })}
      <div className="divider" />

      <div className="filter-title">Price per day</div>
      <input
        type="range"
        min="1000"
        max="5000"
        step="100"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--color-primary)" }}
      />
      <div className="between" style={{ fontSize: ".85rem", color: "var(--color-muted)", marginTop: 6 }}>
        <span>฿1,000</span>
        <span>{maxPrice >= 5000 ? "฿5,000+" : `up to ฿${maxPrice.toLocaleString()}`}</span>
      </div>
    </div>
  );
}
