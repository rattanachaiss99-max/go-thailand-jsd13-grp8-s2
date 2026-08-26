import { useState } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Button from "./Button";

/**
 * CarCard
 * ------------------------------------------------------------
 * การ์ดแสดงรถให้เช่า 1 คัน ใช้ในหน้า CarRental (Available Cars grid)
 * โครงหน้าตาเลียนแบบ PropertyCard โหมด "mini" (รูปด้านบน + เนื้อหา
 * ด้านล่าง) แต่เปลี่ยนรายละเอียดให้ตรงกับข้อมูลรถ (ที่นั่ง/เกียร์/
 * เชื้อเพลิง แทนที่จะเป็นทำเล) และมีปุ่มหัวใจ (บันทึกรถที่ถูกใจ) ที่
 * เก็บสถานะ on/off ไว้ในตัวเอง เพราะเป็น UI-only เหมือน Chip
 * ------------------------------------------------------------
 */
export default function CarCard({ car }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="card car-card">
      <PhotoPlaceholder src={car.image} alt={car.name} className="car-photo">
        <span className="pill-img">{car.type.toUpperCase()}</span>
        <button
          type="button"
          className={`car-fav ${saved ? "on" : ""}`}
          onClick={() => setSaved((v) => !v)}
          aria-label="Save car"
        >
          {saved ? "♥" : "♡"}
        </button>
      </PhotoPlaceholder>

      <div className="car-card-body">
        <div className="between">
          <h3 style={{ fontSize: "1.05rem" }}>{car.name}</h3>
          <span className="badge-rate">
            {car.rating} <i>★</i>
          </span>
        </div>
        <div className="muted" style={{ fontSize: ".85rem", marginBottom: 4 }}>
          ({car.reviews} Reviews)
        </div>

        <div className="car-specs">
          <span>🧑 {car.seats}</span>
          <span>⚙️ {car.transmission}</span>
          <span>⛽ {car.fuel}</span>
        </div>

        <div style={{ margin: "12px 0" }}>
          <div className="price" style={{ fontSize: "1.15rem" }}>
            ฿{car.pricePerDay.toLocaleString()} <small>/ day</small>
          </div>
          <div className="muted" style={{ fontSize: ".8rem" }}>All taxes included</div>
        </div>

        <Button to={`/car-rental/${car.id}`} variant="ghost" full>
          View Detail
        </Button>
      </div>
    </article>
  );
}
