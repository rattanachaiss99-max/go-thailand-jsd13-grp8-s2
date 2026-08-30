# User Backend — Go Thailand (MongoDB + Next.js)

เอกสารอธิบายระบบฝั่งผู้ใช้ (User side) ของ Go Thailand E-Commerce
อัปเดตล่าสุด: 2026-08-27

---

## 📁 โครงสร้างไฟล์

```
landing/src/
├── server/
│   ├── db.ts                      ← เชื่อม MongoDB (singleton)
│   ├── models/
│   │   ├── User.ts                ← base schema + discriminator
│   │   ├── Customer.ts            ← สืบทอด User + ฟิลด์สมาชิก/feedback/metadata
│   │   └── Admin.ts               ← สืบทอด User + สิทธิ์แอดมิน
│   ├── lib/
│   │   ├── auth.ts                ← bcrypt hash + JWT sign/verify
│   │   └── validate.ts            ← ตรวจ input ฟอร์ม
│   └── README.md                  ← อธิบาย API เบื้องต้น
├── app/api/
│   ├── auth/register/route.ts     ← POST สมัคร
│   ├── auth/login/route.ts        ← POST ล็อกอิน
│   ├── auth/me/route.ts           ← GET โปรไฟล์ (ใช้ JWT)
│   └── feedback/route.ts          ← POST ให้ลูกค้าส่ง feedback
└── components/auth/AuthRegister.tsx ← ฟอร์มสมัครเรียก API จริง
```

---

## 🗄️ Schema — User (base)

ใช้ Mongoose **Discriminator** แยกเป็น `customer` และ `admin` จาก collection เดียว (`users`)

```ts
// User.ts (base)
{
  email: string (unique, required, lowercase),
  passwordHash: string (required),
  firstName: string,
  lastName: string,
  phone?: string,
  role: 'customer' | 'admin',
  addresses: [{ type: 'home'|'work', detail: string, isDefault: boolean }],
  emailVerified: boolean (default false),
  isActive: boolean (default true),
  createdAt, updatedAt (auto)
}
```

---

## 🗄️ Schema — Customer (สืบทอด User)

```ts
// Customer.ts
{
  ...User,
  role: 'customer',
  membershipTier: 'bronze'|'silver'|'gold'|'platinum' (default 'bronze'),
  points: number (default 0),
  coupons: [{ code, description?, discountPercent?, expiresAt? }],
  preferredLanguage: string (default 'th'),
  preferredCountry?: string,
  bookingCount: number (default 0),
  wishlist?: string[],               // product/tour ids
  feedbacks: [                       // ★ เพิ่มล่าสุด
    { rating: number(1-5), comment?: string, topic?: string, createdAt?: Date }
  ],
  metadata: Map<string, any>         // ★ เพิ่มล่าสุด — เก็บข้อมูลอื่นในอนาคตได้โดยไม่แก้ schema
}
```

**การใช้ `metadata` (ยืดหยุ่นสำหรับอนาคต):**
```ts
const c = await Customer.findById(id);
c.metadata.set('favoriteRegion', 'ภาคเหนือ');
c.metadata.set('newsletterOptIn', true);
await c.save();
// อ่านคืน: c.metadata.get('favoriteRegion')  → 'ภาคเหนือ'
```

**การใช้ `feedbacks`:**
```ts
c.feedbacks.push({ rating: 5, comment: 'ทัวร์สนุก', topic: 'ทัวร์เชียงใหม่' });
await c.save();
```

---

## 🗄️ Schema — Admin (สืบทอด User)

```ts
// Admin.ts
{
  ...User,
  role: 'admin',
  adminLevel: 'staff'|'manager'|'super' (default 'staff'),
  permissions: string[] (default [])
}
```

---

## 🔌 API ฝั่ง User

### POST /api/auth/register
สมัครสมาชิก (customer หรือ admin)
```json
// Request
{ "email":"x@y.com", "password":"***", "firstName":"สมชาย", "lastName":"ใจดี", "role":"customer" }
// Response 201
{ "message":"สมัครสมาชิกสำเร็จ", "token":"<jwt>", "user":{ "id":"...", "email":"x@y.com", "role":"customer" } }
```

### POST /api/auth/login
ล็อกอิน → ได้ JWT
```json
// Request
{ "email":"x@y.com", "password":"***" }
// Response 200
{ "token":"<jwt>", "user":{ "id":"...", "role":"customer" } }
```

### GET /api/auth/me
ดึงโปรไฟล์ (ต้องส่ง Authorization header)
```
GET /api/auth/me
Authorization: Bearer <jwt>
```

### POST /api/feedback  ★ เพิ่มล่าสุด
ลูกค้าส่ง feedback (ต้องล็อกอิน)
```json
// Request
POST /api/feedback
Authorization: Bearer <jwt>
{ "rating": 5, "comment": "ทัวร์สนุกมาก", "topic": "ทัวร์เชียงใหม่" }
// Response 200
{ "message":"บันทึก feedback สำเร็จ", "feedbacks": [ ... ] }
```
⚠️ ตรวจสอบ:
- ต้องมี JWT (ไม่มี → 401)
- `rating` ต้อง 1-5 (ไม่ใช่ → 400)
- ต้องเป็น role `customer` (admin ส่ง → 403)

---

## 🧪 ตัวอย่างทดสอบ (curl)

```bash
# 1. สมัคร
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"c@go-thailand.com","password": "***","firstName":"ลูกค้า","lastName":"ทดสอบ","role":"customer"}'

# 2. ล็อกอิน → เอา token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"c@go-thailand.com","password": "***"}' | jq -r .token)

# 3. ส่ง feedback
curl -X POST http://localhost:3000/api/feedback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"ดีมาก","topic":"แอป"}'
```

---

## 🌱 Seed (ข้อมูลตัวอย่าง)

รันเพื่อเพิ่ม User ตัวอย่างลง DB:
```bash
npm run seed     # สร้าง Customer + Admin ตัวอย่าง (ดู scripts/seed-users.ts)
```
⚠️ ต้องตั้ง `MONGODB_URI` ใน `.env` ก่อน (บัญชีบริษัท)

---

## 🔒 ความปลอดภัย

- รหัสผ่านถูก **hash ด้วย bcrypt** ก่อนเก็บ (ไม่เก็บดิบเด็ดขาด)
- JWT ลงชื่อด้วย `JWT_SECRET` จาก `.env`
- `.env` ถูก `.gitignore` แล้ว → คีย์ไม่รั่วเมื่อพุช
- Token ปัจจุบันเก็บใน `localStorage` ( demo เท่านั้น — ระบบจริงควรใช้ httpOnly cookie ดู `TODO_BACKEND.md`)

---

## 📌 สิ่งที่ยังไม่ทำ (ดู TODO_BACKEND.md)

- [ ] Login UI เรียก API จริง
- [ ] ต่อ Firebase Auth
- [ ] Role-guard / Middleware
- [ ] Automated Test
- [ ] Product / Cart (ไม่อยู่ในสแคปฝั่ง user นี้)

---

_เอกสารนี้สรุปโครงสร้างฝั่ง User (Customer + Admin + Feedback) สำหรับอ้างอิงของทีม_
