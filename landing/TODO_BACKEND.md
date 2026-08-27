# TODO — สิ่งที่ยังไม่ได้ทำ (User Backend)

โน้ตสถานะของระบบผู้ใช้ E-commerce ท่องเที่ยว (Go Thailand Landing)
อัปเดตล่าสุด: 2026-08-25

---

## ✅ สิ่งที่ทำเสร็จแล้ว

- [x] Mongoose models: `User` (base + discriminator) / `Customer` / `Admin`
- [x] Auth lib: bcrypt hash + JWT sign/verify (อ่านจาก env)
- [x] Input validation (`src/server/lib/validate.ts`)
- [x] API routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- [x] `AuthRegister.tsx` เรียก `/api/auth/register` จริง (แจ้งผลผ่าน Alert)
- [x] `.env.example` + `.env` ถูก gitignore แล้ว
- [x] `next build` ผ่าน

---

## ❌ สิ่งที่ยังไม่ได้ทำ

### 1. ต่อ Firebase Auth
- ตอนนี้ใช้ JWT ธรรมดา (mode MOCK ตามแผนเดิม)
- ยังไม่เชื่อม `firebaseUid` เข้ากับ Firebase Auth จริง
- User model มีฟิลด์ `firebaseUid` รอไว้แล้ว แต่ยังไม่มี flow ผูกบัญชี

### 2. Login UI ยังเป็นจำลอง
- `AuthLogin.tsx` ยังไม่เรียก `/api/auth/login` (แค่ UI)
- `AuthForgotPassword.tsx` / `AuthOtpVerification.tsx` / `AuthNewPassword.tsx` เป็น UI จำลอง
- ต้องแก้ให้เรียก API จริงเหมือน `AuthRegister.tsx`

### 3. Token storage ไม่ปลอดภัย
- ตอนนี้เก็บ JWT ใน `localStorage` (หายเมื่อปิดแท็บ, เสี่ยง XSS)
- ระบบจริงควรใช้ **httpOnly cookie** แทน
- ยังไม่มี middleware ตรวจ token อัตโนมัติ (`src/middleware.ts`)

### 4. ยังไม่มีตารางธุรกิจ
- มีแค่ User — ยังไม่มี `Product` / `Tour` / `Accommodation` / `Booking` / `Cart` / `Order`
- `Customer.bookingCount` / `wishlist` รอข้อมูลจากตารางอื่น

### 5. ไม่มี Automated Test
- ยังไม่มี jest/vitest ทดสอบ API (register/login/me)
- ไม่มี seed script สำหรับ data ตัวอย่าง

### 6. ไม่มี Rate Limiting / Email Verification
- `emailVerified` ถูกเซ็ต false ตอนสมัคร แต่ไม่มีลิงก์ยืนยันส่งไปอีเมล
- ไม่มีป้องกัน brute-force (จำกัดรหัสผ่านผิดหลายครั้ง)

### 7. Admin ยังไม่มีหน้า dashboard
- `Admin` model พร้อมแล้ว แต่ยังไม่มี API จัดการผู้ใช้/สินค้า
- ยังไม่มี role-guard เช็คว่า "เฉพาะ admin เข้าถึงได้"

### 8. Dashboard project แยกต่างหาก
- `JSD13/dashboard` ยังไม่ถูกรวมเข้ามาใน `go-thailand-app-dev/`
- ยังไม่พุชขึ้น GitHub

---

## 👥 แต่ละคนในทีมต้องเอาอะไรไปใช้จากฝั่ง User นี้

ระบบ User (Customer/Admin) ที่สร้างไว้ → แต่ละคนเอาไปต่อยังไง

### Dev A (PO / ติดตั้ง + ต่อ Firebase — GT00, GT12, S2-22)
- เอาโครง `User` model + `.env.example` ไปตั้งค่า env ในเครื่องทุกคนให้เหมือนกัน
- รับผิดชอบต่อ `firebaseUid` → เชื่อม Firebase Auth เข้า User model (ดูข้อ 1 ด้านบน)
- ใช้ `src/server/README.md` อธิบาย API ให้ทีม

