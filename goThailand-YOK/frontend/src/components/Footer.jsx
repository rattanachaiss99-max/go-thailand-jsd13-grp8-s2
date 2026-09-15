import { Link } from "react-router-dom";

/**
 * Footer
 * ------------------------------------------------------------
 * ท้ายเว็บไซต์ ใช้เหมือนกันทุกหน้า มีลิงก์ช่วยให้เพจต่าง ๆ
 * เชื่อมถึงกันเพิ่มเติมนอกเหนือจาก flow การจองหลัก
 * ------------------------------------------------------------
 */
export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo">
              Go<span>Thailand</span>
            </div>
            <p style={{ marginTop: 14, maxWidth: 300, fontSize: ".93rem" }}>
              Curating Thailand's most exclusive and luxurious travel
              experiences for the discerning global traveller.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/accommodations">Luxury Stays</Link>
              </li>
              <li>
                <Link to="/car-rental">Chauffeur Services</Link>
              </li>
              <li>
                <a href="#guide">Private Tours</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/">Our Story</Link>
              </li>
              <li>
                <Link to="/cart">Careers</Link>
              </li>
              <li>
                <Link to="/checkout">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="mailto:concierge@gothailand.com">
                  concierge@gothailand.com
                </a>
              </li>
              <li>
                <a href="tel:+6621234567">+66 2 123 4567</a>
              </li>
              <li>
                <Link to="/success">Live Chat</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="foot-bar">
        <div className="wrap">© 2026 GoThailand Luxury Travel. All rights reserved.</div>
      </div>
    </footer>
  );
}
