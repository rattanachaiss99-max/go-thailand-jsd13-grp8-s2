import { useState } from "react";
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
import { getOtherProperties } from "../data/properties";
import { cars } from "../data/cars";

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
 * ตะกร้าจอง: รองรับทั้ง Accommodation และ Car Rental
 * เชื่อมโยงข้อมูล Snapshot และ Pricing Breakdown ตาม Data Schema
 * ------------------------------------------------------------
 */
export default function BookingCart() {
  const {
    booking,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    updateCarDates,
  } = useBooking();

  const [editing, setEditing] = useState(false);

  const isCar = booking.cartType === "car";

  // คำนวณราคาสำหรับ Accommodation
  const activeRoom =
    selectedRoom || selectedProperty?.rooms?.[0] || {
      name: "Standard Suite",
      price_per_night: selectedProperty.base_price_per_night || selectedProperty.pricePerNight,
    };
  const roomPrice = activeRoom.price_per_night || selectedProperty.base_price_per_night;
  const roomCount = booking.rooms || 1;
  const hotelSubtotal = roomPrice * nights * roomCount;
  const hotelServiceFee = 500;
  const hotelTaxes = Math.round(hotelSubtotal * 0.05);
  const hotelTotal = hotelSubtotal + hotelServiceFee + hotelTaxes;

  // คำนวณราคาสำหรับ Car
  const carRate = selectedCar.daily_rate || selectedCar.pricePerDay;
  const carSubtotal = carRate * carDays;
  const carTotal = carSubtotal;

  const currentSubtotal = isCar ? carSubtotal : hotelSubtotal;
  const currentTotal = isCar ? carTotal : hotelTotal;

  const propertySuggestions = getOtherProperties(selectedProperty.id, 3);
  const carSuggestions = cars.filter((c) => c.id !== selectedCar.id).slice(0, 3);

  return (
    <>
      <Header />

      <div className="wrap">
        <Stepper current={2} />

        <h1>Your Booking Cart</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          Review your {isCar ? "car rental" : "accommodation"} details before completing your reservation.
        </p>

        <div className="cart-layout">
          {/* ---------- คอลัมน์ซ้าย: รายการที่จอง ---------- */}
          <div>
            <div className="card cart-item">
              <PhotoPlaceholder
                src={isCar ? selectedCar.images?.[0] || selectedCar.image : selectedProperty.images[0]}
                alt={isCar ? selectedCar.name : selectedProperty.name}
              />
              <div className="cart-item-body">
                <div className="between">
                  <div>
                    <span className="pill-img" style={{ position: "static", background: "var(--color-brand)", marginRight: 8 }}>
                      {isCar ? selectedCar.category.toUpperCase() : selectedProperty.category}
                    </span>
                    <h3 style={{ display: "inline-block", margin: 0 }}>
                      {isCar ? selectedCar.name : selectedProperty.name}
                    </h3>
                  </div>
                  <span className="stars">★★★★★</span>
                </div>

                <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                  {isCar ? (
                    <>📍 Pick-up Station: {booking.pickupLocation || selectedCar.current_station?.name}</>
                  ) : (
                    <>📍 {selectedProperty.location?.address_label || String(selectedProperty.location)} · <b>{activeRoom.name}</b></>
                  )}
                </div>

                {editing ? (
                  <div className="edit-panel">
                    {isCar ? (
                      <div className="grid-2" style={{ gap: 12 }}>
                        <div className="field">
                          <label className="fl">Pick-up Date</label>
                          <input
                            className="inp"
                            type="date"
                            value={booking.pickupDate}
                            onChange={(e) => updateCarDates({ pickupDate: e.target.value })}
                          />
                        </div>
                        <div className="field">
                          <label className="fl">Drop-off Date</label>
                          <input
                            className="inp"
                            type="date"
                            value={booking.dropoffDate}
                            min={addDays(booking.pickupDate, 1)}
                            onChange={(e) => updateCarDates({ dropoffDate: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <DateRangeFields />
                        <GuestRoomSelector />
                      </>
                    )}
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
                    {isCar ? (
                      <>
                        <div>
                          <label className="fl">Rental Period</label>
                          <b>{shortDate(booking.pickupDate)} – {shortDate(booking.dropoffDate)}</b>
                          <div className="muted" style={{ fontSize: ".82rem" }}>{carDays} Days ({booking.pickupTime} – {booking.dropoffTime})</div>
                        </div>
                        <div>
                          <label className="fl">Vehicle Specs</label>
                          <b>{selectedCar.specs?.seats || selectedCar.seats} Seats · {selectedCar.specs?.transmission || selectedCar.transmission}</b>
                          <div className="muted" style={{ fontSize: ".82rem" }}>Fuel: {selectedCar.specs?.fuel_type || selectedCar.fuel} · Luggage: {selectedCar.specs?.luggage || selectedCar.luggage}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="fl">Dates</label>
                          <b>{shortDate(booking.checkIn)} – {shortDate(booking.checkOut)}</b>
                          <div className="muted" style={{ fontSize: ".82rem" }}>{nights} Nights</div>
                        </div>
                        <div>
                          <label className="fl">Guests &amp; Rooms</label>
                          <b>{booking.guests.adults} Adults{booking.guests.children ? `, ${booking.guests.children} Children` : ""}</b>
                          <div className="muted" style={{ fontSize: ".82rem" }}>{roomCount} Room ({activeRoom.name})</div>
                        </div>
                      </>
                    )}
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
                    <Button
                      to={isCar ? "/car-rental" : "/accommodations"}
                      variant="link"
                      style={{ padding: 0, color: "#C0392B", fontSize: ".85rem" }}
                    >
                      Change {isCar ? "Car" : "Accommodation"}
                    </Button>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: ".85rem", textAlign: "right" }}>
                      ฿{(isCar ? carRate : roomPrice).toLocaleString()}/{isCar ? "day" : "night"}
                    </div>
                    <div className="price">฿{currentSubtotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="perks">
              <div><div className="ico">🛡️</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Secure Booking</div></div>
              <div><div className="ico">✅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Verified {isCar ? "Fleet" : "Property"}</div></div>
              <div><div className="ico">🎧</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>24/7 Support</div></div>
              <div><div className="ico">📅</div><div style={{ fontWeight: 600, fontSize: ".9rem" }}>Flexible Cancel</div></div>
            </div>
          </div>

          {/* ---------- คอลัมน์ขวา: สรุปยอด ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              <OrderSummary
                lines={
                  isCar
                    ? [
                        { label: `Car Rental (${carDays} Days)`, amount: carSubtotal },
                        { label: "Service Fee", amount: 0 },
                        { label: "Taxes & Fees", amount: 0 },
                      ]
                    : [
                        { label: `Accommodation (${nights} Nights)`, amount: hotelSubtotal },
                        { label: "Service Fee", amount: hotelServiceFee },
                        { label: "Taxes & Fees (5%)", amount: hotelTaxes },
                      ]
                }
                total={currentTotal}
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
