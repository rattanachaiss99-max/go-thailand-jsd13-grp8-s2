# บันทึกการเปลี่ยนโครงสร้างโฟลเดอร์ — Go Thailand (JSD13 Grp8)

อัปเดตล่าสุด: 2026-08-27

---

## ⚠️ โครงสร้างปัจจุบัน (หลังรวม Landing)

โปรเจกต์ทั้งทีมอยู่ที่: `C:\WorkFile\web\JSD13\go-thailand-jsd13-grp8-s2\`

```
go-thailand-jsd13-grp8-s2/
├── landing/                    ← โปรเจกต์หลัก (Next.js) — รวม backend แล้ว
│   ├── src/
│   │   ├── server/             ← [NEW] Backend MongoDB (User/Customer/Admin + auth)
│   │   ├── app/
│   │   │   ├── api/auth/        ← [NEW] register / login / me routes
│   │   │   └── (auth)/register/ ← [NEW] หน้าสมัคร/ล็อกอิน/ลืมรหัส
│   │   ├── components/auth/     ← AuthRegister เรียก API จริงแล้ว
│   │   └── views/landings/default/ ← Hero มีปุ่มลิงก์ /register
│   ├── .env.example            ← [NEW] ตัวอย่าง env (ไม่มีค่าจริง)
│   ├── TODO_BACKEND.md         ← [NEW] สถานะ + แผนทำต่อ
│   └── package.json            ← [NEW] เพิ่ม mongoose/bcryptjs/jsonwebtoken
├── go-Thailand-Guitar/         ← ของ Dev Guitar (Vite) — ไม่แตะ
├── GoThailand-Meng/            ← ของ Dev Meng (Vite) — ไม่แตะ
├── goThailand-YOK/             ← ของ Dev YOK (Vite) — ไม่แตะ
├── README.md                   ← ของทีม (เดิม)
└── Quick_Start.md              ← ของทีม (เดิม)
```

---

## 📁 โฟลเดอร์ที่เปลี่ยนไปจากเดิม

### ก่อนหน้า
- `C:\WorkFile\web\JSD13\go-thailand-app-dev\landing\` — ที่เก็บ Landing ที่พัฒนาแยกไว้

### หลังจากนี้
- ✅ ย้าย/รวมเนื้อหา Landing (backend + หน้า auth) **เข้าสู่** `go-thailand-jsd13-grp8-s2\landing\`
- ⏸️ `go-thailand-app-dev\` **ยังคงอยู่บนดิสก์** (ไม่ลบ) สำหรับอ้างอิง แต่โปรเจกต์หลักคือโฟลเดอร์ทีมด้านบน
- ❌ ไม่แตะ `go-Thailand-Guitar/`, `GoThailand-Meng/`, `goThailand-YOK/` (ของสมาชิกคนอื่น)

---

## 🔑 สิ่งสำคัญสำหรับทุกคนในทีม

1. **ทำงานใน `go-thailand-jsd13-grp8-s2\landing\`** (ไม่ใช่ go-thailand-app-dev)
2. ติดตั้ง deps ใหม่ก่อนรัน:
   ```bash
   cd landing && npm install
   ```
3. สร้าง `.env` จาก `.env.example` แล้วกรอก `MONGODB_URI` + `JWT_SECRET`
4. **ห้าม commit `.env`** (ถูก .gitignore แล้ว)
5. Landing ใช้ **npm** (ไม่ใช่ yarn) — ห้ามสลับไป npm/yarn สะเปะสะปะ

---

## 📌 สิ่งที่เพิ่มเข้ามาใน Landing (สรุป)

### 1. ระบบ Auth & Backend MongoDB (รอบแรก: 2026-08-27)
- MongoDB models: `User` (base) / `Customer` (สมาชิก) / `Admin`
- Auth API: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/forgot-password`, `/api/auth/reset-password`
- หน้า `/register` (แท็บ สมัคร/ล็อกอิน/ลืมรหัส)
- ปุ่ม "สมัครสมาชิก / ล็อกอิน" บน Hero หน้าแรก → ลิงก์ `/register`
- `.env.example` + `TODO_BACKEND.md`

