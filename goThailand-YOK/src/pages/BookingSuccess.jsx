import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import Button from "../components/Button";
import PropertyCard from "../components/PropertyCard";
import { useBooking } from "../context/BookingContext";
import { getOtherProperties } from "../data/properties";

/**
 * BookingSuccess (หน้าที่ 5/5)
 * ------------------------------------------------------------
 * หน้าสุดท้ายของ flow: ยืนยันว่าจองสำเร็จ แสดงเลขที่การจอง
 * (bookingRef ที่สร้างใน BookingContext ตอนกด Confirm Booking)
 * พร้อมสรุปการชำระเงินและที่พักแนะนำเพิ่มเติม
 * ถ้าผู้ใช้เข้าหน้านี้ตรง ๆ โดยยังไม่เคยยืนยันการจอง (ไม่มี bookingRef)
 * จะเด้งกลับไปหน้ารายการที่พักแทน เพื่อไม่ให้เห็นหน้าสำเร็จลอย ๆ
 * ------------------------------------------------------------
 */
export default function BookingSuccess() {
  const { selectedProperty, booking, nights, bookingRef, customer } = useBooking();

  if (!bookingRef) {
    return <Navigate to="/" replace />;
  }

  const subtotal = selectedProperty.pricePerNight * nights;
  const serviceFee = 500;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + taxes;
  const suggestions = getOtherProperties(selectedProperty.id, 3);

  return (
    <>
      <Header />

      <div className="wrap success-wrap">
        <Stepper current={4} />

        <div className="success-icon">✓</div>
        <h1>Booking Confirmed</h1>
        <p className="muted" style={{ maxWidth: 480, margin: "10px auto 0" }}>
          Thank you for choosing GoThailand{customer?.fullName ? `, ${customer.fullName}` : ""}.
          Your reservation has been successfully completed. A confirmation email
          has been sent to {customer?.email || "your registered address"}.
        </p>

        <div className="success-layout">
          {/* ---------- การ์ดยืนยันการจอง ---------- */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="booking-id-row">
              <div>
                <label className="fl">Booking ID</label>
                <b>{bookingRef}</b>
              </div>
              <span className="status-pill">Confirmed</span>
            </div>
            <div className="confirm-item">
              <PhotoPlaceholder src={selectedProperty.images[0]} alt={selectedProperty.name} />
              <div>
                <span className="stars">★★★★★</span>
                <h3 style={{ marginTop: 4 }}>{selectedProperty.name}</h3>
                <div className="muted" style={{ margin: "6px 0 14px", fontSize: ".9rem" }}>
                  📍 {selectedProperty.location}
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <label className="fl">Check-in</label>
                    <b>{shortDate(booking.checkIn)}</b>
                  </div>
                  <div>
                    <label className="fl">Check-out</label>
                    <b>{shortDate(booking.checkOut)}</b>
                  </div>
                </div>
                <div className="muted" style={{ marginTop: 10, fontSize: ".85rem" }}>
                  {booking.guests.adults} Adults · {booking.rooms} Room · {nights} Nights
                </div>
              </div>
            </div>
          </div>

          {/* ---------- สรุปการชำระเงิน ---------- */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 14 }}>Payment Summary</h3>
            <div className="sum-row"><span>Accommodation ({nights} Nights)</span><b>฿{subtotal.toLocaleString()}</b></div>
            <div className="sum-row"><span>Service Fee</span><b>฿{serviceFee.toLocaleString()}</b></div>
            <div className="sum-row"><span>Taxes &amp; Fees</span><b>฿{taxes.toLocaleString()}</b></div>
            <div className="sum-total"><span>Total Paid</span><div className="price">฿{total.toLocaleString()}</div></div>
            <div className="pay-status">✓ Payment Status: Confirmed</div>

            <div className="row" style={{ marginTop: 20 }}>
              <Button to="/cart" variant="primary" full>View My Booking</Button>
              <Button to="/" variant="ghost" full>Back to Home</Button>
            </div>
          </div>
        </div>

        <section style={{ marginTop: 60, textAlign: "left" }}>
          <div className="between">
            <h2>You may also like</h2>
          </div>
          <div className="also-grid" style={{ marginTop: 20 }}>
            {suggestions.map((p) => (
              <PropertyCard key={p.id} property={p} mode="mini" />
            ))}
          </div>
        </section>

        <div className="help-box">
          <h3>Need Help with Your Booking?</h3>
          <p className="muted" style={{ marginTop: 8 }}>
            Our luxury concierge team is available 24/7 to assist you with any
            special requests or modifications to your itinerary.
          </p>
          <div className="help-contacts">
            <span>📞 +66 2 123 4567</span>
            <span>✉️ concierge@gothailand.com</span>
            <span>💬 Live Chat</span>
          </div>
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
