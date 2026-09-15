import { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import OrderSummary from "../components/OrderSummary";
import PropertyCard from "../components/PropertyCard";
import CarCard from "../components/CarCard";
import DateRangeFields from "../components/DateRangeFields";
import GuestRoomSelector from "../components/GuestRoomSelector";
import { useBooking } from "../context/BookingContext";
import { useCatalog } from "../context/CatalogContext";

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dt = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dt}`;
}

/**
 * BookingCart (หน้าที่ 3/5)
 * ------------------------------------------------------------
 * ตะกร้าจอง: แสดง "ทุกรายการที่อยู่ในตะกร้าจริง" พร้อมกัน — ที่พัก
 * และรถเช่าเป็นอิสระต่อกัน (แสดงเฉพาะ section ของประเภทที่มีอยู่จริง)
 * เชื่อมโยงข้อมูล Snapshot และ Pricing Breakdown ตาม Data Schema
 * ------------------------------------------------------------
 */
export default function BookingCart() {
  const {
    cart,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    hasAccommodationInCart,
    hasCarInCart,
    updateCarDates,
    removeFromCart,
  } = useBooking();
  const { cars, getOtherProperties } = useCatalog();

  const [editingStay, setEditingStay] = useState(false);
  const [editingCar, setEditingCar] = useState(false);

  if (!hasAccommodationInCart && !hasCarInCart) {
    return <Navigate to="/" replace />;
  }

  // คำนวณราคาสำหรับ Accommodation
  const activeRoom =
    selectedRoom || selectedProperty?.rooms?.[0] || {
      name: "Standard Suite",
      price_per_night: selectedProperty.base_price_per_night || selectedProperty.pricePerNight,
    };
  const roomPrice = activeRoom.price_per_night || selectedProperty.base_price_per_night;
  const roomCount = cart.accommodation.rooms || 1;
  const hotelSubtotal = roomPrice * nights * roomCount;
  const hotelServiceFee = 500;
  const hotelTaxes = Math.round(hotelSubtotal * 0.05);
  const hotelTotal = hotelSubtotal + hotelServiceFee + hotelTaxes;

  // คำนวณราคาสำหรับ Car
  const carRate = selectedCar.daily_rate || selectedCar.pricePerDay;
  const carSubtotal = carRate * carDays;
  const carTotal = carSubtotal;

  const grandTotal = (hasAccommodationInCart ? hotelTotal : 0) + (hasCarInCart ? carTotal : 0);

  const propertySuggestions = getOtherProperties(selectedProperty.id, 3);
  const carSuggestions = cars.filter((c) => c.id !== selectedCar.id).slice(0, 3);

  const bothInCart = hasAccommodationInCart && hasCarInCart;

  return (
    <>
      <Header />

      <div className="wrap">
        <Stepper current={2} />

        <h1>Your Booking Cart</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          {bothInCart
            ? "Review your accommodation and car rental together before completing your reservation."
            : `Review your ${hasCarInCart ? "car rental" : "accommodation"} details before completing your reservation.`}
        </p>

        <div className="cart-layout">
          {/* ---------- คอลัมน์ซ้าย: รายการที่จอง ---------- */}
          <div>
            {hasAccommodationInCart && (
              <div className="card cart-item">
                <PhotoPlaceholder src={selectedProperty.images[0]} alt={selectedProperty.name} />
                <div className="cart-item-body">
                  <div className="between">
                    <div>
                      <span className="pill-img" style={{ position: "static", background: "var(--color-brand)", marginRight: 8 }}>
                        {selectedProperty.category}
                      </span>
                      <h3 style={{ display: "inline-block", margin: 0 }}>{selectedProperty.name}</h3>
                    </div>
                    <span className="stars">★★★★★</span>
                  </div>

                  <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                    📍 {selectedProperty.location?.address_label || String(selectedProperty.location)} · <b>{activeRoom.name}</b>
                  </div>

                  {editingStay ? (
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
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div>
                        <label className="fl">Dates</label>
                        <b>{shortDate(cart.accommodation.checkIn)} – {shortDate(cart.accommodation.checkOut)}</b>
                        <div className="muted" style={{ fontSize: ".82rem" }}>{nights} Nights</div>
                      </div>
                      <div>
                        <label className="fl">Guests &amp; Rooms</label>
                        <b>{cart.accommodation.guests.adults} Adults{cart.accommodation.guests.children ? `, ${cart.accommodation.guests.children} Children` : ""}</b>
                        <div className="muted" style={{ fontSize: ".82rem" }}>{roomCount} Room ({activeRoom.name})</div>
                      </div>
                    </div>
                  )}

                  <div className="hotel-foot" style={{ marginTop: 16, borderTop: "none", paddingTop: 0 }}>
                    <div className="row">
                      <button
                        type="button"
                        onClick={() => setEditingStay((v) => !v)}
                        style={{ fontSize: ".85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "var(--color-ink)", padding: 0 }}
                      >
                        {editingStay ? "Done editing" : "Edit booking"}
                      </button>
                      <Button to="/accommodations" variant="link" style={{ padding: 0, color: "#C0392B", fontSize: ".85rem" }}>
                        Change Accommodation
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeFromCart("accommodation")}
                        style={{ fontSize: ".85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#C0392B", padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <div className="muted" style={{ fontSize: ".85rem", textAlign: "right" }}>฿{roomPrice.toLocaleString()}/night</div>
                      <div className="price">฿{hotelSubtotal.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasCarInCart && (
              <div className="card cart-item" style={{ marginTop: hasAccommodationInCart ? 20 : 0 }}>
                <PhotoPlaceholder src={selectedCar.images?.[0] || selectedCar.image} alt={selectedCar.name} />
                <div className="cart-item-body">
                  <div className="between">
                    <div>
                      <span className="pill-img" style={{ position: "static", background: "var(--color-brand)", marginRight: 8 }}>
                        {selectedCar.category.toUpperCase()}
                      </span>
                      <h3 style={{ display: "inline-block", margin: 0 }}>{selectedCar.name}</h3>
                    </div>
                    <span className="stars">★★★★★</span>
                  </div>

                  <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                    📍 Pick-up Station: {cart.car.pickupLocation || selectedCar.current_station?.name}
                  </div>

                  {editingCar ? (
                    <div className="edit-panel">
                      <div className="grid-2" style={{ gap: 12 }}>
                        <div className="field">
                          <label className="fl">Pick-up Date</label>
                          <input
                            className="inp"
                            type="date"
                            value={cart.car.pickupDate}
                            onChange={(e) => updateCarDates({ pickupDate: e.target.value })}
                          />
                        </div>
                        <div className="field">
                          <label className="fl">Drop-off Date</label>
                          <input
                            className="inp"
                            type="date"
                            value={cart.car.dropoffDate}
                            min={addDays(cart.car.pickupDate, 1)}
                            onChange={(e) => updateCarDates({ dropoffDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="row"
                      style={{
                        background: "var(--color-bg)",
                        borderRadius: "var(--radius-sm)",
                        padding: "14px 16px",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div>
                        <label className="fl">Rental Period</label>
                        <b>{shortDate(cart.car.pickupDate)} – {shortDate(cart.car.dropoffDate)}</b>
                        <div className="muted" style={{ fontSize: ".82rem" }}>{carDays} Days ({cart.car.pickupTime} – {cart.car.dropoffTime})</div>
                      </div>
                      <div>
                        <label className="fl">Vehicle Specs</label>
                        <b>{selectedCar.specs?.seats || selectedCar.seats} Seats · {selectedCar.specs?.transmission || selectedCar.transmission}</b>
                        <div className="muted" style={{ fontSize: ".82rem" }}>Fuel: {selectedCar.specs?.fuel_type || selectedCar.fuel} · Luggage: {selectedCar.specs?.luggage || selectedCar.luggage}</div>
                      </div>
                    </div>
                  )}

                  <div className="hotel-foot" style={{ marginTop: 16, borderTop: "none", paddingTop: 0 }}>
                    <div className="row">
                      <button
                        type="button"
                        onClick={() => setEditingCar((v) => !v)}
                        style={{ fontSize: ".85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "var(--color-ink)", padding: 0 }}
                      >
                        {editingCar ? "Done editing" : "Edit booking"}
                      </button>
                      <Button to="/car-rental" variant="link" style={{ padding: 0, color: "#C0392B", fontSize: ".85rem" }}>
                        Change Car
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeFromCart("car")}
                        style={{ fontSize: ".85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#C0392B", padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <div className="muted" style={{ fontSize: ".85rem", textAlign: "right" }}>฿{carRate.toLocaleString()}/day</div>
                      <div className="price">฿{carSubtotal.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="perks">
              <div><div className="ico">🛡️</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Secure Booking</div></div>
              <div><div className="ico">✅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Verified Fleet &amp; Property</div></div>
              <div><div className="ico">🎧</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>24/7 Support</div></div>
              <div><div className="ico">📅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Flexible Cancel</div></div>
            </div>
          </div>

          {/* ---------- คอลัมน์ขวา: สรุปยอด ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              <OrderSummary
                lines={[
                  ...(hasAccommodationInCart
                    ? [
                        { label: `Accommodation (${nights} Nights)`, amount: hotelSubtotal },
                        { label: "Accommodation Service Fee", amount: hotelServiceFee },
                        { label: "Accommodation Taxes & Fees (5%)", amount: hotelTaxes },
                      ]
                    : []),
                  ...(hasCarInCart
                    ? [{ label: `Car Rental (${carDays} Days)`, amount: carSubtotal }]
                    : []),
                ]}
                total={grandTotal}
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

        {/* ---------- รายการแนะนำเพิ่มเติม ---------- */}
        <section className="also-like">
          <h2 className="center">You Might Also Like</h2>
          <div className="also-grid">
            {hasAccommodationInCart &&
              propertySuggestions.map((p) => <PropertyCard key={p.id} property={p} mode="mini" />)}
            {hasCarInCart && carSuggestions.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
