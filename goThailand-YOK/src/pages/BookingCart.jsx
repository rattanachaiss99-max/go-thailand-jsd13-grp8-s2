import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import OrderSummary from "../components/OrderSummary";
import PropertyCard from "../components/PropertyCard";
import DateRangeFields from "../components/DateRangeFields";
import GuestRoomSelector from "../components/GuestRoomSelector";
import { useBooking } from "../context/BookingContext";
import { getOtherProperties } from "../data/properties";

/**
 * BookingCart (หน้าที่ 3/5)
 * ------------------------------------------------------------
 * ตะกร้าจอง: อ่านที่พักที่เลือกไว้จาก BookingContext มาแสดงพร้อม
 * วันเข้าพัก/ออก จำนวนผู้เข้าพัก และสรุปยอดรวม กด "Proceed to
 * Checkout" จะไปหน้า Checkout (/checkout) พร้อมข้อมูลชุดเดิม
 * กด "Edit booking" จะเปิดแผงแก้ไขวันที่/จำนวนผู้เข้าพักแบบเดียวกับ
 * หน้า Detail (ใช้ DateRangeFields/GuestRoomSelector ชุดเดิม เพราะ
 * ทั้งสองหน้าผูกกับ BookingContext เดียวกัน) ด้านล่างมีการ์ดแนะนำ
 * ที่พักอื่น ("You Might Also Like") reuse PropertyCard โหมด mini
 * ------------------------------------------------------------
 */
export default function BookingCart() {
  const { selectedProperty, booking, nights } = useBooking();
  const [editing, setEditing] = useState(false);

  const subtotal = selectedProperty.pricePerNight * nights;
  const serviceFee = 500;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + taxes;

  const suggestions = getOtherProperties(selectedProperty.id, 3);

  return (
    <>
      <Header />

      <div className="wrap">
        <Stepper current={2} />

        <h1>Your Booking Cart</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          Review your accommodation details before completing your reservation.
        </p>

        <div className="cart-layout">
          {/* ---------- คอลัมน์ซ้าย: รายการที่จอง + สิ่งการันตี ---------- */}
          <div>
            <div className="card cart-item">
              <PhotoPlaceholder src={selectedProperty.images[0]} alt={selectedProperty.name} />
              <div className="cart-item-body">
                <div className="between">
                  <h3>{selectedProperty.name}</h3>
                  <span className="stars">★★★★★</span>
                </div>
                <div className="muted" style={{ margin: "6px 0 14px" }}>
                  📍 {selectedProperty.location}
                </div>

                {editing ? (
                  <div className="edit-panel">
                    <DateRangeFields />
                    <GuestRoomSelector />
                  </div>
                ) : (
                  <div
                    className="row"
                    style={{
                      background: "var(--color-bg)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <label className="fl">Dates</label>
                      <b>{shortDate(booking.checkIn)} – {shortDate(booking.checkOut)}</b>
                      <div className="muted" style={{ fontSize: ".82rem" }}>{nights} Nights</div>
                    </div>
                    <div>
                      <label className="fl">Guests</label>
                      <b>{booking.guests.adults} Adults</b>
                      <div className="muted" style={{ fontSize: ".82rem" }}>{booking.rooms} Room</div>
                    </div>
                  </div>
                )}

                <div className="hotel-foot" style={{ marginTop: 16, borderTop: "none", paddingTop: 0 }}>
                  <div className="row">
                    <button
                      type="button"
                      onClick={() => setEditing((v) => !v)}
                      style={{
                        fontSize: ".85rem",
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-ink)",
                        padding: 0,
                      }}
                    >
                      {editing ? "Done editing" : "Edit booking"}
                    </button>
                    <Button to="/accommodations" variant="link" style={{ padding: 0, color: "#C0392B", fontSize: ".85rem" }}>
                      Remove
                    </Button>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: ".85rem", textAlign: "right" }}>
                      ฿{selectedProperty.pricePerNight.toLocaleString()}/night
                    </div>
                    <div className="price">฿{subtotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="perks">
              <div><div className="ico">🛡️</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Secure Booking</div></div>
              <div><div className="ico">✅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Verified Property</div></div>
              <div><div className="ico">🎧</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>24/7 Support</div></div>
              <div><div className="ico">📅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Flexible Cancel</div></div>
            </div>
          </div>

          {/* ---------- คอลัมน์ขวา: สรุปยอด ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              <OrderSummary
                lines={[
                  { label: "Accommodation Subtotal", amount: subtotal },
                  { label: "Service Fee", amount: serviceFee },
                  { label: "Taxes & Fees", amount: taxes },
                ]}
                total={total}
              />
              <Button to="/checkout" variant="gold" full size="lg" style={{ marginTop: 18 }}>
                Proceed to Checkout
              </Button>
              <p className="center muted" style={{ fontSize: ".82rem", marginTop: 10 }}>
                You won't be charged yet
              </p>
            </div>
          </aside>
        </div>

        <section className="also-like">
          <h2 className="center">You Might Also Like</h2>
          <div className="also-grid">
            {suggestions.map((p) => (
              <PropertyCard key={p.id} property={p} mode="mini" />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

/** วันที่แบบสั้น เช่น "Dec 24" ใช้แสดงในสรุปช่วงวันที่ */
function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
