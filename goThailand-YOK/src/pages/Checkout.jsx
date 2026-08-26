import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import { useBooking } from "../context/BookingContext";

const PAY_METHODS = ["Card", "Bank", "QR"];

/**
 * Checkout (หน้าที่ 4/5)
 * ------------------------------------------------------------
 * ฟอร์มกรอกข้อมูลลูกค้า + เลือกวิธีชำระเงิน ฝั่งขวาสรุปการจอง
 * (ที่พัก, วันเข้าพัก/ออก, ยอดรวม) เหมือนหน้า Cart แต่ย่อลง
 * เมื่อกด "Confirm Booking" จะตรวจฟอร์ม (HTML5 validation ผ่าน
 * required) แล้วเรียก confirmBooking() เพื่อสร้างเลขที่การจอง
 * ก่อนพาไปหน้า Success
 * ------------------------------------------------------------
 */
export default function Checkout() {
  const navigate = useNavigate();
  const { selectedProperty, booking, nights, confirmBooking } = useBooking();
  const [payMethod, setPayMethod] = useState("Card");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Thailand",
    requests: "",
  });

  const subtotal = selectedProperty.pricePerNight * nights;
  const serviceFee = 500;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + taxes;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return; // กันฟอร์มว่างแบบง่าย ๆ (input required ช่วยด้วยแล้ว)
    confirmBooking({ ...form, payMethod, total });
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
              <h2 style={{ marginBottom: 20 }}>Customer Information</h2>
              <div className="grid-2">
                <div className="field">
                  <label className="fl" htmlFor="fullName">Full Name</label>
                  <input
                    className="inp" id="fullName" placeholder="John Doe" required
                    value={form.fullName} onChange={handleChange("fullName")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="email">Email Address</label>
                  <input
                    className="inp" id="email" type="email" placeholder="john@example.com" required
                    value={form.email} onChange={handleChange("email")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="phone">Phone Number</label>
                  <input
                    className="inp" id="phone" placeholder="+66 81 234 5678"
                    value={form.phone} onChange={handleChange("phone")}
                  />
                </div>
                <div className="field">
                  <label className="fl" htmlFor="country">Country</label>
                  <select className="inp" id="country" value={form.country} onChange={handleChange("country")}>
                    <option>Thailand</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Singapore</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="fl" htmlFor="requests">Special Requests (optional)</label>
                <textarea
                  className="inp" id="requests" rows={3}
                  placeholder="e.g., Early check-in, dietary requirements..."
                  value={form.requests} onChange={handleChange("requests")}
                />
              </div>
            </div>

            <div className="card form-card" style={{ marginBottom: 0 }}>
              <div className="between" style={{ marginBottom: 4 }}>
                <h2>Payment Method</h2>
                <span className="secure-note">🔒 Secure Payment</span>
              </div>
              <div className="pay-tabs">
                {PAY_METHODS.map((m) => (
                  <div
                    key={m}
                    className={`pay-tab ${payMethod === m ? "selected" : ""}`}
                    onClick={() => setPayMethod(m)}
                  >
                    {m}
                  </div>
                ))}
              </div>

              {payMethod === "Card" && (
                <>
                  <div className="field">
                    <label className="fl" htmlFor="cardNo">Card Number</label>
                    <input className="inp" id="cardNo" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="fl" htmlFor="expiry">Expiry Date</label>
                      <input className="inp" id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="field">
                      <label className="fl" htmlFor="cvv">CVV</label>
                      <input className="inp" id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="fl" htmlFor="cardName">Card Holder Name</label>
                    <input className="inp" id="cardName" placeholder="JOHN DOE" />
                  </div>
                </>
              )}
              {payMethod === "Bank" && (
                <p className="muted">You will be redirected to your bank's secure page after confirming.</p>
              )}
              {payMethod === "QR" && (
                <p className="muted">A QR PromptPay code will be generated after confirming.</p>
              )}
            </div>

            <Button type="submit" variant="gold" full size="lg" style={{ marginTop: 24 }}>
              Confirm Booking
            </Button>
          </form>

          {/* ---------- คอลัมน์ขวา: สรุปการจอง ---------- */}
          <aside>
            <div className="card sticky" style={{ padding: 26 }}>
              <div className="summary-thumb">
                <PhotoPlaceholder src={selectedProperty.images[0]} alt={selectedProperty.name} />
              </div>
              <h3>{selectedProperty.name}</h3>

              <div style={{ marginTop: 12 }}>
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
                  <b>{booking.guests.adults} Adults</b>
                </div>
                <div className="sum-line">
                  <span className="lbl-ico">🌙 Duration</span>
                  <b>{nights} Nights</b>
                </div>
              </div>

              <div className="divider" />
              <div className="sum-row"><span>Accommodation</span><b>฿{subtotal.toLocaleString()}</b></div>
              <div className="sum-row"><span>Service Fee</span><b>฿{serviceFee.toLocaleString()}</b></div>
              <div className="sum-row"><span>Taxes</span><b>฿{taxes.toLocaleString()}</b></div>
              <div className="sum-total"><h3>Total</h3><div className="price">฿{total.toLocaleString()}</div></div>

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

function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
