# บันทึกสถานะการรวมระบบจาก goThailand-YOK เข้าสู่ Landing (YOK Integration Status & Gap Analysis)

เอกสารนี้จัดทำขึ้นเพื่อบันทึกและตรวจสอบเปรียบเทียบระหว่างสิ่งที่ **Dev Yok (`goThailand-YOK`)** สร้างไว้ กับสิ่งที่ **ได้นำเข้าสู่ `landing` แล้ว** และ **สิ่งที่ยังคงขาดอยู่ (Pending Backlog)** เพื่อให้ทีมเห็นภาพรวมและใช้วางแผนต่อยอดได้อย่างถูกต้อง

---

## 1. ✅ สิ่งที่นำเข้ามาใน `landing` เรียบร้อยแล้ว (Transferred & Working)

| รายการ | สิ่งที่นำเข้ามา | ที่อยู่ใน `landing/` | สถานะการทำงาน |
| :--- | :--- | :--- | :--- |
| **Assets รูปภาพ** | ภาพถ่ายที่พัก 13 แห่ง และยานพาหนะ | `landing/public/images/` | แสดงผลรูปจริงได้ครบ ไม่เกิด 404 |
| **Mock Data ที่พัก** | ข้อมูลที่พัก 13 แห่งทั่วไทย พร้อมตัวกรอง | `src/data/properties.ts`, `regions.ts` | แปลงเป็น TypeScript type ปลอดภัย |
| **State การจองกลาง** | `BookingContext` (คำนวณวัน, คืน, ราคารวม) | `src/contexts/BookingContext.tsx` | ครอบใน `ProviderWrapper.tsx` เรียกได้ทุกหน้า |
| **กล่องค้นหาที่พัก** | `SearchBar` (จุดหมาย, วันที่, ผู้เข้าพัก) | `src/components/yok/SearchBar.tsx` | กด Submit แล้วส่งไปที่ `/accommodations` |
| **การ์ดที่พัก** | `PropertyCard` (โหมด `mini` และ `list`) | `src/components/yok/PropertyCard.tsx` | รองรับรูปภาพ เรตติ้ง และปุ่มจอง |
| **ตัวกรองที่พัก** | `FilterSidebar` & `Chip` | `src/components/yok/FilterSidebar.tsx`, `Chip.tsx` | กรองราคา, สิ่งอำนวยความสะดวก, ห้องนอน |
| **คอมโพเนนต์เสริม** | `PhotoPlaceholder`, `Button` | `src/components/yok/` | รองรับ Next.js Link และ fallback gradient |
| **สไตล์และ Tokens** | คลาส `.card`, `.hotel`, `.badge-rate` ฯลฯ | `src/styles/yok.css` | นำเข้าใน `globals.css` โดยไม่กระทบ MUI |
| **หน้าแรก (Home)** | `FeaturedAccommodations` | `src/views/landings/default/FeaturedAccommodations.tsx` | แสดง SearchBar + การ์ดแนะนำ 4 แห่ง |
| **หน้ารวมที่พัก** | หน้ารวมที่พัก 13 แห่งพร้อมตัวกรอง | `src/app/(landings)/(default)/accommodations/page.tsx` | กรองข้อมูลและแสดงผลได้สมบูรณ์ |

---

## 2. ❌ สิ่งที่ยังขาดอยู่ใน `landing` (ยังไม่ได้ย้ายจาก `goThailand-YOK`)

จากการตรวจสอบโค้ดใน `goThailand-YOK` พบว่ายังมีฟีเจอร์และคอมโพเนนต์ที่ยังไม่ได้ยกเข้ามาดังนี้:

### 2.1 🏨 หน้ารายละเอียดที่พัก (Accommodation Detail Page)
* **ไฟล์ต้นทางใน Yok**: `pages/AccommodationDetail.jsx`
* **คอมโพเนนต์ที่เกี่ยวข้อง**:
  * `components/DateRangeFields.jsx`: กล่องกรอกวันเช็คอิน-เช็คเอาท์พร้อมคำนวณคืนแบบ Interactive
  * `components/GuestRoomSelector.jsx` & `QuantityStepper.jsx`: ปุ่มบวกลบเลือกจำนวนผู้ใหญ่ เด็ก และห้องพัก
* **สิ่งที่ขาดใน `landing`**:
  * ยังไม่มี Route `src/app/(landings)/(default)/accommodations/[id]/page.tsx` (ปัจจุบันปุ่ม View Details ชี้ไปที่นี่ แต่ยังไม่มีหน้ารองรับ)
  * ยังไม่ได้ยก Gallery ภาพ 5 รูป, รายละเอียดสิ่งอำนวยความสะดวก 6 หมวด, และโซน *"You might also like"* ของหน้ารายละเอียดมา

