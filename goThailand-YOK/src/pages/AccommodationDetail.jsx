import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
 * แสดงรายละเอียดที่พักที่เลือกมาจากหน้า Listing
 * สอดคล้องกับ Data Schema:
 *  - Master Collection: Accommodation
 *  - รองรับเลือกประเภทห้องพัก (rooms) จาก schema
 *  - แสดง policies (check_in_time, check_out_time, cancellation_policy)
 *  - แสดง special_options และ facilities ครบถ้วน
 * ------------------------------------------------------------
 */
export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectProperty, selectRoomType, selectedRoom, booking, nights } = useBooking();
  const property = getPropertyById(id) || properties[0];

  useEffect(() => {
    selectProperty(property.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);

  const activeRoom =
    selectedRoom || property.rooms?.[0] || {
      room_type_id: "default",
      name: property.name,
      bed_type: "1 King Bed",
      price_per_night: property.base_price_per_night || property.pricePerNight,
    };

  const currentPricePerNight = activeRoom.price_per_night || property.base_price_per_night || property.pricePerNight;
  const roomCount = booking.rooms || 1;
  const subtotal = currentPricePerNight * nights * roomCount;
  const serviceFee = 500;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + taxes;

  const addressText = property.location?.address_label || String(property.location);

  const handleReserve = () => {
    selectProperty(property.id, activeRoom?.room_type_id);
    navigate("/cart");
  };

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
            <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span className="pill-img" style={{ position: "static", background: "var(--color-brand)" }}>
                {property.category}
              </span>
              {property.special_options?.map((opt) => (
                <span className="tag" key={opt} style={{ background: "#F4F6F8" }}>
                  ✓ {opt}
                </span>
              ))}
            </div>

            <h1>{property.name}</h1>
            <div className="row" style={{ marginTop: 12, flexWrap: "wrap", gap: 12 }}>
              <span className="rate-box">
                ★ {(property.rating_avg || property.rating).toFixed(1)}{" "}
                <span className="muted" style={{ fontWeight: 400 }}>
                  ({property.total_reviews || property.reviews} reviews)
                </span>
              </span>
              <span className="tag">{getRegionLabel(property.region)}</span>
              <span className="muted">📍 {addressText}</span>
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
              {property.descriptionExtra && (
                <p className="muted" style={{ marginTop: 14 }}>{property.descriptionExtra}</p>
              )}
            </section>

            {/* ---------- เลือกประเภทห้องพัก (Rooms according to Schema) ---------- */}
            {property.rooms && property.rooms.length > 0 && (
              <section className="blk">
                <h2>Select Room Type</h2>
                <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                  {property.rooms.map((room) => {
                    const isSelected = activeRoom.room_type_id === room.room_type_id;
                    return (
                      <div
                        key={room.room_type_id}
                        onClick={() => selectRoomType(room.room_type_id)}
                        className={`card ${isSelected ? "room-selected" : ""}`}
                        style={{
                          padding: "16px 20px",
                          cursor: "pointer",
                          border: isSelected ? "2px solid var(--color-brand)" : "1px solid var(--color-line)",
                          background: isSelected ? "rgba(10, 37, 64, 0.02)" : "#fff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div className="between" style={{ alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input
                                type="radio"
                                name="roomSelect"
                                checked={isSelected}
                                onChange={() => selectRoomType(room.room_type_id)}
                                style={{ accentColor: "var(--color-brand)" }}
                              />
                              <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{room.name}</h3>
                            </div>
                            <div className="muted" style={{ fontSize: ".85rem", marginTop: 4, marginLeft: 24 }}>
                              🛏️ {room.bed_type} · 👤 Max {room.max_guests?.adults || 2} Adults
                              {room.max_guests?.children ? `, ${room.max_guests.children} Children` : ""}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="price" style={{ fontSize: "1.15rem" }}>
                              ฿{room.price_per_night.toLocaleString()}
                              <small>/night</small>
                            </div>
                            <div className="muted" style={{ fontSize: ".75rem" }}>
                              {room.available_quantity} rooms left
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="blk">
              <h2>Facilities &amp; Amenities</h2>
              <div className="amen">
                {property.facilities?.map((f) => (
                  <div key={f}>
                    <span>✨</span> {f}
                  </div>
                ))}
              </div>
            </section>

            <section className="blk">
              <h2>Property Policies</h2>
              <div className="grid-2" style={{ marginTop: 14 }}>
                <div style={{ padding: "14px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                  <b>🕒 Check-in / Check-out</b>
                  <div className="muted" style={{ fontSize: ".88rem", marginTop: 4 }}>
                    Check-in: {property.policies?.check_in_time || "15:00"}<br />
                    Check-out: {property.policies?.check_out_time || "12:00"}
                  </div>
                </div>
                <div style={{ padding: "14px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                  <b>🛡️ Cancellation Policy</b>
                  <div className="muted" style={{ fontSize: ".88rem", marginTop: 4 }}>
                    {property.policies?.cancellation_policy || "Free cancellation up to 48 hours before check-in"}
                  </div>
                </div>
              </div>
            </section>

            <section className="blk" id="map">
              <h2>Location &amp; surroundings</h2>
              <div className="map-shell ph ph-map">
                <div className="map-pin">📍 {addressText}</div>
              </div>
              <div className="near">
                {property.location?.nearby_landmarks?.map((n) => (
                  <div key={n.name}>
                    {n.name} <span>{n.distance}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ---------- คอลัมน์ขวา: กล่องจอง ---------- */}
          <aside>
            <div className="card book-box sticky">
              <div className="between">
                <div>
                  <div className="price">
                    ฿{currentPricePerNight.toLocaleString()} <small>/ night</small>
                  </div>
                  <div className="muted" style={{ fontSize: ".8rem" }}>
                    {activeRoom.name}
                  </div>
                </div>
                <span className="avail">Available</span>
              </div>

              <DateRangeFields />
              <GuestRoomSelector />

              <Button
                variant="gold"
                full
                size="lg"
                style={{ marginTop: 20 }}
                onClick={handleReserve}
                id="reserveNowBtn"
              >
                Book Now →
              </Button>
              <p className="center muted" style={{ fontSize: ".85rem", marginTop: 10 }}>
                You won't be charged yet
              </p>

              <div className="divider" />
              <div className="sum-row">
                <span>
                  ฿{currentPricePerNight.toLocaleString()} × {nights} nights
                  {roomCount > 1 ? ` × ${roomCount} rooms` : ""}
                </span>
                <b>฿{subtotal.toLocaleString()}</b>
              </div>
              <div className="sum-row">
                <span>Service fee</span>
                <b>฿{serviceFee.toLocaleString()}</b>
              </div>
              <div className="sum-row">
                <span>Taxes &amp; fees (5%)</span>
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
