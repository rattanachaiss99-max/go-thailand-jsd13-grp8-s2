import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
 * ฟอร์มกรอกข้อมูลลูกค้า และข้อมูลผู้ขับขี่ (กรณีเช่ารถ)
 * สอดคล้องกับ Data Schema:
 *  - bookings: contact_name, contact_email, contact_phone, payment_method
 *  - booking_items (car): traveler_info, driver_info, payment_info
 *  - booking_items (accommodation): guest_details, guest_names
 * ------------------------------------------------------------
 */
export default function Checkout() {
  const navigate = useNavigate();
  const {
    booking,
    selectedProperty,
    selectedRoom,
    selectedCar,
    nights,
    carDays,
    confirmBooking,
  } = useBooking();

  const isCar = booking.cartType === "car";

  const [payMethod, setPayMethod] = useState("Card");
  const [form, setForm] = useState({
    fullName: "Siwat J.",
    email: "sj.siwat@gmail.com",
    phone: "0812345678",
    country: "Thailand",
    requests: isCar ? "" : "ขอห้องชั้นสูง ไม่สูบบุหรี่",
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
      price_per_night: selectedProperty.base_price_per_night || selectedProperty.pricePerNight,
    };
  const roomPrice = activeRoom.price_per_night || selectedProperty.base_price_per_night;
  const roomCount = booking.rooms || 1;
  const hotelSubtotal = roomPrice * nights * roomCount;
  const hotelServiceFee = 500;
  const hotelTaxes = Math.round(hotelSubtotal * 0.05);
  const hotelTotal = hotelSubtotal + hotelServiceFee + hotelTaxes;

  // Car calculations
  const carRate = selectedCar.daily_rate || selectedCar.pricePerDay;
  const carSubtotal = carRate * carDays;
  const carTotal = carSubtotal;

  const currentSubtotal = isCar ? carSubtotal : hotelSubtotal;
  const currentTotal = isCar ? carTotal : hotelTotal;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    confirmBooking({
      ...form,
      payMethod,
      total: currentTotal,
      subtotal: currentSubtotal,
    });

    navigate("/success");
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

              {/* ---------- ฟิลด์ข้อมูลคนขับรถ (Driver Info) สำหรับ Car Rental ---------- */}
              {isCar && (
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
                  placeholder={isCar ? "e.g., GPS navigation, child safety seat..." : "e.g., Early check-in, high floor, non-smoking..."}
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

            <Button type="submit" variant="gold" full size="lg" style={{ marginTop: 24 }} id="confirmBookingBtn">
              Confirm &amp; Pay ฿{currentTotal.toLocaleString()}
            </Button>
          </form>

          {/* ---------- คอลัมน์ขวา: สรุปการจอง ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              <div className="summary-thumb">
                <PhotoPlaceholder
                  src={isCar ? selectedCar.images?.[0] || selectedCar.image : selectedProperty.images[0]}
                  alt={isCar ? selectedCar.name : selectedProperty.name}
                />
              </div>

              <div className="row" style={{ gap: 8, marginTop: 12, marginBottom: 4 }}>
                <span className="tag" style={{ background: "var(--color-brand)", color: "#fff" }}>
                  {isCar ? selectedCar.category.toUpperCase() : selectedProperty.category}
                </span>
              </div>

              <h3 style={{ marginTop: 6 }}>{isCar ? selectedCar.name : selectedProperty.name}</h3>
              {!isCar && <div className="muted" style={{ fontSize: ".88rem" }}>{activeRoom.name}</div>}

              <div style={{ marginTop: 16 }}>
                {isCar ? (
                  <>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Pick-up</span>
                      <b>{shortDate(booking.pickupDate)} ({booking.pickupTime})</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Drop-off</span>
                      <b>{shortDate(booking.dropoffDate)} ({booking.dropoffTime})</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📍 Station</span>
                      <b>{booking.pickupLocation || selectedCar.current_station?.name}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">⏱️ Duration</span>
                      <b>{carDays} Days</b>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Check-in</span>
                      <b>{shortDate(booking.checkIn)}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">📅 Check-out</span>
                      <b>{shortDate(booking.checkOut)}</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">👤 Guests</span>
                      <b>{booking.guests.adults} Adults · {roomCount} Room</b>
                    </div>
                    <div className="sum-line">
                      <span className="lbl-ico">🌙 Duration</span>
                      <b>{nights} Nights</b>
                    </div>
                  </>
                )}
              </div>

              <div className="divider" />
              {isCar ? (
                <>
                  <div className="sum-row">
                    <span>Daily Rate (฿{carRate.toLocaleString()} × {carDays} d)</span>
                    <b>฿{carSubtotal.toLocaleString()}</b>
                  </div>
                  <div className="sum-row">
                    <span>Service Fee</span>
                    <b>฿0</b>
                  </div>
                  <div className="sum-row">
                    <span>Taxes &amp; Fees</span>
                    <b style={{ color: "#2E7D32" }}>Included</b>
                  </div>
                </>
              ) : (
                <>
                  <div className="sum-row">
                    <span>Accommodation ({nights} n)</span>
                    <b>฿{hotelSubtotal.toLocaleString()}</b>
                  </div>
                  <div className="sum-row">
                    <span>Service Fee</span>
                    <b>฿{hotelServiceFee.toLocaleString()}</b>
                  </div>
                  <div className="sum-row">
                    <span>Taxes &amp; Fees (5%)</span>
                    <b>฿{hotelTaxes.toLocaleString()}</b>
                  </div>
                </>
              )}

              <div className="sum-total">
                <h3>Total</h3>
                <div className="price">฿{currentTotal.toLocaleString()}</div>
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
