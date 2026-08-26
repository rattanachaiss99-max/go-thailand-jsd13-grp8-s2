import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

/**
 * Header
 * ------------------------------------------------------------
 * แถบเมนูบนสุด ใช้เหมือนกันทุกหน้า (sticky อยู่บนสุดตอนเลื่อนหน้าจอ)
 * ไฮไลต์เมนูที่ตรงกับหน้าปัจจุบันจริง (Home เมื่ออยู่ "/", Accommodation
 * เมื่ออยู่ในสาย flow การจองที่พักทั้งหมด) ปุ่มขวาบนจะเปลี่ยนไปตาม
 * path ปัจจุบัน:
 *  - หน้า Cart/Checkout/Success: โชว์ Back to search + Book Now (ต่อ flow เดิม)
 *  - หน้าอื่น ๆ (Home/Listing/Detail): โชว์ Login + Register
 * ------------------------------------------------------------
 */
const ACCOMMODATION_PATHS_PREFIX = ["/accommodations", "/detail", "/cart", "/checkout", "/success"];

export default function Header() {
  const { pathname } = useLocation();
  const inBookingFlow = ["/cart", "/checkout", "/success"].includes(pathname);
  const isAccommodationSection = ACCOMMODATION_PATHS_PREFIX.some((p) => pathname.startsWith(p));
  const isHome = pathname === "/";

  return (
    <header className="site-head">
      <div className="wrap head-in">
        <Link to="/" className="logo">
          Go<span>Thailand</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={isHome ? "active" : ""}>
            Home
          </Link>
          <Link to="/accommodations" className={isAccommodationSection ? "active" : ""}>
            Accommodation
          </Link>
          <Link to="/car-rental" className={pathname === "/car-rental" ? "active" : ""}>
            Car Rental
          </Link>
          <a href="#guide">Local Guide</a>
        </nav>
        <div className="head-cta">
          {inBookingFlow ? (
            <>
              <Button to="/accommodations" variant="link">
                ← Back to search
              </Button>
              <Button to="/checkout" variant="primary">
                Book Now
              </Button>
            </>
          ) : (
            <>
              <Button to="/checkout" variant="link">
                Login
              </Button>
              <Button to="/checkout" variant="primary">
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