### 2. ระบบที่พัก & Component จาก goThailand-YOK (รอบสอง: 2026-09-07)
- ✅ **Assets รูปภาพ**: คัดลอกโฟลเดอร์รูปภาพที่พักทั้งหมดจาก `goThailand-YOK/public/images/` มาไว้ที่ `landing/public/images/`
- ✅ **Data & State กลาง**:
  - `landing/src/data/properties.ts` และ `regions.ts`: Mock data ที่พัก 13 แห่งทั่วไทย พร้อม TypeScript types และตัวกรอง
  - `landing/src/contexts/BookingContext.tsx`: Context สิทธิ์การจอง คำนวณจำนวนคืน เก็บสถานะที่พักที่เลือก และครอบไว้ใน `ProviderWrapper.tsx`
- ✅ **Component สไตล์ Yok (แปลงเป็น Next.js Client Components)**:
  - `landing/src/components/yok/SearchBar.tsx`: กล่องค้นหาจุดหมาย, วันเข้าพัก-ออก, จำนวนผู้เข้าพัก
  - `landing/src/components/yok/PropertyCard.tsx`: การ์ดที่พัก รองรับทั้งโหมด `mini` และ `list`
  - `landing/src/components/yok/PhotoPlaceholder.tsx` & `Button.tsx`: กล่องรูปภาพและปุ่มพร้อม Next.js `Link`
  - `landing/src/components/yok/FilterSidebar.tsx` & `Chip.tsx`: ตัวกรองราคา สิ่งอำนวยความสะดวก และห้องนอน
- ✅ **สไตล์เฉพาะ**:
  - `landing/src/styles/yok.css`: รวม Design Tokens และ Component classes โดยตัด reset รุนแรงออกเพื่อไม่ให้กระทบ MUI
  - นำเข้าใน `landing/src/app/globals.css`
- ✅ **หน้าเว็บและเส้นทางใหม่**:
  - `landing/src/views/landings/default/FeaturedAccommodations.tsx`: แสดง SearchBar + การ์ดที่พักแนะนำ 4 แห่งต่อท้าย Hero
  - `landing/src/app/(landings)/(default)/accommodations/page.tsx`: หน้ารวมที่พัก 13 แห่งพร้อม FilterSidebar แบบเต็มระบบ
  - เมนู Navbar: เพิ่มเมนู "ที่พัก" (`/accommodations`)

### 3. ระบบ CRM Customer Dashboard จาก goThailand-Wa (รอบสาม: 2026-09-07)
- ✅ **Data & Service**:
  - `landing/src/data/crm/mockData.ts`: ข้อมูลจำลองลูกค้า, ประวัติการจอง 13 รายการ (ครอบคลุมทั้งที่จะถึง เสร็จสิ้น และยกเลิก), และสถานที่ท่องเที่ยวใน Wishlist
  - `landing/src/services/dashboardService.ts`: คำนวณสถิติ 4 หมวด (Upcoming Trips, Total Bookings, Rewards Points, Saved Places) ตรงตามข้อกำหนดของ Mongoose Customer
- ✅ **Components ใน `landing/src/components/crm/`**:
  - `StatCard.tsx`: การ์ดสรุปตัวเลขสถิติ รองรับโหมด Highlight สีกรมทอง และโหมดปกติ
  - `DashboardStats.tsx`: Grid รวม 4 การ์ด พร้อม Skeleton Loading ตอนรอโหลดข้อมูล
  - `BookingList.tsx`: แสดงการ์ดรายการจอง พร้อม Badge ประเภทบริการ (ที่พัก/รถเช่า/ไกด์), วันที่, ยอดเงิน และรหัสอ้างอิง
  - `NextStepsBento.tsx`: Bento แนะนำ 3 ขั้นตอนเตรียมตัวก่อนเดินทาง (เช็คอีเมล, เตรียมเอกสาร, ออกเดินทาง)
- ✅ **หน้าเว็บและเส้นทางใหม่**:
  - `landing/src/app/(landings)/(default)/dashboard/page.tsx`: หน้า CRM Dashboard สมาชิกเต็มรูปแบบ เชื่อมโยงกับ `UserContext` แสดงชื่อผู้ใช้จริง และระดับสมาชิก (Gold Member)
  - เมนู Navbar: ปรับลิงก์ "แดชบอร์ด" ใน `landing/src/views/landings/default/data/navbar.tsx` ให้เปิดหน้า `/dashboard` ภายในแอปทันที

