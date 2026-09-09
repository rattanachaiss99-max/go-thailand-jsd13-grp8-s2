import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import { cars, getCarById, pickupLocations } from "../data/cars";
import { useBooking } from "../context/BookingContext";

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
 * แสดงรายละเอียดรถ 1 คัน พร้อมแกลเลอรีรูป, สเปค, ใบอนุญาต, ประกันภัย
 * และเชื่อมต่อกับ BookingContext ให้กด "Book Now" แล้วส่งข้อมูลไปยัง
 * ตะกร้าสินค้า (/cart) ได้จริงตาม Data Schema
 * ------------------------------------------------------------
 */
export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectCar } = useBooking();
  const car = getCarById(id) || cars[0];

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(pickupLocations[0]);
  const [pickupDate, setPickupDate] = useState(TODAY);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState(DEFAULT_DROPOFF);
  const [dropoffTime, setDropoffTime] = useState("10:00");

  const handlePickupDateChange = (value) => {
    setPickupDate(value);
    if (new Date(dropoffDate) <= new Date(value)) {
      setDropoffDate(addDays(value, 1));
    }
  };

  const days = useMemo(() => {
    const diff = Math.round(
      (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 1;
  }, [pickupDate, dropoffDate]);
  const total = (car.daily_rate || car.pricePerDay) * days;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleBookNow = () => {
    selectCar({
      carId: car.id,
      pickupLocation,
      dropoffLocation: pickupLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    });
    navigate("/cart");
  };

  return (
    <>
      <Header />

      <div className="wrap">
        {/* ---------- Breadcrumb ---------- */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/car-rental">Car Rental</Link>
          <span>›</span>
          <span className="current">{car.name}</span>
        </nav>

        {/* ---------- แกลเลอรี ---------- */}
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
            <div className="row" style={{ marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
              <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                {car.category.toUpperCase()}
              </span>
              <span className="rate-box">
                ★ {car.reviews_summary?.average_star || car.rating}{" "}
                <span className="muted" style={{ fontWeight: 400 }}>
                  ({car.reviews_summary?.total_reviews || car.reviews} Reviews)
                </span>
              </span>
            </div>

            <h1>{car.name}</h1>
            <p className="muted" style={{ marginTop: 16 }}>
              {car.description}
            </p>
            {car.descriptionExtra && (
              <p className="muted" style={{ marginTop: 14 }}>
                {car.descriptionExtra}
              </p>
            )}

            <div className="divider" />

            <section className="blk" style={{ marginTop: 0 }}>
              <h2>Key Specifications</h2>
              <div className="spec-grid">
                <div className="spec-box">
                  <div className="spec-icon">⚙️</div>
                  <div className="spec-label">Transmission</div>
                  <b>{car.specs?.transmission || car.transmission}</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">🧑</div>
                  <div className="spec-label">Seats</div>
                  <b>{car.specs?.seats || car.seats} Seats</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">⛽</div>
                  <div className="spec-label">Fuel</div>
                  <b>{car.specs?.fuel_type || car.fuel}</b>
                </div>
                <div className="spec-box">
                  <div className="spec-icon">🧳</div>
                  <div className="spec-label">Luggage</div>
                  <b>{car.specs?.luggage || car.luggage}</b>
                </div>
              </div>
            </section>

            {/* ---------- ข้อมูลการจดทะเบียนและประกันภัยตาม Schema ---------- */}
            <section className="blk">
              <h2>Registration &amp; Insurance</h2>
              <div className="grid-2" style={{ marginTop: 14 }}>
                <div style={{ padding: "14px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                  <b>📋 Commercial License</b>
                  <div className="muted" style={{ fontSize: ".85rem", marginTop: 6, lineHeight: 1.6 }}>
                    ประเภท: {car.registration_and_license?.license_category || "ป้ายเขียวบริการธุรกิจ"}<br />
                    เลขใบอนุญาต: {car.registration_and_license?.transport_permit_number || "TP-BKK-2026-0089"}<br />
                    ภาษีสิ้นสุด: {car.registration_and_license?.tax_expiry_date || "2027-03-31"}
                  </div>
                </div>
                <div style={{ padding: "14px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                  <b>🛡️ First Class Commercial Insurance</b>
                  <div className="muted" style={{ fontSize: ".85rem", marginTop: 6, lineHeight: 1.6 }}>
                    บริษัท: {car.registration_and_license?.commercial_insurance?.insurance_company || "Viriyah Insurance"}<br />
                    กรมธรรม์: {car.registration_and_license?.commercial_insurance?.policy_number || "INS-COMM-998822"}<br />
                    ความคุ้มครอง: ชั้น 1 เพื่อการพาณิชย์/รถเช่า
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- จุดให้บริการ / Station ---------- */}
            <section className="blk">
              <h2>Station Location</h2>
              <div style={{ padding: "16px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", marginTop: 14 }}>
                <b>🏢 {car.current_station?.name || "Suvarnabhumi Airport Branch"}</b>
                <p className="muted" style={{ fontSize: ".88rem", marginTop: 4, marginBottom: 0 }}>
                  Station ID: {car.current_station?.station_id || "ST-01"} · City: {car.current_station?.city || "Bangkok"} · Counter: Gate 3, Arrival Hall
                </p>
              </div>
            </section>
          </div>

          {/* ---------- คอลัมน์ขวา: กล่องจอง ---------- */}
          <aside>
            <div className="card book-box sticky">
              <div className="between">
                <div>
                  <div className="price">
                    ฿{(car.daily_rate || car.pricePerDay).toLocaleString()}
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

              <Button
                variant="gold"
                full
                size="lg"
                onClick={handleBookNow}
                id="bookCarNowBtn"
              >
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
