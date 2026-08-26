import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CarSearchBar from "../components/CarSearchBar";
import CarFilterSidebar from "../components/CarFilterSidebar";
import CarCard from "../components/CarCard";
import { cars } from "../data/cars";

/**
 * CarRental (หน้าจองรถเช่า)
 * ------------------------------------------------------------
 * หน้ารายการรถให้เช่า โครงหน้าเลียนแบบ AccommodationListing (hero
 * แนะนำบริการ -> search bar ลอยทับขอบล่าง -> ตัวกรองซ้าย + กริดการ์ด
 * ขวา) reuse Header/Footer เดิมทุกหน้า และ reuse คลาส CSS `hero-home`
 * จากหน้า Home เพื่อให้ hero มีรูปพื้นหลัง + overlay สไตล์เดียวกัน
 * แทนที่จะสร้างสไตล์ hero ใหม่ซ้ำซ้อน
 * ตัวกรองมี 2 อย่าง เก็บ state ไว้ที่หน้านี้ (controlled component)
 * แล้วส่งลงไปให้ CarFilterSidebar แสดงผลอย่างเดียว:
 *  - selectedTypes: ประเภทรถที่ติ๊กไว้ (เลือกได้หลายค่า, AND/OR ดูด้านล่าง)
 *  - maxPrice: ราคาสูงสุดต่อวันที่ยอมรับได้
 * ปุ่ม "View Detail" บนการ์ดพาไปหน้า CarDetail (/car-rental/:id)
 * ------------------------------------------------------------
 */
export default function CarRental() {
  const [selectedTypes, setSelectedTypes] = useState([]); // ไม่ติ๊กอะไรไว้ก่อน = ไม่กรองประเภท
  const [maxPrice, setMaxPrice] = useState(5000);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      if (c.pricePerDay > maxPrice) return false;
      // ติ๊กประเภทไว้อันไหนก็ได้ (OR) ถ้าไม่ติ๊กเลยแปลว่าไม่กรอง
      if (selectedTypes.length > 0 && !selectedTypes.includes(c.type))
        return false;
      return true;
    });
  }, [selectedTypes, maxPrice]);

  return (
    <>
      <Header />

      {/* ---------- Hero: แนะนำบริการรถเช่า (reuse .hero-home จากหน้า Home) ---------- */}
      <section
        className="hero-home"
        style={{ backgroundImage: "url(/images/cars/hero.jpg)" }}
      >
        <div className="hero-home-overlay" />
        <div className="wrap hero-home-content">
          <h1>Explore Thailand Your Way</h1>
          <p>
            Premium car rentals for your exclusive journey. From sleek sedans to
            luxury SUVs, discover the freedom of the open road.
          </p>
        </div>
      </section>

      {/* ---------- Search bar ลอยทับขอบล่างของ hero ---------- */}
      <div className="wrap">
        <CarSearchBar />
      </div>

      {/* ---------- ตัวกรองซ้าย + รายการรถขวา ---------- */}
      <main className="wrap">
        <div className="listing">
          <aside>
            <CarFilterSidebar
              selectedTypes={selectedTypes}
              onToggleType={toggleType}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </aside>

          <section>
            <div
              className="between"
              style={{ marginBottom: 18, alignItems: "flex-end" }}
            >
              <div>
                <h2 style={{ marginBottom: 4 }}>Available Cars</h2>
                <p className="muted">
                  {filteredCars.length} vehicle
                  {filteredCars.length === 1 ? "" : "s"} matching your criteria
                </p>
              </div>
            </div>

            {filteredCars.length === 0 && (
              <div
                className="card"
                style={{ padding: 40, textAlign: "center" }}
              >
                <p className="muted">
                  No cars match your filters. Try widening your price range or
                  car type selection.
                </p>
              </div>
            )}

            <div className="car-grid">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