### 4. ระบบ Checkout & PaymentPanel จาก go-Thailand-Guitar (รอบสี่: 2026-09-07)
- ✅ **Components ใน `landing/src/components/checkout/`**:
  - `PaymentPanel.tsx`: แผงตัวเลือกการชำระเงิน 3 แบบ (Card, PromptPay QR, Bank Transfer)
  - `BookingSummary.tsx`: การ์ดสรุปยอดเงิน คำนวณราคาจริงจาก `BookingContext` (ยอดรวม, ภาษี 7%) พร้อมปุ่ม Confirm & Pay
  - `CheckoutSection.tsx`: กล่องครอบการ์ดฟอร์มแต่ละส่วน
  - `FormField.tsx`: ฟิลด์อินพุตพร้อม Label และการแจ้งเตือน Error
- ✅ **หน้าเว็บและเส้นทางใหม่**:
  - `landing/src/app/(landings)/(default)/checkout/page.tsx`: หน้า Checkout เต็มรูปแบบ เชื่อมโยง Autofill ชื่อ/อีเมลจาก `UserContext`
  - `landing/src/app/(landings)/(default)/booking-success/page.tsx`: หน้ายืนยันการจองสำเร็จ พร้อมรหัสอ้างอิง (Reference ID)
- ✅ **เอกสารคู่มือและการต่อเติม**:
  - `landing/GUITAR_INTEGRATION_GUIDE.md`: บันทึกจุดต่อเติมจากโค้ดเดิมของ Guitar, สถาปัตยกรรม Context, และแนวทางการต่อเชื่อม Payment Gateway จริง (Omise/Stripe) ในอนาคต

### 5. เอกสารสรุปสถานะและ Gap Analysis ของ YOK และ Wa (2026-09-07)
- ✅ `landing/YOK_INTEGRATION_STATUS.md`: สรุปสิ่งที่นำเข้าแล้วจาก `goThailand-YOK` และสิ่งที่ยังขาด (หน้ารายละเอียดที่พัก `/accommodations/[id]`, ระบบรถเช่า, หน้าตะกร้า `/cart`)
- ✅ `landing/WA_INTEGRATION_STATUS.md`: สรุปสิ่งที่นำเข้าแล้วจาก `goThailand-Wa` และสิ่งที่รอต่อยอด (หน้ารับรถเช่าสำเร็จ, เชื่อมต่อ MongoDB จริง, Saved Places interaction)

### 6. ระบบ Tourist Guide จาก GoThailand-Meng (รอบห้า: 2026-09-07)
- ✅ **Assets รูปภาพ**: ย้ายภาพทั้งหมดจาก `GoThailand-Meng/public/images/` มาไว้ที่ `landing/public/images/` (`hero-beach.jpg`, `cta-sunset.jpg`, `Guide01-09.jpg`, `ThailandMapByRegion.png`, ฯลฯ)
- ✅ **Data & Type Safety**:
  - `landing/src/data/guides.ts`: Mock Data ไกด์ 27 ท่าน พร้อม TypeScript types (`Guide`, `GuideAvatarConfig`) และฟังก์ชันคำนวณวันว่าง `getAvailableDays` ตามสูตรเดิมของ Meng
- ✅ **Components ใน `landing/src/components/guides/`**:
  - `GuideAvatar.tsx`: วาดรูปอวาตาร์การ์ตูนด้วย SVG พร้อมใช้ React `useId()` ป้องกัน Gradient ID ชนกัน
  - `AvailabilityCalendar.tsx`: มินิปฏิทินแสดงวันว่าง รองรับการเลื่อนดูเดือนย้อนหลัง/ถัดไป และ Badge วันว่างสีทอง
  - `GuideCard.tsx`: การ์ดข้อมูลไกด์ พร้อมปุ่ม "More information" แบบแคปซูล และ Dialog แสดงรายละเอียดภาษา/ราคา/ปุ่มจอง
  - `CtaBanner.tsx`: แบนเนอร์จองท้ายหน้า ปรับใช้ Next.js `<Link>` และ MUI Layout
