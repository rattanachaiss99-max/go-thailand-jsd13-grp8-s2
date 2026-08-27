/* ============================================================
   pages/HomePage.jsx
   The GoThailand home page (matches pic/GoThailand_HomePage.png)

   Structure from top to bottom:
   1. HeroSection   - beach banner with Thailand map + logo
   2. Services      - 3 white selection cards
                      (Accommodation / Car Rental / Tourist Guide)
   3. CtaBanner     - "Book Your Unforgettable Thai Experience"
   (Navbar and Footer are added automatically by components/Layout)
   ============================================================ */

import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import CtaBanner from "../components/CtaBanner";
import { services } from "../moc-data/services";

export default function HomePage() {
  return (
    <div>
      {/* 1. hero banner with the map, logo and boat picture */}
      <HeroSection />

      {/* 2. the three service selection cards.
         id="services" lets the menu link /#services scroll here */}
      <section
        id="services"
        className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3"
      >
        {/* create one ServiceCard for every entry in moc-data/services.js */}
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            image={service.image}
            link={service.link}
          />
        ))}
      </section>

      {/* 3. booking call-to-action banner */}
      <CtaBanner />
    </div>
  );
}
