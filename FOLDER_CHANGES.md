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

---

_เอกสารนี้เขียนขึ้นเพื่อบันทึกประวัติการพัฒนาและการรวมโค้ดเข้าสู่โฟลเดอร์หลัก landing_