- ✅ **หน้าเว็บและเส้นทางใหม่**:
  - `landing/src/app/(landings)/(default)/guides/page.tsx`: หน้ารวมไกด์ท่องเที่ยว (`/guides`) พร้อม Hero Banner, แถบกรองปลายทาง (Bangkok/Chiang Mai/ทั้งหมด), และ Pagination
  - เมนู Navbar: เพิ่มเมนู "ไกด์นำเที่ยว" (`/guides`) บน Navigation Bar
### 7. สถาปัตยกรรมและคู่มือการเชื่อมต่อ User Backend กลาง (รอบหก: 2026-09-07)
- ✅ **Central API Handler**:
  - `landing/src/app/api/auth/me/route.ts`: อัปเดตเปิด CORS Headers (`Access-Control-Allow-Origin: *`), รองรับ Preflight Method `OPTIONS` และนำเข้า `Customer` model ให้ Mongoose คืนฟิลด์ discriminator ครบถ้วน
- ✅ **Centralized Auth Service**:
  - `landing/src/services/authService.ts`: จัดทำโมดูลตรวจสอบสถานะผู้ใช้งานกลาง รองรับทั้ง Next.js และก็อปปี้ไปใช้ในโปรเจกต์ Vite ของเพื่อนๆ พร้อมระบบ Mock Fallback ป้องกัน UI พังระหว่าง Dev
- ✅ **เอกสารข้อกำหนดและคู่มือกลางสำหรับทีม**:
  - `landing/USER_AUTH_INTEGRATION_GUIDE.md`: คู่มือรายละเอียด API Contract (`GET /api/auth/me`), รูปร่าง JSON ข้อมูลผู้ใช้, วิธีการต่อใช้งานในแต่ละโฟลเดอร์ (Yok, Wa, Guitar, Meng) และตัวอย่าง Custom Hook

### 8. การพัฒนา Standalone User Microservice บน Render & แก้ไขระบบ Frontend (รอบเจ็ด: 2026-09-07)
- ✅ **Microservice โครงสร้างแยกอิสระ (`landing/user-service/`)**:
  - สร้างโครงสร้าง Clean Architecture สำหรับ User Service แยกต่างหาก: `server.js`, `src/app.js`, `src/config/db.js`, `src/routes/authRoutes.js`, `src/controllers/authController.js`, `src/models/User.js`, `src/models/Customer.js`, `src/middlewares/authMiddleware.js`
  - รองรับการเชื่อมต่อ MongoDB Atlas Database `gothailand_user` คอลเลกชัน `users`
  - Deploy สำเร็จและเปิดให้บริการบน Render Web Service: `https://go-thailand-jsd13-grp8-s2.onrender.com`
- ✅ **การเชื่อมต่อและแก้ไข Frontend (`landing/`)**:
  - เปลี่ยน Port การทดสอบและพัฒนาเป็นพอร์ต 3100 (`next dev -p 3100`) ใน `package.json`
  - อัปเดต `NEXT_PUBLIC_AUTH_API_URL=https://go-thailand-jsd13-grp8-s2.onrender.com` ใน `.env`
  - แก้ไขปัญหา Content Security Policy (CSP) ใน `next.config.mjs` โดยเพิ่ม `https://*.onrender.com` ในคำสั่ง `connect-src`
  - ครอบ `<UserProvider>` ใน `landing/src/app/ProviderWrapper.tsx` แก้ปัญหา `useUser must be used within UserProvider` ข้าม Route groups
  - ทำการทดสอบ End-to-End ผ่านหน้าเว็บจริง สมัครสมาชิกลง MongoDB Atlas สำเร็จ 100%

