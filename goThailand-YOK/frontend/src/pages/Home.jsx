import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";

/**
 * ข้อมูลการ์ดบริการ 3 อัน (Accommodation / Car Rental / Tourist Guide)
 * ใช้ map() render แทนการเขียนการ์ดซ้ำ 3 รอบ — Accommodation กับ Car
 * Rental ลิงก์ไปหน้าจริงในโปรเจกต์แล้ว ส่วน Tourist Guide ยังไม่มีหน้า
 * จริง จึงลิงก์ไปยัง anchor เดียวกับที่ Header/Footer ใช้ไปก่อน
 */
const SERVICES = [
  {
    icon: "🛏️",
    title: "Accommodation",
    image: "/images/landing/accommodation.jpg",
    desc: "Discover luxury resorts and comfortable stays tailored to your ideal vacation.",
    price: "1 NIGHT / Start From ฿1,200",
    to: "/accommodations",
  },
  {
    icon: "🚗",
    title: "Car Rental",
    image: "/images/landing/car-rental.jpg",
    desc: "Drive in style and comfort with our premium, well-maintained rental vehicles.",
    price: "1 DAY / Start From ฿690",
    to: "/car-rental",
  },
  {
    icon: "🧭",
    title: "Tourist Guide",
    image: "/images/landing/tourist-guide.jpg",
    desc: "Explore hidden gems with experienced, friendly local guides across Thailand.",
    price: "1 DAY / Start From ฿1,500",
    to: "#guide",
  },
];

/** แถบความน่าเชื่อถือท้ายหน้า (Trust bar) 4 ช่อง */
const TRUST = [
  {
    icon: "🛡️",
    title: "Trusted & Reliable",
    desc: "Verified partners and quality services.",
  },
  { icon: "🎧", title: "Local Support", desc: "We're here to help you 24/7." },
  {
    icon: "🏷️",
    title: "Best Price",
    desc: "Competitive prices and no hidden fees.",
  },
  {
    icon: "🌏",
    title: "Explore Thailand",
    desc: "From beaches to mountains, we've got you covered.",
  },
];

/**
 * Home (หน้าแรกของเว็บไซต์ — Landing Page)
 * ------------------------------------------------------------
 * หน้าแนะนำเว็บไซต์ก่อนเข้าสู่ flow การจองจริง ประกอบด้วย hero
 * เต็มจอพร้อมช่องค้นหา (reuse SearchBar เดิม), การ์ดแนะนำ 3 บริการหลัก
 * และแถบความน่าเชื่อถือท้ายหน้า reuse Header/Footer/Button เดิมทั้งหมด
 * ไม่สร้าง component ใหม่ที่ไม่จำเป็น ปุ่ม "Book now" ของ Accommodation
 * พาไปหน้ารายการที่พักจริง (/accommodations)
 * ------------------------------------------------------------
 */
export default function Home() {
  return (
    <>
      <Header />

      <section
        className="hero-home"
        style={{ backgroundImage: "url(/images/landing/hero.jpg)" }}
      >
        <div className="hero-home-overlay" />
        <div className="wrap hero-home-content">
          <h1>Explore Thailand Your Way</h1>
          <p>
            Discover comfortable accommodations, reliable car rentals, and
            trusted local guides to make every journey across Thailand
            unforgettable.
          </p>
        </div>
      </section>

      <div className="wrap">
        <SearchBar />
      </div>

      <main className="wrap">
        <section className="services-intro">
          <span className="eyebrow">🌴 Everything You Need</span>
          <h2>Your Journey, Our Services</h2>
          <p className="muted">
            Handpicked experiences and reliable services to make your trip
            smooth, easy and memorable.
          </p>
        </section>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="card service-card" key={s.title}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <div className="service-photo">
                <img src={s.image} alt={s.title} loading="lazy" />
              </div>
              <p className="muted service-desc">{s.desc}</p>
              <div className="service-price">{s.price}</div>
              <Button to={s.to} variant="primary" full>
                Book now
              </Button>
            </div>
          ))}
        </div>

        <div className="card trust-bar">
          {TRUST.map((t) => (
            <div key={t.title}>
              <div className="row">
                <span className="ico">{t.icon}</span>
                <b>{t.title}</b>
              </div>
              <p className="muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
