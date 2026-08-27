/* ============================================================
   pages/TouristGuide.jsx
   The "Select Your Tourist Guide" page
   (matches pic/TouristGuide_Page.jpg)

   Structure from top to bottom:
   1. Banner      - beach picture with the page title
   2. Guide cards - 9 cards per page (3 columns), controlled by
                    the pagination buttons (1 / 2 / 3)
   3. Pagination  - page number buttons + "More Guides >"
   4. CtaBanner   - shared booking banner
   (Navbar and Footer are added automatically by components/Layout)
   ============================================================ */

import { useState } from "react";
import GuideCard from "../components/GuideCard";
import CtaBanner from "../components/CtaBanner";
import { guides, PAGE_SIZE } from "../moc-data/guides";

export default function TouristGuide() {
  // Which page of the guide list is currently shown (starts at 1)
  const [page, setPage] = useState(1);

  // Total number of pages, e.g. 27 guides / 9 per page = 3 pages
  const totalPages = Math.ceil(guides.length / PAGE_SIZE);

  // Only the guides of the current page are displayed,
  // example: page 2 -> guides 10 to 18
  const visibleGuides = guides.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // "More Guides >" jumps to the next page and wraps back to page 1
  const goNextPage = () => setPage((current) => (current % totalPages) + 1);

  return (
  <div>
  
  {/* ----- 1. page banner with the title ----- */} 
      <section className="relative overflow-hidden">
        {/* แก้ไข: ลบ absolute/object-cover ออก และใช้ w-full h-auto เพื่อให้รูปแสดงความสูงเต็มสัดส่วนจริง */}
        <img
          src="/images/hero-beach.jpg"
          alt="Thai beach with limestone mountains"
          className="w-full h-auto block"
        />

        {/* Overlay สีขาวใส ซ้อนทับเต็มพื้นที่รูปภาพ */}
        <div className="absolute inset-0 bg-white/45" />

        {/* ข้อความจัดให้อยู่ตรงกลางแบนเนอร์ */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="font-display text-3xl font-bold text-thai-navy drop-shadow-sm sm:text-5xl">
            Select Your Tourist Guide
          </h1>
        </div> 
      </section>
  

{/* ----- 2. grid of guide cards ----- */}
      {/* extra padding at the bottom gives room for the
         "More information" buttons that overlap the card edges */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-6 pb-14 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGuides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </section>

      {/* ----- 3. pagination ----- */}
      <nav
        aria-label="Guide pages"
        className="flex items-center justify-center gap-3 pb-14"
      >
        {/* one button per page: 1, 2, 3 ... */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => setPage(pageNumber)}
            aria-current={page === pageNumber ? "page" : undefined}
            className={`
              h-9 w-9 rounded-lg border font-bold transition-all duration-150
              ${
                page === pageNumber
                  ? "border-thai-navy bg-thai-navy text-white"      /* active page */
                  : "border-gray-300 bg-white text-thai-navy hover:border-thai-gold hover:bg-thai-gold/20 active:bg-thai-gold active:text-white"
              }
            `}
          >
            {pageNumber}
          </button>
        ))}

        {/* "More Guides" text button -> next page */}
        <button
          type="button"
          onClick={goNextPage}
          className="
            ml-2 flex items-center gap-1 rounded-lg px-3 py-2 font-display text-xl font-bold text-thai-navy
            transition-all duration-150
            hover:text-thai-gold hover:bg-thai-gold/10      /* mouse over  */
            active:scale-95 active:text-thai-gold-dark      /* mouse press */
          "
        >
          More Guides <span className="text-2xl leading-none">&rsaquo;</span>
        </button>
      </nav>

      {/* ----- 4. shared booking banner ----- */}
      <CtaBanner />
    </div>
  );
}