### 9. จัดทำคู่มือมาตรฐาน CRUD Microservice สำหรับสมาชิกทุกคนในทีม
- ✅ **คู่มือกลางและแม่แบบมาตรฐาน (`landing/TEAM_CRUD_SERVICE_GUIDE.md`)**:
  - สรุปสถาปัตยกรรม Distributed Microservices และระบบแชร์ JWT Token ระหว่างบริการ
  - รวม 5 ปัญหาและวิธีแก้ปัญหาสำคัญที่พบ (CSP, CORS, Context Scope, Atlas 0.0.0.0/0 Whitelist, Port 3100)
  - แม่แบบโครงสร้างโฟลเดอร์และโค้ดมาตรฐาน (`package.json`, `server.js`, `db.js`, `authMiddleware.js`, `app.js`)
  - โค้ด Model และ CRUD Controller เฉพาะทางของสมาชิกแต่ละคน:
    - **Yok** (`stay-service`): Stays & Cars CRUD
    - **Wa** (`order-service`): Bookings & Orders CRUD
    - **Guitar** (`payment-service`): Checkout & Payments CRUD
    - **Meng** (`guide-service`): Tourist Guides CRUD
### 10. พัฒนาระบบ MERN E-Commerce ครบวงจรสำหรับ Sprint 2 (2026-09-08)
- ✅ **Task 7: โครงสร้างข้อมูลและการเชื่อมต่อ MongoDB Atlas**:
  - `landing/src/server/models/Product.ts`: Model สินค้า/บริการท่องเที่ยว (Name, Description, Price, Quantity, Date, Tag, isService, ImageUrl)
  - `landing/src/server/models/Cart.ts`: Model ตะกร้าสินค้า (userRef, items[], status)
- ✅ **Admin Product CRUD API (Admin Features)**:
  - `landing/src/app/api/products/route.ts`: `GET` สินค้าทั้งหมด (พร้อม Auto-seed) และ `POST` สร้างสินค้าใหม่
  - `landing/src/app/api/products/[id]/route.ts`: `GET`, `PUT`, `DELETE` สินค้าตาม ID พร้อมรองรับ `GET /products/<user_id>` ตาม Rubric
- ✅ **Task 6: User Cart API**:
  - `landing/src/app/api/cart/route.ts`: `GET` สินค้าในตะกร้า และ `POST` บันทึกสินค้าลงตะกร้า
  - `landing/src/app/api/cart/[id]/route.ts`: `PUT` อัปเดตจำนวน (quantity) และ `DELETE` ลบสินค้าออกจากตะกร้า
- ✅ **Task 5: E-Commerce UI Components & Cart Context**:
  - `landing/src/contexts/CartContext.tsx`: จัดการ State ตะกร้าสินค้าส่วนกลางตามหลัก `react-crm-lifecycle` พร้อม sync MongoDB และ localStorage
  - `landing/src/components/ecommerce/ProductCard.tsx`: การ์ดสินค้าและปุ่มเพิ่มลงตะกร้า
  - `landing/src/components/ecommerce/ProductList.tsx`: แสดงรายการสินค้าพร้อมตัวกรองหมวดหมู่และช่องค้นหา
  - `landing/src/app/(landings)/(default)/products/page.tsx`: หน้ารวมแพ็กเกจท่องเที่ยว (`/products`)
  - `landing/src/app/(landings)/(default)/products/[id]/page.tsx`: หน้ารายละเอียดสินค้า (`/products/[id]`)
  - `landing/src/app/(landings)/(default)/cart/page.tsx`: หน้าสรุปตะกร้าสินค้า (`/cart`) พร้อมคำนวณยอดเงินและปุ่มไปสู่การชำระเงิน
- ✅ **Task 4: Form Validation & Admin Product Management**:
  - `landing/src/app/(landings)/(default)/admin/products/page.tsx`: หน้า Admin จัดการสินค้า พร้อมระบบ Validation ครบทุกช่อง (Name, Description, Price, Quantity, Date, Tag) และแจ้งเตือน Error Message ที่ชัดเจน
- ✅ **การทดสอบและการตั้งค่า**:
  - สคริปต์ทดสอบ E2E: `landing/scripts/test-sprint2-ecommerce.mjs` ผ่าน 100%
  - Next.js Build: `npm run build` ผ่านสมบูรณ์ทุก Route

---

_เอกสารนี้เขียนขึ้นเพื่อบันทึกประวัติการพัฒนาและการรวมโค้ดเข้าสู่โฟลเดอร์หลัก landing_



