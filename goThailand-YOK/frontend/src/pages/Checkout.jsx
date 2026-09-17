import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import { useBooking } from "../context/BookingContext";

const PAY_METHODS = ["Card", "Bank", "QR"];

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Checkout (หน้าที่ 4/5)
 * ------------------------------------------------------------
 * ฟอร์มกรอกข้อมูลลูกค้า และข้อมูลผู้ขับขี่ (ถ้ามีรถเช่าในตะกร้า)
 * รวมยอดของทุกรายการที่อยู่ในตะกร้า (ที่พัก + รถเช่า พร้อมกันได้)
 * เป็นออเดอร์เดียว สอดคล้องกับ Data Schema:
 *  - bookings: contact_name, contact_email, contact_phone, payment_method
 *  - booking_items (car): traveler_info, driver_info, payment_info
 *  - booking_items (accommodation): guest_details, guest_names
 * ------------------------------------------------------------
 */
export default function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    hasAccommodationInCart,
    hasCarInCart,
    confirmBooking,
  } = useBooking();

  if (!hasAccommodationInCart && !hasCarInCart) {
    return <Navigate to="/cart" replace />;
  }

  const [payMethod, setPayMethod] = useState("Card");
  const [form, setForm] = useState({
    fullName: "Siwat J.",
    email: "sj.siwat@gmail.com",
    phone: "0812345678",
    country: "Thailand",
    requests: hasAccommodationInCart ? "ขอห้องชั้นสูง ไม่สูบบุหรี่" : "",
    // Car driver info
    driverName: "Siwat J.",
    driverLicenseNo: "DL-12345678",
    driverAge: "35",
    // Card info
    cardName: "SIWAT J.",
    cardNo: "**** **** **** 0000",
    cardExpiry: "12/28",
    cardCvv: "123",
  });

  // Accommodation calculations
  const activeRoom =
    selectedRoom || selectedProperty?.rooms?.[0] || {
      name: "Standard Suite",
      price_per_night: selectedProperty.base_price_per_night,
    };
  const roomPrice = activeRoom.price_per_night || selectedProperty.base_price_per_night;
  const roomCount = cart.accommodation.rooms || 1;
  const hotelSubtotal = hasAccommodationInCart ? roomPrice * nights * roomCount : 0;
  const hotelServiceFee = hasAccommodationInCart ? 500 : 0;
  const hotelTaxes = hasAccommodationInCart ? Math.round(hotelSubtotal * 0.05) : 0;
  const hotelTotal = hotelSubtotal + hotelServiceFee + hotelTaxes;

  // Car calculations
  const carRate = selectedCar.daily_rate || selectedCar.pricePerDay;
  const carSubtotal = hasCarInCart ? carRate * carDays : 0;
  const carTotal = carSubtotal;

  const grandSubtotal = hotelSubtotal + carSubtotal;
  const grandTotal = hotelTotal + carTotal;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const { ref } = await confirmBooking({
        ...form,
        payMethod,
        total: grandTotal,
        subtotal: grandSubtotal,
      });
      navigate(`/success?ref=${encodeURIComponent(ref)}`);
    } catch (err) {
      setSubmitError(err.message || "จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="wrap">
        <Stepper current={3} />

        <div className="checkout-layout">
          {/* ---------- คอลัมน์ซ้าย: ฟอร์ม ---------- */}
          <form onSubmit={handleSubmit}>
            <div className="card form-card">
              <h2 style={{ marginBottom: 20 }}>Contact Information</h2>
              <div className="grid-2">
                <div className="field">
                  <label className="fl" htmlFor="fullName">Full Name</label>
                  <input
                    className="inp" id="fullName" placeholder="Siwat J." required
                    value={form.fullName} onChange={handleChange("fullName")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="email">Email Address</label>
                  <input
                    className="inp" id="email" type="email" placeholder="sj.siwat@gmail.com" required
                    value={form.email} onChange={handleChange("email")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="phone">Phone Number</label>
                  <input
                    className="inp" id="phone" placeholder="0812345678" required
                    value={form.phone} onChange={handleChange("phone")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="country">Country / Region</label>
                  <select className="inp" id="country" value={form.country} onChange={handleChange("country")}>
                    <option>Thailand</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Singapore</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>

              {/* ---------- ฟิลด์ข้อมูลคนขับรถ (Driver Info) ถ้ามีรถเช่าในตะกร้า ---------- */}
              {hasCarInCart && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--color-line)" }}>
                  <h3 style={{ marginBottom: 16 }}>Driver Information</h3>
                  <div className="grid-2">
                    <div className="field">
                      <label className="fl" htmlFor="driverName">Driver's Full Name</label>
                      <input
                        className="inp" id="driverName" placeholder="Siwat J." required
                        value={form.driverName} onChange={handleChange("driverName")}
                      />
                    </div>
                    <div className="field">
                      <label className="fl" htmlFor="driverLicenseNo">Driver's License No.</label>
                      <input
                        className="inp" id="driverLicenseNo" placeholder="DL-12345678" required
                        value={form.driverLicenseNo} onChange={handleChange("driverLicenseNo")}
                      />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="fl" htmlFor="driverAge">Driver's Age</label>
                      <input
                        className="inp" id="driverAge" type="number" min="20" max="80" required
                        value={form.driverAge} onChange={handleChange("driverAge")}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="field" style={{ marginTop: 20, marginBottom: 0 }}>
                <label className="fl" htmlFor="requests">Special Requests (optional)</label>
                <textarea
                  className="inp" id="requests" rows={3}
                  placeholder={hasAccommodationInCart ? "e.g., Early check-in, high floor, non-smoking..." : "e.g., GPS navigation, child safety seat..."}
                  value={form.requests} onChange={handleChange("requests")}
                />
              </div>
            </div>

            {/* ---------- Payment Method ---------- */}
            <div className="card form-card" style={{ marginBottom: 0 }}>
              <div className="between" style={{ marginBottom: 4 }}>
                <h2>Payment Method</h2>
                <span className="secure-note">🔒 Secure 256-bit Encryption</span>
              </div>
              <div className="pay-tabs">
                {PAY_METHODS.map((m) => (
                  <div
                    key={m}
                    className={`pay-tab ${payMethod === m ? "selected" : ""}`}
                    onClick={() => setPayMethod(m)}
                  >
                    {m === "Card" ? "💳 Credit / Debit Card" : m === "Bank" ? "🏦 Bank Transfer" : "📱 QR PromptPay"}
                  </div>
                ))}
              </div>

              {payMethod === "Card" && (
                <>
                  <div className="field">
                    <label className="fl" htmlFor="cardNo">Card Number</label>
                    <input
                      className="inp" id="cardNo" placeholder="0000 0000 0000 0000"
                      value={form.cardNo} onChange={handleChange("cardNo")}
                    />
                  </div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="fl" htmlFor="cardExpiry">Expiry Date</label>
                      <input
                        className="inp" id="cardExpiry" placeholder="MM/YY"
                        value={form.cardExpiry} onChange={handleChange("cardExpiry")}
                      />
                    </div>
                    <div className="field">
                      <label className="fl" htmlFor="cardCvv">CVV</label>
                      <input
                        className="inp" id="cardCvv" placeholder="123"
                        value={form.cardCvv} onChange={handleChange("cardCvv")}
                      />
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="fl" htmlFor="cardName">Cardholder Name</label>
                    <input
                      className="inp" id="cardName" placeholder="SIWAT J."
                      value={form.cardName} onChange={handleChange("cardName")}
                    />
                  </div>
                </>
              )}
              {payMethod === "Bank" && (
                <p className="muted">You will be redirected to your bank's secure page after confirming.</p>
              )}
              {payMethod === "QR" && (
                <p className="muted">A PromptPay QR code will be generated instantly after confirming.</p>
              )}
            </div>

            {submitError && (
              <p
                className="muted"
                style={{ color: "#C0392B", marginTop: 16, marginBottom: 0 }}
                role="alert"
              >
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              full
              size="lg"
              disabled={submitting}
              style={{ marginTop: 24 }}
              id="confirmBookingBtn"
            >
              {submitting ? "Processing…" : `Confirm & Pay ฿${grandTotal.toLocaleString()}`}
            </Button>
          </form>

          {/* ---------- คอลัมน์ขวา: สรุปการจอง ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              {hasAccommodationInCart && (
                <div style={{ marginBottom: hasCarInCart ? 20 : 0 }}>
                  <div className="summary-thumb">
                    <PhotoPlaceholder src={selectedProperty.pictures[0]} alt={selectedProperty.name} />
                  </div>
                  <div className="row" style={{ gap: 8, marginTop: 12, marginBottom: 4 }}>
                    <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                      {selectedProperty.category}
                    </span>
                  </div>
                  <h3 style={{ marginTop: 6 }}>{selectedProperty.name}</h3>
                  <div className="muted" style={{ fontSize: ".88rem" }}>{activeRoom.name}</div>

                  <div style={{ marginTop: 16 }}>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Check-in</span>
                      <b>{shortDate(cart.accommodation.checkIn)}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Check-out</span>
                      <b>{shortDate(cart.accommodation.checkOut)}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">👤 Guests</span>
                      <b>{cart.accommodation.guests.adults} Adults · {roomCount} Room</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">🌙 Duration</span>
                      <b>{nights} Nights</b>
                    </div>
                  </div>
                </div>
              )}

              {hasAccommodationInCart && hasCarInCart && <div className="divider" />}

              {hasCarInCart && (
                <div style={{ marginBottom: 16 }}>
                  {!hasAccommodationInCart && (
                    <div className="summary-thumb">
                      <PhotoPlaceholder src={selectedCar.images?.[0] || selectedCar.image} alt={selectedCar.name} />
                    </div>
                  )}
                  <div className="row" style={{ gap: 8, marginTop: 12, marginBottom: 4 }}>
                    <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                      {selectedCar.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{ marginTop: 6 }}>{selectedCar.name}</h3>

                  <div style={{ marginTop: 16 }}>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Pick-up</span>
                      <b>{shortDate(cart.car.pickupDate)} ({cart.car.pickupTime})</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Drop-off</span>
                      <b>{shortDate(cart.car.dropoffDate)} ({cart.car.dropoffTime})</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📍 Station</span>
                      <b>{cart.car.pickupLocation || selectedCar.current_station?.name}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">⏱️ Duration</span>
                      <b>{carDays} Days</b>
                    </div>
                  </div>
                </div>
              )}

              <div className="divider" />

              {hasAccommodationInCart && (
                <>
                  <div className="sum-row">
                    <span>Accommodation ({nights} n)</span>
                    <b>฿{hotelSubtotal.toLocaleString()}</b>
                  </div>
                  <div className="sum-row">
                    <span>Accommodation Service Fee</span>
                    <b>฿{hotelServiceFee.toLocaleString()}</b>
                  </div>
                  <div className="sum-row">
                    <span>Accommodation Taxes &amp; Fees (5%)</span>
                    <b>฿{hotelTaxes.toLocaleString()}</b>
                  </div>
                </>
              )}
              {hasCarInCart && (
                <div className="sum-row">
                  <span>Car Rental (฿{carRate.toLocaleString()} × {carDays} d)</span>
                  <b>฿{carSubtotal.toLocaleString()}</b>
                </div>
              )}

              <div className="sum-total">
                <h3>Total</h3>
                <div className="price">฿{grandTotal.toLocaleString()}</div>
              </div>

              <div className="perk-row">
                <div><span className="ico">📅</span>Free Cancel</div>
                <div><span className="ico">🎧</span>24/7 Support</div>
                <div><span className="ico">🛡️</span>Verified</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
