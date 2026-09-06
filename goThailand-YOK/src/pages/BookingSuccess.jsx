import { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import PropertyCard from "../components/PropertyCard";
import CarCard from "../components/CarCard";
import { useBooking } from "../context/BookingContext";
import { getOtherProperties } from "../data/properties";
import { cars } from "../data/cars";

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * BookingSuccess (หน้าที่ 5/5)
 * ------------------------------------------------------------
 * หน้าสุดท้ายของ flow: ยืนยันว่าจองสำเร็จ แสดงเลขที่การจอง (booking_ref)
 * และข้อมูล Snapshot ทั้งหมดตาม Data Schema พร้อมตัวตรวจสอบ
 * Data Schema Payload Inspector สำหรับการเชื่อมต่อกับระบบอื่น
 * ------------------------------------------------------------
 */
export default function BookingSuccess() {
  const {
    booking,
    selectedProperty,
    selectedCar,
    nights,
    carDays,
    bookingRef,
    customer,
    confirmedOrder,
    confirmedItem,
  } = useBooking();

  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "booking_items"
  const [copied, setCopied] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  if (!bookingRef) {
    return <Navigate to="/" replace />;
  }

  const isCar = confirmedItem
    ? confirmedItem.item_type === "car"
    : booking.cartType === "car";

  const orderJson = confirmedOrder || {
    id: 1,
    booking_ref: bookingRef,
    user_id: 42,
    status: "confirmed",
    payment_status: "paid",
    payment_method: "credit_card",
    contact_name: customer?.fullName || "Siwat J.",
    contact_email: customer?.email || "sj.siwat@gmail.com",
    contact_phone: customer?.phone || "0812345678",
    currency: "THB",
    subtotal: isCar ? (selectedCar.daily_rate * carDays) : (selectedProperty.pricePerNight * nights),
    discount: 0,
    tax: isCar ? 0 : Math.round(selectedProperty.pricePerNight * nights * 0.05),
    total_price: customer?.total || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cancelled_at: null,
  };

  const itemJson = confirmedItem || {
    id: 77777,
    booking_id: orderJson.id,
    booking_reference: bookingRef,
    item_type: isCar ? "car" : "accommodation",
    status: "confirmed",
    ...(isCar
      ? {
          car_id: selectedCar._id,
          car_snapshot: {
            brand: selectedCar.brand,
            model: selectedCar.model,
            license_plate: selectedCar.license_plate,
            category: selectedCar.category,
            seats: selectedCar.specs?.seats,
          },
          start_date: `${booking.pickupDate}T10:00:00Z`,
          end_date: `${booking.dropoffDate}T10:00:00Z`,
          pricing: {
            daily_rate: selectedCar.daily_rate,
            rental_days: carDays,
            total_price: selectedCar.daily_rate * carDays,
          },
        }
      : {
          accommodation_id: selectedProperty._id,
          accommodation_snapshot: {
            name: selectedProperty.name,
            category: selectedProperty.category,
            room_name: "Standard Room",
            location_label: selectedProperty.location?.address_label || String(selectedProperty.location),
            featured_image: selectedProperty.images[0],
            rating_avg: selectedProperty.rating_avg,
          },
          check_in_date: booking.checkIn,
          check_out_date: booking.checkOut,
          nights,
        }),
  };

  const propertySuggestions = getOtherProperties(selectedProperty.id, 3);
  const carSuggestions = cars.filter((c) => c.id !== selectedCar.id).slice(0, 3);

  const handleCopyJson = () => {
    const dataToCopy = activeTab === "bookings" ? orderJson : itemJson;
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />

      <div className="wrap success-wrap">
        <Stepper current={4} />

        <div className="success-icon">✓</div>
        <h1>Booking Confirmed</h1>
        <p className="muted" style={{ maxWidth: 520, margin: "10px auto 0", lineHeight: 1.6 }}>
          Thank you for choosing GoThailand, <b>{orderJson.contact_name}</b>.
          Your reservation is confirmed and linked to order ref <code>{bookingRef}</code>.
          A confirmation receipt has been sent to <b>{orderJson.contact_email}</b>.
        </p>

        <div className="success-layout" style={{ marginTop: 32 }}>
          {/* ---------- การ์ดยืนยันการจอง ---------- */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="booking-id-row">
              <div>
                <label className="fl">Booking Reference</label>
                <b style={{ fontSize: "1.1rem", color: "var(--color-brand)" }}>{bookingRef}</b>
              </div>
              <span className="status-pill">Confirmed</span>
            </div>

            <div className="confirm-item">
              <PhotoPlaceholder
                src={
                  isCar
                    ? confirmedItem?.car_snapshot?.brand
                      ? selectedCar.images?.[0] || selectedCar.image
                      : selectedCar.images?.[0]
                    : confirmedItem?.accommodation_snapshot?.featured_image || selectedProperty.images[0]
                }
                alt={isCar ? selectedCar.name : selectedProperty.name}
              />
              <div>
                <span className="stars">★★★★★</span>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                    {isCar
                      ? confirmedItem?.car_snapshot?.category?.toUpperCase() || selectedCar.category.toUpperCase()
                      : confirmedItem?.accommodation_snapshot?.category || selectedProperty.category}
                  </span>
                </div>

                <h3 style={{ marginTop: 8 }}>
                  {isCar
                    ? `${confirmedItem?.car_snapshot?.brand || selectedCar.brand} ${confirmedItem?.car_snapshot?.model || selectedCar.model}`
                    : confirmedItem?.accommodation_snapshot?.name || selectedProperty.name}
                </h3>

                <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                  {isCar ? (
                    <>📍 Pick-up Station: {confirmedItem?.pickup?.station_name || booking.pickupLocation}</>
                  ) : (
                    <>📍 {confirmedItem?.accommodation_snapshot?.location_label || selectedProperty.location?.address_label} · <b>{confirmedItem?.room_type_name || "Suite"}</b></>
                  )}
                </div>

                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  {isCar ? (
                    <>
                      <div>
                        <label className="fl">Pick-up</label>
                        <b>{shortDate(booking.pickupDate)} ({booking.pickupTime})</b>
                      </div>
                      <div>
                        <label className="fl">Drop-off</label>
                        <b>{shortDate(booking.dropoffDate)} ({booking.dropoffTime})</b>
                      </div>
                      <div>
                        <label className="fl">Duration</label>
                        <b>{carDays} Days</b>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="fl">Check-in</label>
                        <b>{shortDate(confirmedItem?.check_in_date || booking.checkIn)}</b>
                      </div>
                      <div>
                        <label className="fl">Check-out</label>
                        <b>{shortDate(confirmedItem?.check_out_date || booking.checkOut)}</b>
                      </div>
                      <div>
                        <label className="fl">Duration</label>
                        <b>{nights} Nights</b>
                      </div>
                    </>
                  )}
                </div>

                <div className="muted" style={{ marginTop: 12, fontSize: ".85rem", borderTop: "1px dashed var(--color-line)", paddingTop: 8 }}>
                  👤 Contact: {orderJson.contact_name} ({orderJson.contact_phone})
                </div>
              </div>
            </div>
          </div>

          {/* ---------- สรุปการชำระเงิน ---------- */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 14 }}>Payment Summary</h3>
            <div className="sum-row">
              <span>Subtotal</span>
              <b>฿{orderJson.subtotal?.toLocaleString()}</b>
            </div>
            <div className="sum-row">
              <span>Service Fee</span>
              <b>{isCar ? "฿0" : "฿500"}</b>
            </div>
            <div className="sum-row">
              <span>Taxes &amp; Fees</span>
              <b>{isCar ? "Included" : `฿${orderJson.tax?.toLocaleString()}`}</b>
            </div>
            <div className="sum-total">
              <span>Total Paid</span>
              <div className="price">฿{orderJson.total_price?.toLocaleString()}</div>
            </div>

            <div className="pay-status" style={{ marginTop: 14 }}>
              ✓ Payment Status: Paid ({orderJson.payment_method})
            </div>

            <div style={{ marginTop: 20 }}>
              <Button to="/" variant="gold" full size="lg">Back to Home</Button>
            </div>

            <button
              type="button"
              onClick={() => setShowJsonInspector((v) => !v)}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "10px",
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: ".85rem",
                color: "var(--color-brand)",
              }}
              id="inspectDataSchemaBtn"
            >
              {showJsonInspector ? "▲ Hide Schema JSON Payload" : "▼ Inspect Data Schema JSON Payload"}
            </button>
          </div>
        </div>

        {/* ---------- DATA SCHEMA PAYLOAD INSPECTOR (Verification Feature) ---------- */}
        {showJsonInspector && (
          <div
            className="card"
            style={{
              marginTop: 24,
              textAlign: "left",
              padding: 24,
              border: "2px solid var(--color-brand)",
              background: "#1E293B",
              color: "#F8FAFC",
            }}
          >
            <div className="between" style={{ alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ color: "#F8FAFC", margin: 0 }}>Data Schema Inspector (DATA.md Aligned)</h3>
                <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: ".82rem" }}>
                  Active MongoDB JSON payload conforms directly to <code>bookings</code> and <code>booking_items</code> schema.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: ".82rem",
                    background: activeTab === "bookings" ? "var(--color-accent)" : "#334155",
                    color: activeTab === "bookings" ? "var(--color-brand)" : "#CBD5E1",
                  }}
                >
                  bookings (Header)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("booking_items")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: ".82rem",
                    background: activeTab === "booking_items" ? "var(--color-accent)" : "#334155",
                    color: activeTab === "booking_items" ? "var(--color-brand)" : "#CBD5E1",
                  }}
                >
                  booking_items (Item)
                </button>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 4,
                    border: "1px solid #475569",
                    cursor: "pointer",
                    fontSize: ".82rem",
                    background: "#0F172A",
                    color: "#38BDF8",
                  }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy JSON"}
                </button>
              </div>
            </div>

            <pre
              style={{
                background: "#0F172A",
                padding: 16,
                borderRadius: 6,
                overflowX: "auto",
                fontSize: ".82rem",
                color: "#E2E8F0",
                lineHeight: 1.5,
                maxHeight: 360,
              }}
            >
              <code>
                {JSON.stringify(activeTab === "bookings" ? orderJson : itemJson, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {/* ---------- รายการแนะนำเพิ่มเติม ---------- */}
        <section style={{ marginTop: 60, textAlign: "left" }}>
          <h2>Explore More In Thailand</h2>
          <p className="muted" style={{ marginTop: 4 }}>
            Continue planning your journey with these hand-selected options.
          </p>
          <div className="also-grid" style={{ marginTop: 24 }}>
            {isCar
              ? carSuggestions.map((c) => <CarCard key={c.id} car={c} />)
              : propertySuggestions.map((p) => (
                  <PropertyCard key={p.id} property={p} mode="mini" />
                ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