---

### 2.2 🚗 ระบบรถเช่าครบวงจร (Car Rental System)
* **ไฟล์ต้นทางใน Yok**:
  * `data/cars.js`: ข้อมูลจำลองรถยนต์ให้เช่า 12 คัน (Sedan, SUV, EV, Luxury เช่น Yaris, Fortuner, BMW, MG ZS EV)
  * `pages/CarRental.jsx`: หน้ารวมรายการรถเช่า
  * `pages/CarDetail.jsx`: หน้ารายละเอียดรถ สเปกเครื่องยนต์ นโยบายน้ำมัน และจุดรับรถ
  * `components/CarCard.jsx`: การ์ดแสดงข้อมูลรถเช่า
  * `components/CarFilterSidebar.jsx`: ตัวกรองประเภทรถและงบประมาณ
  * `components/CarSearchBar.jsx`: แถบค้นหารถเช่า
* **สิ่งที่ขาดใน `landing`**:
  * ยังไม่มีไฟล์ `src/data/cars.ts`
  * ยังไม่มี Route `src/app/(landings)/(default)/cars/page.tsx` และ `src/app/(landings)/(default)/cars/[id]/page.tsx`
  * ยังไม่ได้เพิ่มเมนู "เช่ารถ" บน Navbar

---

### 2.3 🛒 หน้าตะกร้าสินค้า (Booking Cart Page)
* **ไฟล์ต้นทางใน Yok**:
  * `pages/BookingCart.jsx`: หน้าแสดงรายการสินค้าในตะกร้าก่อนส่งไป Checkout
  * `components/OrderSummary.jsx`: การ์ดสรุปรายการพร้อมปุ่มแก้ไขวันเดินทาง
  * `components/Stepper.jsx`: แถบระบุขั้นตอนการจอง 4 ขั้น (Detail ➔ Cart ➔ Checkout ➔ Success)
* **สิ่งที่ขาดใน `landing`**:
  * ยังไม่มี Route `src/app/(landings)/(default)/cart/page.tsx` (ปัจจุบันโฟลว์กระโดดจากหน้ารายการไปที่ `/checkout` โดยตรง ยังไม่มีหน้าตะกร้าสำหรับ Review รายการ)

---

### 2.4 🌐 Section บริการหลัก 3 หมวด และ Trust Bar บนหน้าแรก
* **ไฟล์ต้นทางใน Yok**: `pages/Home.jsx`
* **สิ่งที่ขาดใน `landing`**:
  * การ์ดแนะนำ 3 บริการหลัก (Accommodation, Car Rental, Tourist Guide)
  * แถบความน่าเชื่อถือท้ายหน้า (Trust Bar 4 ช่อง: Trusted & Reliable, 24/7 Local Support, Best Price, Explore Thailand)

---

## 3. 🚧 ข้อจำกัดเดิมที่ยังค้างอยู่ในโค้ดของ `goThailand-YOK` เอง (Original Limitations)
*(บันทึกตามเอกสาร `goThailand-YOK/TODO.md`)*

1. **ปุ่ม "Book Now" ของรถเช่าใน `CarDetail.jsx` ยังไม่ผูกเข้า Flow การจอง**:
   * โค้ดเดิมของ Yok มีหน้ารายละเอียดรถ แต่ยังไม่ได้ผูกเข้าตะกร้าสินค้า
2. **SearchBar เดิมเป็นเพียง UI Demo**:
   * ในโค้ดเดิมของ Yok การกด Search ใน `SearchBar` ไม่ได้ส่งค่า parameter ไปกรองข้อมูลจริง
3. **เมนู "Tourist Guide" ยังเป็น Anchor `#guide`**:
   * Yok ยังไม่มีหน้ารวมไกด์จริง (ส่วนนี้ต้องนำไปต่อยอดร่วมกับของ **Dev Meng** `GoThailand-Meng/pages/TouristGuide.jsx`)

---

## 4. 📌 แผนงานและลำดับความสำคัญในการนำเข้าส่วนที่เหลือ (Next Backlog)

```
[Priority 1 - High]   สร้างหน้ารายละเอียดที่พัก: /accommodations/[id] (เพื่อไม่ให้ปุ่ม View Details ค้าง)
[Priority 2 - High]   สร้างหน้าตะกร้าสินค้า: /cart (เชื่อมต่อ Detail -> Cart -> Checkout)
[Priority 3 - Medium] นำเข้าระบบรถเช่า: data/cars.ts, CarCard, /cars, /cars/[id]
[Priority 4 - Medium] เพิ่ม 3 Services Card และ Trust Bar ลงในหน้าแรกต่อจาก Hero
```
