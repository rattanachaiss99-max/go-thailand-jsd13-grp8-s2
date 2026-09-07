# บันทึกสถานะการรวมระบบจาก goThailand-Wa เข้าสู่ Landing (WA Integration Status & Gap Analysis)

เอกสารนี้จัดทำขึ้นเพื่อบันทึกและตรวจสอบเปรียบเทียบระหว่างสิ่งที่ **Dev Wa (`goThailand-Wa`)** ออกแบบและพัฒนาไว้ กับสิ่งที่ **ได้นำเข้าสู่ `landing` แล้ว** และ **สิ่งที่ยังคงเป็นงานค้าง (Pending Backlog)** เพื่อให้ทีมงานสามารถติดตามการพัฒนาได้อย่างต่อเนื่อง

---

## 1. ✅ สิ่งที่นำเข้ามาใน `landing` เรียบร้อยแล้ว (Transferred & Working)

| รายการ | สิ่งที่นำเข้ามา | ที่อยู่ใน `landing/` | รายละเอียดการทำงาน |
| :--- | :--- | :--- | :--- |
| **CRM Customer Dashboard** | หน้า Dashboard สรุปข้อมูลผู้ใช้งาน | `src/app/(landings)/(default)/dashboard/page.tsx` | เชื่อมต่อกับ `UserContext` เพื่อแสดงชื่อผู้ใช้ (`user.firstName`), ระดับสมาชิก (`membershipTier`), และแบนเนอร์ข้อความต้อนรับ |
| **Dashboard Stats Cards** | การ์ดสถิติ 4 ใบ | `src/components/crm/StatCard.tsx`, `DashboardStats.tsx` | แสดง: Upcoming Trips, Total Bookings, Rewards Points, Saved Places (รองรับการทำ Skeleton Loading และ Error Retry) |
| **Traveler Guidance Bento** | ขั้นตอนแนะนำ 3 สเต็ป | `src/components/crm/NextStepsBento.tsx` | Bento Box 3 สเต็ป: ตรวจสอบอีเมล, เอกสารที่ต้องเตรียม, การรับรถ/การเดินทาง |
| **รายการประวัติการจอง** | ตารางรายการคำสั่งซื้อและการจอง | `src/components/crm/BookingList.tsx` | แสดงรายการจองล่าสุด พร้อมแท็กสถานะ (Confirmed, Completed, Cancelled), ประเภทบริการ, วันที่ และราคา |
| **Data Models & Mock Data** | ข้อมูลจำลองผู้ใช้ คำสั่งซื้อ และสถานที่ | `src/data/crm/mockData.ts` | แปลงเป็น TypeScript โดยโครงสร้างตรงกับ `Customer.ts` (Mongoose discriminator) และ `Order` schema มีคำสั่งซื้อ 13 รายการ และสถานที่ท่องเที่ยว 8 แห่ง |
| **Service Layer** | ฟังก์ชันดึงสถิติและการคำนวณ | `src/services/dashboardService.ts` | คำนวณ `upcomingTrips` (กรองเฉพาะสถานะ `confirmed` ในอนาคต), `totalBookings`, `points`, `savedPlaces` พร้อมจำลอง network delay |
| **เมนูนำทาง (Navbar)** | ปุ่มเข้าแดชบอร์ด | `src/views/landings/default/data/navbar.tsx` | เพิ่มเมนู "แดชบอร์ด" ลิงก์ตรงไปที่ `/dashboard` |

---

## 2. ❌ สิ่งที่ยังขาดอยู่ / รอต่อยอดจาก `goThailand-Wa` (Pending Backlog)

จากการตรวจสอบโค้ดและแผนเอกสารในโฟลเดอร์ `goThailand-Wa` พบประเด็นและฟีเจอร์ที่ยังค้างอยู่ดังนี้:

### 2.1 🚗 หน้ายืนยันการจองรถเช่าเฉพาะทาง (Car Rental Booking Success View)
* **ไฟล์ต้นทางใน Wa**:
  * `src/views/BookingSuccessView.jsx`
  * `src/components/BookingSuccessHero.jsx` (ระบุหัวข้อรถเช่า Toyota Fortuner รหัส GT-CR-2026-00128)
  * `src/components/ActionButtons.jsx`
* **สิ่งที่ขาดใน `landing`**:
  * ปัจจุบัน `landing` มีหน้ายืนยันการจองทั่วไปของ Guitar (`/booking-success`) ซึ่งผูกกับที่พักและการจองรวม
  * ยังไม่มีหน้า Success ที่ปรับแต่งข้อความและรายละเอียดสำหรับโฟลว์การเช่ารถโดยเฉพาะ (เช่น จุดรับรถ สนามบินภูเก็ต, นโยบายน้ำมัน)

---

### 2.2 🗄️ การเชื่อมต่อ MongoDB Backend จริง (Real Database Integration)
* **ไฟล์ต้นทางใน Wa**:
  * `CRM_DASHBOARD_PLAN.md`
  * `DASHBOARD_SCHEMA.md`
  * `ORDER_MONGODB_PLAN.md`
* **สิ่งที่ขาดใน `landing`**:
  * ปัจจุบัน `landing/src/services/dashboardService.ts` ตั้งค่า `const USE_MOCK = true;` ไว้
  * **แผนงานถัดไปเมื่อ Backend พร้อม**:
    1. สร้าง API Route `GET /api/orders` และ `GET /api/dashboard/stats` ใน `landing/src/app/api/`
    2. สลับ `USE_MOCK = false` ใน `dashboardService.ts` เพื่อดึงข้อมูล `Order` และ `Customer` จาก MongoDB ผ่าน Mongoose จริง

---

### 2.3 📍 การแสดงรายการสถานที่ที่บันทึกไว้ (Wishlist / Saved Places Interaction)
* **ไฟล์ต้นทางใน Wa**: `src/mock/places.js` (มีข้อมูลสถานที่ท่องเที่ยว 8 แห่ง เช่น วัดอรุณ, ดอยอินทนนท์, อ่าวมาหยา)
* **สิ่งที่ขาดใน `landing`**:
  * บนแดชบอร์ดปัจจุบัน การ์ด "SAVED PLACES" แสดงตัวเลข 8 แต่ยังไม่สามารถคลิกเพื่อเปิดดูรายการสถานที่ท่องเที่ยวที่ผู้ใช้บันทึกไว้ (Wishlist Modal หรือหน้า `/wishlist`)

---

### 2.4 👤 หน้าตั้งค่าข้อมูลส่วนตัวผู้ใช้ (Profile Settings & Preferences)
* **ไฟล์ต้นทางใน Wa**: `currentUser.js` มีฟิลด์ `phone`, `preferredLanguage`, `coupons`
* **สิ่งที่ขาดใน `landing`**:
  * ยังไม่มีหน้า UI ให้ลูกค้ากดแก้ไขเบอร์โทรศัพท์, อัปโหลด Avatar, หรือเลือกภาษาที่ต้องการ

---

## 3. 📌 สรุปแผนการพัฒนาต่อยอดสำหรับระบบ CRM (CRM Next Steps)

```
[Priority 1] เชื่อมต่อ service layer กับ MongoDB API จริงเมื่อ backend /api/orders พร้อม (สลับ USE_MOCK = false)
[Priority 2] เพิ่ม Interactive Modal/Drawer แสดงรายการ Saved Places เมื่อคลิกการ์ดสถิติ
[Priority 3] นำเข้าหน้า Car Rental Booking Success สำหรับโฟลว์เช่ารถโดยเฉพาะ
[Priority 4] เพิ่มหน้าแก้ไข Profile / Customer Preferences
```
