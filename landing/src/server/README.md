# Go Thailand — User Database (MongoDB)

Backend สำหรับระบบผู้ใช้ E-commerce ท่องเที่ยว บน Next.js App Router + Mongoose。

## โครงสร้าง

โค้ด backend อยู่ที่ `src/server/` และ API routes ที่ `src/app/api/auth/`。

```
src/server/
├── db.ts                  connect MongoDB (singleton, ปลอดภัยกับ hot reload)
├── models/
│   ├── User.ts            base schema (ใช้ discriminator)
│   ├── Customer.ts        นักท่องเที่ยว + สมาชิก (แต้ม/คูปอง/ระดับ)
│   └── Admin.ts           ผู้จัดการแพลตฟอร์ม
├── lib/
│   ├── auth.ts            hash password (bcrypt) + JWT sign/verify
│   └── validate.ts        ตรวจ input ลงทะเบียน/ล็อกอิน
└── README.md              ไฟล์นี้

src/app/api/auth/
├── register/route.ts      POST สมัครสมาชิก (customer หรือ admin)
├── login/route.ts         POST ล็อกอิน → คืน JWT
└── me/route.ts            GET โปรไฟล์ (ต้องส่ง Bearer token)
```

## Model: User (base)

เก็บใน collection `users` แยกประเภทด้วย field `role` (discriminator)。

| Field | Type | Note |
|---|---|---|
| email | String | unique, lowercase |
| passwordHash | String | bcrypt, ไม่คืนใน query ปกติ |
| role | 'customer' \| 'admin' | |
| firstName / lastName | String | |
| phone | String? | |
| firebaseUid | String? | ลิงก์ตอนใช้ Firebase Auth |
| emailVerified | Boolean | |
| isActive | Boolean | |
| addresses[] | Address | ที่อยู่จัดส่ง/ใบเสร็จ |

## Model: Customer (เพิ่มจาก User)

| Field | Type | Note |
|---|---|---|
| membershipTier | bronze/silver/gold/platinum | ระดับสมาชิก |
| points | Number | แต้มสะสม |
| coupons[] | {code, discountPercent, expiresAt} | คูปอง |
| preferredLanguage | String | ค่าเริ่มต้น "th" |
| preferredCountry | String? | |
| bookingCount | Number | จำนวนจอง |
| wishlist[] | String[] | id ทัวร์/ที่พักที่สนใจ |

## Model: Admin (เพิ่มจาก User)

| Field | Type | Note |
|---|---|---|
| adminLevel | super/manager/staff | |
| permissions[] | String[] | เช่น "product:write" |
| managedCategories[] | String[] | หมวดที่ดูแล |

## ตัวอย่างการเรียก API

### สมัคร Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tourist@go-thailand.com","password":"password123","firstName":"สมชาย","lastName":"ใจดี"}'
```

### ล็อกอิน
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tourist@go-thailand.com","password":"password123"}'
```

### ดูโปรไฟล์
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## ตั้งค่าก่อนรัน

1. คัดลอก `.env.example` → `.env`
2. กรอก `MONGODB_URI` (MongoDB Atlas หรือ local) และ `JWT_SECRET`
3. รัน `npm run dev` — API จะพร้อมที่ `/api/auth/*`

⚠️ ห้าม commit `.env` (ถูก ignore แล้ว) — ใช้ `.env.example` เป็นแม่แบบเท่านั้น。
