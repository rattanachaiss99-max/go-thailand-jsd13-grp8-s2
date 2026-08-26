import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import { cars, getCarById, pickupLocations } from "../data/cars";

/** แปลง Date เป็นสตริง YYYY-MM-DD สำหรับ <input type="date"> (แพทเทิร์นเดียวกับไฟล์อื่น ๆ ในโปรเจกต์) */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
const TODAY = toISODate(new Date());
const DEFAULT_DROPOFF = addDays(TODAY, 3);

/**
 * CarDetail (หน้ารายละเอียดรถเช่า)
 * ------------------------------------------------------------
 * แสดงรายละเอียดรถ 1 คัน (อ่าน id จาก URL ผ่าน useParams เหมือน
 * AccommodationDetail) พร้อมแกลเลอรีรูป (คลิก thumbnail เพื่อเปลี่ยน
 * รูปหลักได้), รายละเอียด/สเปครถ และกล่องจองด้านขวาที่คำนวณราคารวม
 * ตามจำนวนวันที่เลือกจริง
 *
 * ตั้งใจ "ไม่" ผูกกับ BookingContext ของที่พัก และ "ไม่" สร้าง context
 * กลางใหม่สำหรับรถ เพราะยังไม่มีหน้าตะกร้า/checkout ของรถเช่าให้ส่ง
 * ข้อมูลต่อ (ดูสรุปเหตุผลในแชท) — ฟอร์มวันที่/เวลา/ทำเลรับรถทั้งหมดจึง
 * เป็น local state อยู่ในหน้านี้หน้าเดียว ปุ่ม "Book Now" ยังเป็นปุ่ม
 * โชว์ดีไซน์เฉย ๆ เหมือน "View Detail" ก่อนหน้านี้ รอวันที่ทีมออกแบบ
 * flow การจองรถจริงแล้วค่อยตัดสินใจว่าจะทำ context ร่วมกับที่พักหรือไม่
 * ------------------------------------------------------------
 */
