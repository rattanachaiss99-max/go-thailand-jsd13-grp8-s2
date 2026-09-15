import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AccommodationListing from "./pages/AccommodationListing";
import AccommodationDetail from "./pages/AccommodationDetail";
import BookingCart from "./pages/BookingCart";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import CarRental from "./pages/CarRental";
import CarDetail from "./pages/CarDetail";

/**
 * App
 * ------------------------------------------------------------
 * จุดกำหนดเส้นทาง (routing) ของทั้งเว็บไซต์:
 *   /                 -> Home                  (หน้าแรก/landing page)
 *   /accommodations   -> AccommodationListing  (เลือกที่พัก)
 *   /detail/:id       -> AccommodationDetail    (ดูรายละเอียด + Reserve)
 *   /cart             -> BookingCart            (ตรวจสอบตะกร้า)
 *   /checkout         -> Checkout               (กรอกข้อมูล + ชำระเงิน)
 *   /success          -> BookingSuccess         (ยืนยันการจองสำเร็จ)
 *   /car-rental       -> CarRental              (เลือก/ค้นหารถเช่า)
 *   /car-rental/:id   -> CarDetail              (ดูรายละเอียดรถ + จอง)
 * ------------------------------------------------------------
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/accommodations" element={<AccommodationListing />} />
      <Route path="/detail/:id" element={<AccommodationDetail />} />
      <Route path="/cart" element={<BookingCart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<BookingSuccess />} />
      <Route path="/car-rental" element={<CarRental />} />
      <Route path="/car-rental/:id" element={<CarDetail />} />
    </Routes>
  );
}
