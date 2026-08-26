import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import Chip from "../components/Chip";
import { properties, bedroomOptions, renovationOptions } from "../data/properties";

/**
 * AccommodationListing (หน้าที่ 1/5)
 * ------------------------------------------------------------
 * หน้าแรกของ flow: แสดงรายการที่พักให้ผู้ใช้เลือก พร้อมช่องค้นหา
 * และตัวกรองด้านซ้าย (FilterSidebar) เก็บ state ของตัวกรอง — ราคา
 * สูงสุด, keyword สิ่งอำนวยความสะดวกที่เลือก (Popular Filters),
 * จำนวนห้องนอน (Number of bedrooms), ช่วงเวลาเปิด/ปรับปรุงที่พัก
 * (Opening/renovation time) — ไว้ที่นี่ แล้วกรอง `properties` ก่อน
 * render จริง เมื่อกด "Book Now" บนการ์ดที่พัก จะพาไปหน้า
 * AccommodationDetail (/detail/:id) พร้อมบันทึกที่พักที่เลือกไว้
 * ------------------------------------------------------------
 */
export default function AccommodationListing() {
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedKeywords, setSelectedKeywords] = useState([]); // Popular Filters: ไม่ติ๊กอะไรไว้ก่อน (opt-in)
  const [selectedBedroom, setSelectedBedroom] = useState(null); // radio: เลือกได้ทีละ 1 ค่า หรือไม่เลือกเลย
  const [selectedRenovations, setSelectedRenovations] = useState([]); // checkbox: เลือกได้หลายค่า

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  // กดตัวเลือกเดิมซ้ำ = ยกเลิกการเลือก (radio ที่ยกเลิกได้)
  const selectBedroom = (value) => {
    setSelectedBedroom((prev) => (prev === value ? null : value));
  };

  const toggleRenovation = (value) => {
    setSelectedRenovations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredProperties = useMemo(() => {
    const bedroomTest = bedroomOptions.find((o) => o.value === selectedBedroom)?.test;
    const renovationMaxMonths = renovationOptions
      .filter((o) => selectedRenovations.includes(o.value))
      .map((o) => o.maxMonths);

    return properties.filter((p) => {
      if (p.pricePerNight > maxPrice) return false;
      // ที่พักต้องมี keyword ที่ติ๊กไว้ "ครบทุกอัน" (AND) ถึงจะผ่านตัวกรอง
      if (!selectedKeywords.every((k) => p.keywords.includes(k))) return false;
      if (bedroomTest && !bedroomTest(p.bedrooms)) return false;
      // ผ่านช่วงเวลาที่ติ๊กไว้ "อันใดอันหนึ่ง" (OR) ก็พอ
      if (renovationMaxMonths.length > 0) {
        const withinAnySelectedRange = renovationMaxMonths.some(
          (max) => p.renovatedMonthsAgo <= max
        );
        if (!withinAnySelectedRange) return false;
      }
      return true;
    });
  }, [maxPrice, selectedKeywords, selectedBedroom, selectedRenovations]);

  return (
    <>
      <Header />

      <section className="hero-strip">
        <div className="wrap">
          <h1>Curated stays across Thailand</h1>
          <p>
            Private villas, riverside sanctuaries and beachfront retreats —
            hand-selected for the discerning traveller.
          </p>
        </div>
      </section>

      <div className="wrap">
        <SearchBar />
      </div>

      <main className="wrap">
        <div className="listing">
          <aside>
            <FilterSidebar
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              selectedKeywords={selectedKeywords}
              onToggleKeyword={toggleKeyword}
              selectedBedroom={selectedBedroom}
              onSelectBedroom={selectBedroom}
              selectedRenovations={selectedRenovations}
              onToggleRenovation={toggleRenovation}
            />
          </aside>

          <section>
            <div className="chips">
              <Chip label="Free Cancellation" />
              <Chip label="Breakfast Included" defaultOn />
              <Chip label="Private Pool" />
              <Chip label="Beachfront" />
            </div>

            <p className="muted" style={{ marginBottom: 18 }}>
              {filteredProperties.length} propert{filteredProperties.length === 1 ? "y" : "ies"} found
            </p>

            {filteredProperties.length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <p className="muted">No properties match your filters. Try widening your price range or other filter selections.</p>
              </div>
            )}

            {filteredProperties.map((property) => (
              <div key={property.id} style={{ marginBottom: 22 }}>
                <PropertyCard property={property} mode="list" />
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