export default function CarDetail() {
  const { id } = useParams();
  const car = getCarById(id) || cars[0];

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(pickupLocations[0]);
  const [pickupDate, setPickupDate] = useState(TODAY);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState(DEFAULT_DROPOFF);
  const [dropoffTime, setDropoffTime] = useState("10:00");

  // เปลี่ยนวันรับรถ: ถ้าวันคืนรถเดิมไม่เลยวันรับรถใหม่แล้ว ให้เลื่อนวันคืนรถ
  // ตามไปอัตโนมัติ (อย่างน้อย 1 วัน) กันกรอกวันคืนรถมาก่อนวันรับรถ
  const handlePickupDateChange = (value) => {
    setPickupDate(value);
    if (new Date(dropoffDate) <= new Date(value)) {
      setDropoffDate(addDays(value, 1));
    }
  };

  // จำนวนวันเช่า คำนวณจากวันรับ-คืนรถ ใช้คูณราคา/วันเป็นยอดรวม
  const days = useMemo(() => {
    const diff = Math.round(
      (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 1;
  }, [pickupDate, dropoffDate]);
  const total = car.pricePerDay * days;

  // คัดลอกลิงก์หน้านี้ไปยัง clipboard แทนปุ่ม share ของจริง (ยังไม่มีระบบ share)
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // เบราว์เซอร์บางตัว/บาง context (เช่นไม่ใช่ https) อาจ copy ไม่ได้ ปล่อยผ่านเงียบ ๆ
    }
  };

  return (
    <>
      <Header />

      <div className="wrap">
        {/* ---------- Breadcrumb: Home > Car Rental > ชื่อรถ ---------- */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/car-rental">Car Rental</Link>
          <span>›</span>
          <span className="current">{car.name}</span>
        </nav>

        {/* ---------- แกลเลอรี: รูปใหญ่ + แถบ thumbnail 4 รูป ---------- */}
        <div className="car-detail-gallery">
          <div className="car-detail-main">
            <PhotoPlaceholder src={car.images[activeImage]} alt={car.name} />
            <div className="img-actions">
              <button
                type="button"
                className={`img-action-btn ${saved ? "on" : ""}`}
                onClick={() => setSaved((v) => !v)}
                aria-label="Save car"
              >
                {saved ? "♥" : "♡"}
              </button>
              <button
                type="button"
                className="img-action-btn"
                onClick={handleShare}
                aria-label="Copy link to this car"
              >
                {copied ? "✓" : "⤴"}
              </button>
            </div>
          </div>

          <div className="car-detail-thumbs">
            {car.images.map((src, i) => (
              <button
                type="button"
                key={i}
                className={`car-detail-thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <PhotoPlaceholder
                  src={src}
                  alt={`${car.name} photo ${i + 1}`}
                />
                {i === car.images.length - 1 && (
                  <span className="car-detail-more">+12 Photos</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-layout">
          {/* ---------- คอลัมน์ซ้าย: รายละเอียด + สเปครถ ---------- */}
          <div>
            <div className="row" style={{ marginBottom: 14 }}>
              <span className="tag">{car.type.toUpperCase()}</span>
              <span className="rate-box">
                ★ {car.rating}{" "}
                <span className="muted" style={{ fontWeight: 400 }}>
                  ({car.reviews} Reviews)
                </span>
              </span>
            </div>

            <h1>{car.name}</h1>
            <p className="muted" style={{ marginTop: 16 }}>
              {car.description}
            </p>
            <p className="muted" style={{ marginTop: 14 }}>
              {car.descriptionExtra}
            </p>

            <div className="divider" />

            <section className="blk" style={{ marginTop: 0 }}>
              <h2>Key Specifications</h2>
              <div className="spec-grid">
                <div className="spec-box">
                  <div className="spec-icon">⚙️</div>
                  <div className="spec-label">Transmission</div>
                  <b>{car.transmission}</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">🧑</div>
                  <div className="spec-label">Seats</div>
                  <b>{car.seats} Seats</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">⛽</div>
                  <div className="spec-label">Fuel</div>
                  <b>{car.fuel}</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">🧳</div>
                  <div className="spec-label">Luggage</div>
                  <b>{car.luggage}</b>
                </div>
              </div>
            </section>
          </div>

          {/* ---------- คอลัมน์ขวา: กล่องจอง (ทำเลรับรถ + วันเวลา + ยอดรวม) ---------- */}
          <aside>
            <div className="card book-box sticky">
              <div className="between">
                <div>
                  <div className="price">
                    ฿{car.pricePerDay.toLocaleString()}
                  </div>
                  <div className="muted" style={{ fontSize: ".8rem" }}>
                    per day
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="muted" style={{ fontSize: ".8rem" }}>
                    Total ({days} day{days > 1 ? "s" : ""})
                  </div>
                  <div className="price">฿{total.toLocaleString()}</div>
                </div>
              </div>

              <div className="divider" />

              <div className="field">
                <label className="fl" htmlFor="pickupLoc">
                  Pick-up Location
                </label>
                <select
                  className="inp"
                  id="pickupLoc"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="fl" htmlFor="pickupDate">
                    Pick-up Date
                  </label>
                  <input
                    className="inp"
                    id="pickupDate"
                    type="date"
                    value={pickupDate}
                    min={TODAY}
                    onChange={(e) => handlePickupDateChange(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="pickupTime">
                    Time
                  </label>
                  <input
                    className="inp"
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="fl" htmlFor="dropoffDate">
                    Drop-off Date
                  </label>
                  <input
                    className="inp"
                    id="dropoffDate"
                    type="date"
                    value={dropoffDate}
                    min={addDays(pickupDate, 1)}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="dropoffTime">
                    Time
                  </label>
                  <input
                    className="inp"
                    id="dropoffTime"
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>
              </div>

              <Button variant="gold" full size="lg">
                Book Now →
              </Button>
              <p
                className="center muted"
                style={{ fontSize: ".8rem", marginTop: 10 }}
              >
                No credit card fees. Free cancellation up to 48 hours before
                pick-up.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
