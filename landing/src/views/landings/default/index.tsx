'use client';
import FeaturedAccommodations from './FeaturedAccommodations';
import ThreePillarsSection from './ThreePillarsSection';
// import ExploreDestinations from './ExploreDestinations'; // ซ่อนแผนที่หน้า Home ชั่วคราว (แสดงเฉพาะในหน้า Profile)
// import StampShowcaseSection from './StampShowcaseSection'; // ย้ายไปเปิดเป็น Route หมวดแนะนำฟีเจอร์แยกต่างหากที่ /features
import TripBundleBar from '@/components/ecommerce/TripBundleBar';

/***************************  PAGE - MAIN  ***************************/

export default function Main() {
  return (
    <>
      {/* 1. ส่วนค้นหาและที่พักแนะนำยอดนิยม */}
      <FeaturedAccommodations />

      {/* 2. 3 เสาหลักฟีเจอร์ (Chauffeur, Stamps, Trio Bundle) */}
      <ThreePillarsSection />

      {/* 3. แถบสรุปจัดทริปมัดรวม */}
      <TripBundleBar />
    </>
  );
}
