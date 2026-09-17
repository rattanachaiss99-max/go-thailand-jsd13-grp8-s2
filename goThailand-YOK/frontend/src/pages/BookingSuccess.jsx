import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import PropertyCard from "../components/PropertyCard";
import CarCard from "../components/CarCard";
import { useBooking } from "../context/BookingContext";
import { useCatalog } from "../context/CatalogContext";
import { fetchBookingByRef } from "../api/client";

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * BookingSuccess (หน้าที่ 5/5)
 * ------------------------------------------------------------
 * หน้าสุดท้ายของ flow: ยืนยันว่าจองสำเร็จ แสดงเลขที่การจอง (booking_ref)
 * และรายการที่จองทั้งหมด (อาจมีทั้งรถ+ที่พักพร้อมกันในออเดอร์เดียว)
 * ดึงข้อมูลจริงจาก MongoDB ผ่าน GET /api/bookings/:ref มาแสดง พร้อม
 * ตัวตรวจสอบ Data Schema Payload Inspector สำหรับการเชื่อมต่อกับระบบอื่น
 * ------------------------------------------------------------
 */
export default function BookingSuccess() {
  const { bookingRef, customer, confirmedOrder, confirmedItems, selectedProperty, selectedCar } =
    useBooking();
  const { cars, getOtherProperties } = useCatalog();
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get("ref");
  const effectiveRef = refFromUrl || bookingRef;

  const [activeTab, setActiveTab] = useState("order"); // "order" | item index as string
  const [copied, setCopied] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // ดึงการจองที่บันทึกไว้จริงใน MongoDB กลับมาแสดง (แทนที่จะเชื่อแค่ state
  // ในเครื่อง) — ทำให้หน้านี้แสดงข้อมูล "ที่จองสำเร็จแล้วจริง" แม้ผู้ใช้จะ
  // รีเฟรชหน้า หรือเข้าลิงก์ตรงด้วย ?ref=... ก็ยังดึงข้อมูลได้
  const [remoteOrder, setRemoteOrder] = useState(null);
  const [remoteItems, setRemoteItems] = useState(null);

  useEffect(() => {
    if (!effectiveRef) return;
    let cancelled = false;
    fetchBookingByRef(effectiveRef)
      .then(({ order, items }) => {
        if (cancelled) return;
        setRemoteOrder(order);
        setRemoteItems(items);
      })
      .catch(() => {
        // ดึงไม่สำเร็จ (เช่น backend ล่ม) — ปล่อยให้ใช้ค่าจาก context แทน
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveRef]);

  if (!effectiveRef) {
    return <Navigate to="/" replace />;
  }

  // ใช้ข้อมูลที่ดึงจาก MongoDB จริงก่อนเสมอถ้ามี ไม่งั้น fallback ไปที่ค่าใน
  // context (ระหว่างรอ fetch เสร็จ — โดยปกติจะมีอยู่แล้วทันทีหลัง confirmBooking)
  const orderJson = remoteOrder || confirmedOrder;
  const items = remoteItems || confirmedItems || [];

  const hasCarItem = items.some((it) => it.item_type === "car");
  const hasAccommodationItem = items.some((it) => it.item_type === "accommodation");

  const propertySuggestions = hasAccommodationItem ? getOtherProperties(selectedProperty.id, 3) : [];
  const carSuggestions = hasCarItem ? cars.filter((c) => c.id !== selectedCar.id).slice(0, 3) : [];

  const currentInspectorJson = activeTab === "order" ? orderJson : items[Number(activeTab)];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentInspectorJson, null, 2));
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
          Thank you for choosing GoThailand, <b>{orderJson?.contact_name || customer?.fullName || "traveller"}</b>.
          Your reservation is confirmed and linked to order ref <code>{effectiveRef}</code>.
          {orderJson?.contact_email && (
            <> A confirmation receipt has been sent to <b>{orderJson.contact_email}</b>.</>
          )}
        </p>

        <div className="success-layout" style={{ marginTop: 32 }}>
          {/* ---------- การ์ดยืนยันการจอง (1 การ์ดต่อ 1 item ในออเดอร์) ---------- */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="booking-id-row">
              <div>
                <label className="fl">Booking Reference</label>
                <b style={{ fontSize: "1.1rem", color: "var(--color-brand)" }}>{effectiveRef}</b>
              </div>
              <span className="status-pill">Confirmed</span>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: 24 }}>
                <p className="muted">Loading your booking…</p>
              </div>
            ) : (
              items.map((item, i) => {
                const isCar = item.item_type === "car";
                return (
                  <div
                    className="confirm-item"
                    key={item.id}
                    style={i > 0 ? { borderTop: "1px solid var(--color-line)", paddingTop: 16, marginTop: 16 } : undefined}
                  >
                    <PhotoPlaceholder
                      src={
                        isCar
                          ? selectedCar.images?.[0] || selectedCar.image
                          : item.accommodation_snapshot?.featured_image || selectedProperty.pictures[0]
                      }
                      alt={isCar ? `${item.car_snapshot?.brand} ${item.car_snapshot?.model}` : item.accommodation_snapshot?.name}
                    />
                    <div>
                      <span className="stars">★★★★★</span>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                          {isCar ? item.car_snapshot?.category?.toUpperCase() : item.accommodation_snapshot?.category}
                        </span>
                      </div>

                      <h3 style={{ marginTop: 8 }}>
                        {isCar
                          ? `${item.car_snapshot?.brand} ${item.car_snapshot?.model}`
                          : item.accommodation_snapshot?.name}
                      </h3>

                      <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                        {isCar ? (
                          <>📍 Pick-up Station: {item.pickup?.station_name}</>
                        ) : (
                          <>📍 {item.accommodation_snapshot?.location_label} · <b>{item.room_type_name}</b></>
                        )}
                      </div>

                      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        {isCar ? (
                          <>
                            <div>
                              <label className="fl">Pick-up</label>
                              <b>{shortDate(item.start_date)}</b>
                            </div>
                            <div>
                              <label className="fl">Drop-off</label>
                              <b>{shortDate(item.end_date)}</b>
                            </div>
                            <div>
                              <label className="fl">Duration</label>
                              <b>{item.pricing?.rental_days} Days</b>
                            </div>
                            <div>
                              <label className="fl">Total</label>
                              <b>฿{item.pricing?.total_price?.toLocaleString()}</b>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="fl">Check-in</label>
                              <b>{shortDate(item.check_in_date)}</b>
                            </div>
                            <div>
                              <label className="fl">Check-out</label>
                              <b>{shortDate(item.check_out_date)}</b>
                            </div>
                            <div>
                              <label className="fl">Duration</label>
                              <b>{item.nights} Nights</b>
                            </div>
                            <div>
                              <label className="fl">Total</label>
                              <b>฿{item.total_price?.toLocaleString()}</b>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {orderJson && (
              <div className="muted" style={{ marginTop: 12, fontSize: ".85rem", borderTop: "1px dashed var(--color-line)", paddingTop: 8 }}>
                👤 Contact: {orderJson.contact_name} ({orderJson.contact_phone})
              </div>
            )}
          </div>

          {/* ---------- สรุปการชำระเงิน ---------- */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 14 }}>Payment Summary</h3>
            <div className="sum-row">
              <span>Subtotal</span>
              <b>฿{orderJson?.subtotal?.toLocaleString() ?? "—"}</b>
            </div>
            <div className="sum-row">
              <span>Taxes &amp; Fees</span>
              <b>฿{orderJson?.tax?.toLocaleString() ?? "—"}</b>
            </div>
            <div className="sum-total">
              <span>Total Paid</span>
              <div className="price">฿{orderJson?.total_price?.toLocaleString() ?? "—"}</div>
            </div>

            {orderJson && (
              <div className="pay-status" style={{ marginTop: 14 }}>
                ✓ Payment Status: Paid ({orderJson.payment_method})
              </div>
            )}

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
                  One order can carry multiple items — pick a tab below.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("order")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: ".82rem",
                    background: activeTab === "order" ? "var(--color-accent)" : "#334155",
                    color: activeTab === "order" ? "var(--color-brand)" : "#CBD5E1",
                  }}
                >
                  bookings (Header)
                </button>
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(String(i))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 4,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: ".82rem",
                      background: activeTab === String(i) ? "var(--color-accent)" : "#334155",
                      color: activeTab === String(i) ? "var(--color-brand)" : "#CBD5E1",
                    }}
                  >
                    {item.item_type === "car" ? "Car" : "Accommodation"} (booking_items)
                  </button>
                ))}
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
              <code>{JSON.stringify(currentInspectorJson, null, 2)}</code>
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
            {hasCarItem && carSuggestions.map((c) => <CarCard key={c.id} car={c} />)}
            {hasAccommodationItem &&
              propertySuggestions.map((p) => <PropertyCard key={p.id} property={p} mode="mini" />)}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
