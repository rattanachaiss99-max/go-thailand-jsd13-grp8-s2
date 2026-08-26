import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import DateRangeFields from "../components/DateRangeFields";
import GuestRoomSelector from "../components/GuestRoomSelector";
import { useBooking } from "../context/BookingContext";
import { getPropertyById, properties } from "../data/properties";
import { getRegionLabel } from "../data/regions";

/**
 * AccommodationDetail (หน้าที่ 2/5)
 * ------------------------------------------------------------
 * แสดงรายละเอียดที่พักที่เลือกมาจากหน้า Listing (อ่าน id จาก URL
 * ผ่าน useParams) พร้อมแกลเลอรีรูปจริง 5 รูป, สิ่งอำนวยความสะดวก,
 * แผนที่ และกล่องจองด้านขวาที่ให้ผู้ใช้เลือกวันเข้าพัก/ออกและจำนวน
 * ผู้เข้าพักได้จริง (DateRangeFields / GuestRoomSelector) ราคารวม
 * จะคำนวณใหม่ทันทีตามจำนวนคืนที่เลือก
 * กด "Reserve now" จะบันทึกที่พักลง BookingContext แล้วไปหน้า Cart
 * ------------------------------------------------------------
 */
export default function AccommodationDetail() {
  const { id } = useParams();
  const { selectProperty, nights } = useBooking();
  const property = getPropertyById(id) || properties[0];

  // ถ้าเข้าหน้านี้ตรง ๆ (เช่น พิมพ์ URL เอง) ให้ผูกที่พักนี้เข้ากับ context ด้วย
  useEffect(() => {
    selectProperty(property.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);

  const subtotal = property.pricePerNight * nights;
  const serviceFee = 500;
  const taxes = 300;
  const total = subtotal + serviceFee + taxes;

  return (
    <>
      <Header />

      <div className="wrap">
        <Stepper current={1} />

        <p style={{ fontSize: ".9rem", color: "var(--color-muted)" }}>
          Accommodation › {getRegionLabel(property.region)} › {property.name}
        </p>

        <div className="gallery">
          {property.images.map((src, i) => (
            <PhotoPlaceholder key={src} src={src} alt={`${property.name} photo ${i + 1}`} />
          ))}
        </div>

        <div className="detail-layout">
          {/* ---------- คอลัมน์ซ้าย: รายละเอียดที่พัก ---------- */}
          <div>
            <h1>{property.name}</h1>
            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <span className="rate-box">
                ★ {property.rating.toFixed(1)}{" "}
                <span className="muted" style={{ fontWeight: 400 }}>
                  ({property.reviews} reviews)
                </span>
              </span>
              <span className="tag">{getRegionLabel(property.region)}</span>
              <span className="muted">📍 {property.location}</span>
              <a
                href="#map"
                style={{
                  color: "var(--color-accent)",
                  fontSize: ".85rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                View map
              </a>
            </div>

            <section className="blk">
              <h2>About this property</h2>
              <p className="muted" style={{ marginTop: 14 }}>{property.description}</p>
              <p className="muted" style={{ marginTop: 14 }}>{property.descriptionExtra}</p>
            </section>

            <section className="blk">
              <h2>Exceptional amenities</h2>
              <div className="amen">
                {property.amenities.map((a) => (
                  <div key={a.label}>
                    <span>{a.icon}</span> {a.label}
                  </div>
                ))}
              </div>
            </section>

            <section className="blk" id="map">
              <h2>Location &amp; surroundings</h2>
              <div className="map-shell ph ph-map">
                <div className="map-pin">📍 {property.location}</div>
              </div>
              <div className="near">
                {property.nearby.map((n) => (
                  <div key={n.name}>
                    {n.name} <span>{n.distance}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ---------- คอลัมน์ขวา: กล่องจอง (เลือกวันที่ + จำนวนผู้เข้าพักได้จริง) ---------- */}
          <aside>
            <div className="card book-box sticky">
              <div className="between">
                <div className="price">
                  ฿{property.pricePerNight.toLocaleString()} <small>/ night</small>
                </div>
                <span className="avail">Available</span>
              </div>

              <DateRangeFields />
              <GuestRoomSelector />

              <Button to="/cart" variant="gold" full size="lg" style={{ marginTop: 20 }}>
                Reserve now
              </Button>
              <p className="center muted" style={{ fontSize: ".85rem", marginTop: 10 }}>
                You won't be charged yet
              </p>

              <div className="divider" />
              <div className="sum-row">
                <span>฿{property.pricePerNight.toLocaleString()} × {nights} nights</span>
                <b>฿{subtotal.toLocaleString()}</b>
              </div>
              <div className="sum-row">
                <span>Service fee</span>
                <b>฿{serviceFee.toLocaleString()}</b>
              </div>
              <div className="sum-row">
                <span>Taxes &amp; fees</span>
                <b>฿{taxes.toLocaleString()}</b>
              </div>
              <div className="sum-total">
                <h3>Total</h3>
                <div className="price">฿{total.toLocaleString()}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