### Dev C (ลงทะเบียน / ล็อกอิน / โปรไฟล์ — GT12–GT15, S2-17~S2-20)
- เอา `AuthRegister.tsx` (เรียก API จริงแล้ว) เป็นต้นแบบ
- **ต้องทำต่อ:** แก้ `AuthLogin.tsx` ให้เรียก `/api/auth/login` (ดูข้อ 2)
- เอา field `firstName/lastName/phone/addresses` ไปโชว์ในหน้าโปรไฟล์ (S2-20)
- หน้า Forgot Password ต้องเรียก API reset (ยังไม่มี route → รอทำเพิ่ม)

### Dev D (สินค้า / ตะกร้า / ชำระเงิน — GT06–GT11, S2-12~S2-16)
- เอา `Customer.id` (จาก JWT `sub`) ไปผูกกับ **Cart / Order / Booking**
- ใช้ `Customer.bookingCount` / `wishlist` อัปเดตเมื่อมีการจอง
- ใช้ `Customer.points` / `coupons` ในหน้าชำระเงิน (GT10) ลดราคา
- ⚠️ ต้องรอ Model `Product`/`Booking` สร้างก่อน (ดูข้อ 4)

### Dev E (แบรนด์ / Landing / Dashboard — GT08, GT16–GT18, S2-07~S2-10)
- เอา `AuthRegister.tsx` ไปฝังในหน้า Landing ที่ทำอยู่
- ฝั่ง Dashboard: เอา `Admin` model + role-guard มาเข้าถึงหน้าจัดการ (GT17–GT18)
- ใช้ field `membershipTier` โชว์ป้ายระดับสมาชิกบนหน้าเว็บ

### คนทำ Frontend ทั่วไป (MENG / WA / GUITAR ตามบอร์ด)
- เรียก API ผ่าน `fetch('/api/auth/...')` แบบเดียวกับ `AuthRegister.tsx`
- เก็บ token จาก response แล้วแนบ `Authorization: Bearer <token>` ทุกครั้งที่เรียก API ที่ล็อกอินแล้ว
- อย่า hardcode URL — ใช้ `process.env.NEXT_PUBLIC_SITE_URL`

### กฎร่วมสำหรับทุกคน
- ❌ ห้ามแก้ `src/server/db.ts` ให้ hardcode `MONGODB_URI` → ต้องผ่าน `.env` เท่านั้น
- ❌ ห้าม commit `.env` (มีรหัส DB จริง)
- ✅ ถ้าเพิ่มฟิลด์ User ต้องแก้ทั้ง Model + validation (`validate.ts`) + อัปเดต `src/server/README.md`
- ✅ ทดสอบด้วย curl ตาม `src/server/README.md` ก่อนบอกคนอื่นว่าเสร็จ

---



1. **ห้าม commit `.env`** — ตรวจสอบเสมอด้วย `git check-ignore landing/.env`
2. **JWT_SECRET ต้องยาว random** — สร้างด้วย `openssl rand -base64 48`
3. **MONGODB_URI ใช้ env ไม่ hardcode** — ตามกฎความปลอดภัย
4. ก่อนลาก Done การ์ด Notion ต้องผ่าน checklist: build ผ่าน / เปิดหน้าเว็บไม่พัง / ไม่ลบไฟล์ tech-stack / ข้อความไทยอ่านออก

---

## 📌 ลำดับแนะนำ (ถ้าทำต่อ)

1. แก้ `AuthLogin.tsx` เรียก API จริง
2. เพิ่ม `src/middleware.ts` ตรวจ JWT → เปลี่ยนเป็น httpOnly cookie
3. สร้าง `Product` / `Booking` models (GT06–GT11)
4. เขียน Automated Test สำหรับ auth API
5. ต่อ Firebase (ถ้าต้องการ)

---

_เอกสารนี้เขียนเพื่อไม่ให้ลืมสถานะงาน — อัปเดตทุกครั้งที่มีความคืบหน้า_
