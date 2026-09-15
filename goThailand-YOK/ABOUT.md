# Team 8

# GoThailand sprint2

# Accommodation & Car Rental Booking page

เว็บจองที่พัก + จองรถเช่า สไตล์ luxury travel ของไทย เป็น **SPA (Single Page Application)** สร้างด้วย React + Vite ฝั่งหน้าบ้าน และมี Node.js/Express + MongoDB เป็นฝั่งหลังบ้านที่เก็บข้อมูลที่พัก/รถเช่าจริง (ไม่ใช่ไฟล์ mock อีกต่อไป)

โปรเจกต์แบ่งเป็น **2 โฟลเดอร์ที่ทำงานแยกจากกัน**:

- **`frontend/`** — สิ่งที่ผู้ใช้เห็นและกดในเบราว์เซอร์ (React)
- **`backend/`** — ตัวกลางที่คุยกับฐานข้อมูล แล้วส่งข้อมูลเป็น JSON ให้ frontend เรียกใช้ (Express API)

ทั้งสองฝั่งรันเป็นคนละโปรแกรม (คนละ `package.json`, คนละ `node_modules`) และคุยกันผ่าน HTTP เท่านั้น — เอกสารนี้จะอธิบายทีละไฟล์ ทีละฟังก์ชัน ว่าใครเรียกใคร ตัวแปรอะไรสำคัญบ้าง

---

## ภาพรวมระบบ (System Overview) — อ่าน 2 นาทีเข้าใจทั้งระบบ

ลองนึกภาพเวลาเปิดหน้า "รายการที่พัก" ในเว็บ มันเกิดอะไรขึ้นบ้าง เรียงเป็นขั้นบันได:

```
[1] เบราว์เซอร์ (React app ที่รันอยู่ใน frontend/)
        │  เรียก fetch("/api/properties")
        ▼
[2] Vite Dev Server (ตัวรัน frontend ตอน dev, พอร์ต 5173)
        │  เห็น path ขึ้นต้นด้วย /api → "proxy" (ส่งต่อ) ไปที่ backend ทันที
        ▼
[3] Express API Server (backend/server/index.js, พอร์ต 5050)
        │  รับ request ที่ /api/properties เข้า route ที่ตรงกัน
        ▼
[4] MongoDB Atlas (ฐานข้อมูลบนคลาวด์ database ชื่อ "gothailand")
        │  ค้นข้อมูลใน collection "properties" แล้วส่งกลับมาเป็นลิสต์ JSON
        ▼
[3] Express ส่ง JSON กลับไปที่ Vite proxy
        ▼
[2] Vite proxy ส่งต่อกลับไปที่เบราว์เซอร์ เหมือนเป็นคนละหน้าเดียวกัน (ไม่มีปัญหา CORS)
        ▼
[1] React เก็บข้อมูลที่ได้ไว้ใน "CatalogContext" (memory ฝั่ง frontend)
        │
        ▼
   ทุกหน้า/ทุก component เรียกใช้ข้อมูลนี้ผ่าน useCatalog() ได้ทันที
   โดยไม่ต้อง fetch ซ้ำอีก (โหลดครั้งเดียวตอนเปิดแอป)
```

**สรุปสั้นๆ**: frontend ไม่เคย "คุยกับ MongoDB โดยตรง" — มันคุยกับ backend เท่านั้น ส่วน backend คือตัวเดียวที่คุยกับ MongoDB ได้ (นี่คือสถาปัตยกรรมมาตรฐานที่ทุกเว็บใหญ่ๆ ใช้ เพื่อไม่ให้ connection string/รหัสฐานข้อมูลหลุดไปอยู่บนเบราว์เซอร์ของผู้ใช้)

**ข้อควรรู้สำคัญ**: backend มี endpoint 2 กลุ่ม — (1) **ดึงข้อมูล** (`GET /api/cars`, `/api/properties`, `/api/regions`, `/api/masters`) และ (2) **สร้าง/ดึงการจองจริง** (`POST /api/bookings`, `GET /api/bookings/:ref`) ตอนผู้ใช้กด "Confirm Booking" หน้า Checkout จะยิง `POST /api/bookings` ไปที่ backend จริง — **1 คำสั่งจองสามารถมีได้ทั้งที่พัก "และ" รถเช่าพร้อมกันในออเดอร์เดียว** (เพราะตะกร้ารองรับ "อย่างละ 1 รายการพร้อมกัน" ดูหัวข้อ 2.4) backend เป็นคนค้นรถ/ที่พักจาก MongoDB สดๆ คำนวณราคาเอง (ไม่เชื่อราคาที่ frontend ส่งมา) แล้ว **บันทึกลง MongoDB จริง** ใน collection `bookings` (หัวออเดอร์ใบเดียว รวมยอดทุกรายการ) และ `booking_items` (1 เอกสารต่อ 1 รายการที่จอง เช่น จองพร้อมกัน 2 อย่างจะมี 2 เอกสารใน `booking_items` แต่ `booking_ref` เดียวกัน) จากนั้นหน้า Booking Success จะยิง `GET /api/bookings/:ref` **ดึงข้อมูลที่บันทึกไว้จริงกลับมาแสดงครบทุกรายการ** — ดูหัวข้อ 1.2 และ 1.3 ด้านล่าง

---

## Tech Stack

| หมวด            | ใช้                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Frontend         | React 19 + Vite (SPA)                                                                                          |
| Routing          | react-router-dom v7 (`BrowserRouter`)                                                                          |
| Global state     | React Context API (`CatalogContext`, `BookingContext`) — ไม่ใช้ Redux/Zustand                                  |
| Styling          | Plain CSS ไม่มี framework — ใช้ design token (CSS variables) ที่ `frontend/src/styles/theme.css`              |
| Backend          | Node.js + Express 5 (`backend/server/`) — REST API ทั้งดึงข้อมูล (`GET`) และสร้างการจองจริง (`POST /api/bookings`) |
| Database         | MongoDB Atlas (cloud) — database ชื่อ `gothailand`                                                             |
| DB Driver        | `mongodb` (native driver ของ MongoDB เอง ไม่ใช้ Mongoose/ORM)                                                  |
| Dev-only helper  | `concurrently` (รัน frontend+backend พร้อมกันด้วยคำสั่งเดียว), `dotenv` (อ่านไฟล์ `.env`)                     |
| รูปภาพ           | ดาวน์โหลดจาก Unsplash เก็บไว้ใน `frontend/public/images/`                                                      |

---

## เริ่มต้นใช้งาน (Getting Started)

```bash
npm run install:all                    # ติดตั้ง dependencies ทั้ง frontend/ และ backend/ (ครั้งแรกครั้งเดียว)
cp backend/.env.example backend/.env   # copy แล้วใส่ MONGODB_URI ของตัวเองในไฟล์ backend/.env
npm run seed                           # (ทำครั้งแรกครั้งเดียว) ยัดข้อมูล mock เข้า MongoDB จริง
npm run dev:full                       # รัน backend + frontend พร้อมกันด้วยคำสั่งเดียว
```

หลังรัน `npm run dev:full` จะเปิด 2 โปรเซสพร้อมกัน (แยกสีในเทอร์มินัล):
- `API` (สีน้ำเงิน) — backend ที่ `http://localhost:5050`
- `WEB` (สีเขียว) — frontend ที่ `http://localhost:5173`

เปิดเว็บที่ `http://localhost:5173` (ไม่ใช่ 5050 — 5050 คือ backend ที่ตอบกลับเป็น JSON ไม่มีหน้าตาเว็บ)

### รันแยกกันเอง (ถ้าไม่อยากใช้ dev:full)

```bash
cd backend && npm run server     # terminal 1
cd frontend && npm run dev       # terminal 2
```

---

## โครงสร้างโฟลเดอร์ (Project Structure)

```
goThailand-YOK/
├── frontend/                    # ==== ฝั่งที่ผู้ใช้เห็น (React + Vite) ====
│   ├── public/                  # ไฟล์ static ที่ copy ตรงๆ ไม่ผ่าน build (รูปภาพ, favicon)
│   ├── src/
│   │   ├── api/                 # ฟังก์ชัน fetch เรียก backend API
│   │   ├── components/          # ชิ้นส่วน UI ที่ใช้ซ้ำได้หลายหน้า (การ์ด, ปุ่ม, ฟอร์ม)
│   │   ├── config/               # ค่าคงที่ของ UI ล้วนๆ ไม่เกี่ยวกับฐานข้อมูล
│   │   ├── context/              # "คลังข้อมูลกลาง" ที่ทุกหน้าดึงไปใช้ได้ (อธิบายละเอียดด้านล่าง)
│   │   ├── pages/                # แต่ละไฟล์ = แต่ละหน้าเว็บ 1 route
│   │   ├── styles/               # สี/ฟอนต์/CSS ทั้งเว็บ
│   │   ├── App.jsx               # กำหนดว่า path ไหนไปหน้าไหน
│   │   └── main.jsx              # จุดเริ่มต้นแอปทั้งหมด
│   ├── index.html
│   ├── vite.config.js            # ตั้งค่า dev server + proxy /api ไป backend
│   └── package.json
├── backend/                      # ==== ฝั่งที่คุยกับฐานข้อมูล (Express + MongoDB) ====
│   ├── server/
│   │   ├── index.js              # ตัว API หลัก กำหนด route ทั้งหมด
│   │   ├── db.js                 # ตัวเชื่อมต่อ MongoDB (ใช้ร่วมกันทุก route)
│   │   └── bookingBuilder.js     # ประกอบ document `bookings`/`booking_items` + คำนวณราคา (ใช้โดย POST /api/bookings)
│   ├── scripts/
│   │   └── seedMongo.mjs         # สคริปต์ยัดข้อมูล mock เข้า MongoDB (รันครั้งเดียวตอน setup)
│   ├── seed-data/                 # ไฟล์ข้อมูล mock ต้นทาง (เป็นแค่ "วัตถุดิบ" ให้ seed script อ่าน)
│   │   ├── cars.js
│   │   ├── properties.js
│   │   ├── regions.js
│   │   └── masters.js
│   ├── .env                      # (ไม่ commit ขึ้น git) เก็บรหัสลับต่อ MongoDB
│   ├── .env.example              # ตัวอย่างไฟล์ .env ให้เพื่อนในทีม copy ไปใช้
│   └── package.json
└── package.json                  # "รีโมต" กลาง สั่งงาน 2 โฟลเดอร์ข้างบนพร้อมกันได้จาก root
```

> **ทำไม `frontend/` ไม่มี `src/data/` แล้ว?** เดิมข้อมูลที่พัก/รถเช่าเป็นไฟล์ JS อยู่ใน `src/data/` ตอนนี้ย้ายไป `backend/seed-data/` แล้ว เพราะ frontend เลิกอ่านไฟล์พวกนี้โดยตรง เปลี่ยนไปดึงข้อมูลจริงจาก MongoDB ผ่าน API แทน ไฟล์ในโฟลเดอร์นี้เหลือหน้าที่แค่เป็น "ต้นฉบับ" ให้สคริปต์ seed อ่านตอน setup ฐานข้อมูลเท่านั้น

---

# ส่วนที่ 1: Backend (`backend/`) — ตัวกลางที่คุยกับฐานข้อมูล

Backend มี 2 หน้าที่: (1) **เปิดประตู (API) ให้ frontend มาขอข้อมูลแคตตาล็อกได้** โดยไปหยิบข้อมูลจริงจาก MongoDB มาให้ และ (2) **รับคำขอ "จองจริง" จาก frontend แล้วบันทึกลง MongoDB**

## 1.1 `backend/server/db.js` — ตัวเชื่อมต่อ MongoDB

ไฟล์นี้เล็กมาก มีหน้าที่เดียว: **เปิดการเชื่อมต่อ MongoDB ครั้งเดียว แล้วแชร์ connection เดิมให้ทุก route ใช้ร่วมกัน** (ไม่ต้องเปิด-ปิด connection ใหม่ทุกครั้งที่มีคนเรียก API เพราะจะช้าและกินทรัพยากรเกินจำเป็น)

| ชื่อ                | ประเภท    | หน้าที่                                                                                                                                             |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`       | ตัวแปร    | connection string ของ MongoDB (อ่านจาก `backend/.env`) — ถ้าไม่มีค่านี้ โปรแกรมจะโยน error หยุดทำงานทันทีตอนเริ่ม (กันลืมตั้งค่า)                    |
| `DB_NAME`           | ตัวแปร    | ชื่อฐานข้อมูล อ่านจาก `MONGODB_DB_NAME` ใน `.env` ถ้าไม่ตั้งจะ default เป็น `"gothailand"`                                                          |
| `client`            | ตัวแปร    | instance ของ `MongoClient` (ตัวเชื่อมต่อ MongoDB จริง)                                                                                                |
| `dbPromise`         | ตัวแปร    | เก็บผลลัพธ์การเชื่อมต่อไว้ (แบบ cache) — เชื่อมต่อครั้งแรกครั้งเดียว ครั้งต่อไปใช้ตัวเดิมซ้ำ ไม่เชื่อมต่อใหม่                                        |
| **`getDb()`**       | ฟังก์ชัน  | **เรียกใช้จาก**: ทุก route ใน `server/index.js` เรียกฟังก์ชันนี้ก่อนเสมอ เพื่อขอ "ตัวจับฐานข้อมูล" มาใช้ query ข้อมูล — ถ้ายังไม่เคยเชื่อมต่อ จะเชื่อมต่อให้ใหม่ ถ้าเชื่อมต่อไปแล้วจะคืนของเดิมทันที (เร็วกว่า) |

## 1.2 `backend/server/index.js` — ตัว API หลัก (หัวใจของ backend)

ไฟล์นี้เปิดเซิร์ฟเวอร์ Express แล้วกำหนดว่า "ถ้ามีคนเรียก URL แบบนี้ ให้ไปหยิบข้อมูลจาก MongoDB collection ไหน แล้วตอบกลับยังไง"

**ตัวแปร/การตั้งค่าเริ่มต้น:**

| ชื่อ       | ความหมาย                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `PORT`     | พอร์ตที่ server จะรัน อ่านจาก `API_PORT` ใน `.env` ถ้าไม่ตั้งจะ default เป็น `5050`             |
| `app`      | instance ของ Express (ตัวแอปหลักที่รับ-ส่ง HTTP request/response)                              |
| `cors()`   | middleware อนุญาตให้เว็บจากพอร์ตอื่น (frontend) เรียก API นี้ได้ (กันปัญหา CORS)                |
| `express.json()` | middleware แปลง body ของ request ที่เป็น JSON ให้อ่านง่าย — ใช้กับ `POST /api/bookings` ตอนอ่านข้อมูลที่ frontend ส่งมา |

**ฟังก์ชันช่วย:**

| ฟังก์ชัน               | รับอะไร            | ทำอะไร                                                                                                                                                                                | ใครเรียกใช้                                    |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `idMatchQuery(rawId)`    | `rawId` (string จาก URL เช่น `"toyota-yaris"` หรือ `"1"`) | สร้างเงื่อนไขค้นหา MongoDB ที่รองรับ 2 แบบพร้อมกัน: ค้นด้วย `id` (เช่น slug ที่อ่านง่ายอย่าง `"toyota-yaris"`) **หรือ** ค้นด้วย `_id` (เลขล้วนๆ เช่น `9`) — ใช้ `$or` ของ MongoDB | ทุก route ที่รับ `:id` เช่น `/api/cars/:id` |

**Route (endpoint) ทั้งหมด:**

| Method + Path              | ไปหยิบจาก collection ไหน | คืนอะไรกลับไป                                                                                                          |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`                | -                          | `{ status: "ok" }` — ใช้เช็คว่า server ยังไม่ตาย                                                                        |
| `GET /api/cars`               | `cars`                     | รถทั้งหมด เรียงตาม `_id` น้อยไปมาก                                                                                      |
| `GET /api/cars/:id`           | `cars`                     | รถ 1 คันที่ตรงกับ id/slug — ถ้าไม่เจอตอบกลับ `404 { error: "Car not found" }`                                          |
| `GET /api/properties`         | `properties`               | ที่พักทั้งหมด เรียงตาม `_id` น้อยไปมาก                                                                                  |
| `GET /api/properties/:id`     | `properties`               | ที่พัก 1 รายการที่ตรงกับ id/slug — ถ้าไม่เจอตอบกลับ `404`                                                              |
| `GET /api/regions`            | `regions`                  | รายชื่อภาคทั้งหมด (เหนือ/อีสาน/กลาง/ใต้)                                                                                |
| `GET /api/masters`            | `hotelCategories` + `hotelSpecialOptions` | รวมสองอย่างไว้ใน object เดียว `{ hotelCategories: [...], hotelSpecialOptions: [...] }`                       |
| `POST /api/bookings`          | `cars`/`properties` (ค้นหา) → เขียนลง `bookings` + `booking_items` | **สร้างการจองจริง** รับ body `{ cart: { accommodation?, car? }, customerInfo }` — มีได้ 1 หรือ 2 ฟิลด์ใน `cart` พร้อมกัน (ตามที่ตะกร้ามีตอนนั้น) ดูรายละเอียดขั้นตอนที่หัวข้อ 1.3 ด้านล่าง คืน `201 { order, items, ref }` (**`items` เป็น array เสมอ** มี 1 element ถ้าจองอย่างเดียว หรือ 2 elements ถ้าจองพร้อมกันทั้งคู่) |
| `GET /api/bookings/:ref`      | `bookings` + `booking_items`| ดึงการจองที่บันทึกไว้แล้วกลับมาด้วยเลขที่การจอง (`booking_ref`) คืน `{ order, items }` (**`items` เป็น array** — ดึงมาครบทุกรายการที่อยู่ใน order นั้น ด้วย `booking_ref` เดียวกัน) — ถ้าไม่เจอตอบกลับ `404` |

ท้ายไฟล์มี **error-handling middleware** ดักไว้ — ถ้า route ไหนก็ตามเกิด error ระหว่างคุยกับ MongoDB (เช่น เน็ตหลุด, query ผิด) จะไม่ทำให้ server ล่มทั้งตัว แต่จะตอบกลับ `500 { error: "Internal server error" }` แทน แล้ว log error ไว้ดูใน terminal

## 1.3 `backend/server/bookingBuilder.js` — ประกอบ + คำนวณราคาการจองจริง (รองรับหลายรายการต่อออเดอร์)

ไฟล์นี้ถูกเรียกจาก route `POST /api/bookings` เท่านั้น หน้าที่ของมันคือ **แปลง "ความตั้งใจจอง" (จองรถ/ที่พักไหน วันไหน กี่คน) ให้กลายเป็น document ที่พร้อมบันทึกลง MongoDB ตาม schema ของทีม** — ทำฝั่ง backend (ไม่ใช่ frontend) เพราะต้องการให้ **backend เป็นคนคำนวณราคาเอง** จากข้อมูลรถ/ที่พักที่ดึงมาจาก MongoDB สดๆ แทนที่จะเชื่อตัวเลขราคาที่ frontend ส่งมา (กันกรณีมีคนแก้ราคาในเบราว์เซอร์แล้วส่งมาโกง)

**สำคัญ**: ตอนนี้ 1 ออเดอร์ (`bookings` 1 เอกสาร) สามารถมี `booking_items` ได้มากกว่า 1 ชิ้น (เช่น จองที่พัก + รถเช่าพร้อมกัน) — ไฟล์นี้จึงแยกฟังก์ชัน "สร้างเลขที่ออเดอร์" ออกจาก "สร้าง item แต่ละชิ้น" และ "ประกอบหัวออเดอร์" เพื่อให้ route `POST /api/bookings` เรียกวนลูปสร้าง item กี่ชิ้นก็ได้ แล้วค่อยรวมยอดมาใส่หัวออเดอร์ทีเดียว

**ฟังก์ชันช่วย (internal):**

| ฟังก์ชัน                      | รับอะไร                          | ทำอะไร                                                                                     |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `diffDays(fromISO, toISO)`      | วันที่เริ่ม, วันที่สิ้นสุด (string) | คำนวณจำนวนวัน/คืนระหว่าง 2 วันที่ — ขั้นต่ำ 1 เสมอ                                             |
| `generateRandomRef(prefix)`     | คำนำหน้า เช่น `"GT"`                | สุ่มเลขที่การจอง เช่น `GT-2609-XK3P9`                                                          |
| `PAYMENT_METHOD_MAP`            | object (ค่าคงที่)                    | ตาราง map ชื่อวิธีจ่ายจากฟอร์ม (`"Card"`/`"Bank"`/`"QR"`) → ค่าตาม schema (`"credit_card"` ฯลฯ) |
| `resolvePaymentMethod(customerInfo)` | object ข้อมูลลูกค้า            | ใช้ `PAYMENT_METHOD_MAP` แปลงวิธีจ่ายที่ลูกค้าเลือกในฟอร์มให้ตรงกับค่าที่ schema ต้องการ         |

**ฟังก์ชันหลัก (เรียกจาก `server/index.js`):**

| ฟังก์ชัน                                                    | รับอะไร                                                | ทำอะไร                                                                                                                                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generateOrderRef()`                                            | -                                                           | สร้างเลขที่การจอง **1 เลขต่อ 1 ครั้งที่กด Confirm Booking** (ไม่ว่าจะจองกี่ประเภทพร้อมกัน) — ทุก item ในออเดอร์เดียวกันใช้เลขนี้ร่วมกัน (`booking_ref` เดียวกัน) ให้ backend เรียกครั้งเดียวก่อนวน build item |
| `buildCarItem({ cartCar, customerInfo, car, orderId, ref, itemId })` | `cartCar` (ฟิลด์วันรับ-คืนรถจาก `cart.car`), `customerInfo`, `car` (document ที่ query จาก MongoDB), `orderId`/`ref` (มาจาก `generateOrderRef()`), `itemId` (เลขลำดับ item ในออเดอร์) | คำนวณจำนวนวันเช่า × `daily_rate` ประกอบเป็น `item` เดียว (schema `booking_items`, มี `car_snapshot`/`driver_info`/`pricing`/`payment_info` ฯลฯ) คืน `{ item, subtotal, tax, total }` — **ไม่ได้สร้าง order header** (แยกไปที่ `buildOrderHeader`) |
| `buildAccommodationItem({ cartAccommodation, customerInfo, property, room, orderId, ref, itemId })` | เหมือนกันแต่สำหรับที่พัก + `room` (ห้องที่เลือกจาก `property.rooms`) | คำนวณ (ราคาห้อง/คืน × จำนวนคืน × จำนวนห้อง) + ค่าบริการ 500 + ภาษี 5% ประกอบเป็น `item` เดียว (schema `booking_items`, มี `accommodation_snapshot`/`guest_details`/`pricing_breakdown`) คืน `{ item, subtotal, tax, total }` |
| `buildOrderHeader({ orderId, ref, customerInfo, subtotal, tax, total })` | ตัวเลขยอดรวม (บวกมาจากทุก item แล้ว) + `customerInfo`  | ประกอบ document หัวออเดอร์เดียว (schema `bookings`) — เรียก **หลัง** วน build item ครบทุกชิ้นแล้ว เพราะต้องรวมยอดจากทุก item ก่อน                                          |

**flow การใช้งานจริงใน `server/index.js`**: (1) เรียก `generateOrderRef()` ครั้งเดียว → ได้ `orderId`/`ref`, (2) ถ้า `cart.car` มีค่า → เรียก `buildCarItem(...)`, ถ้า `cart.accommodation` มีค่า → เรียก `buildAccommodationItem(...)` (เรียกได้ทั้งคู่ถ้าตะกร้ามีทั้งสองอย่าง) เก็บผลลัพธ์แต่ละอันไว้ใน array `items`, (3) รวม `subtotal`/`tax`/`total` จากทุก item เข้าด้วยกัน แล้วเรียก `buildOrderHeader(...)` ได้ `order`, (4) `insertOne(order)` ลง `bookings` และ `insertMany(items)` ลง `booking_items` แล้วส่ง `{ order, items, ref }` กลับไปให้ frontend (ไม่ต้อง fetch ซ้ำ)

## 1.4 `backend/scripts/seedMongo.mjs` — สคริปต์ยัดข้อมูลเริ่มต้นเข้า MongoDB

ใช้แค่ **ตอน setup ครั้งแรก** (หรือตอนอยากรีเซ็ตข้อมูลกลับไปเป็นค่าเริ่มต้น) รันด้วย `npm run seed`

**ทำงานตามลำดับนี้:**

1. อ่านค่า `MONGODB_URI` และ `MONGODB_DB_NAME` จาก `.env` — ถ้าไม่มี `MONGODB_URI` จะพิมพ์เตือนแล้วหยุดทันที
2. import ข้อมูลดิบจากไฟล์ในโฟลเดอร์ `backend/seed-data/` (`cars`, `properties`, `regions`, `hotelCategories`, `hotelSpecialOptions`)
3. เก็บทั้ง 5 อย่างไว้ใน object ชื่อ `collections` — key คือชื่อ collection ที่จะสร้างใน MongoDB, value คือ array ข้อมูล
4. เชื่อมต่อ MongoDB แล้ว **วนลูปทีละ collection**: ลบของเก่าทั้งหมดใน collection นั้นทิ้งก่อน (`deleteMany({})`) แล้วค่อยใส่ข้อมูลใหม่ทั้งหมดเข้าไป (`insertMany(...)`)
5. ปิดการเชื่อมต่อ พิมพ์สรุปจำนวน document ที่ใส่ไปในแต่ละ collection

> รันซ้ำได้ปลอดภัย (idempotent) เพราะขั้นตอนที่ 4 ลบของเก่าก่อนใส่ใหม่เสมอ ไม่มีข้อมูลซ้ำซ้อนสะสม

## 1.5 `backend/seed-data/*.js` — ข้อมูลต้นฉบับ (วัตถุดิบให้ seed script)

ไฟล์กลุ่มนี้ **ไม่ได้ถูกเรียกใช้จาก frontend หรือจาก API ใดๆ ทั้งสิ้น** — มีหน้าที่เดียวคือเป็นแหล่งข้อมูลให้ `seedMongo.mjs` อ่านตอน setup เท่านั้น

### `cars.js`

| ชื่อ                        | ประเภท     | หน้าที่                                                                                                                                                      |
| --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `galleryFor(mainImage)`     | ฟังก์ชัน   | รับรูปหลัก 1 รูป แล้วคืน array รูป 4 รูป (รูปหลักซ้ำ + รูปภายในรถ + รูปท้ายรถ) เพื่อให้ทุกคันมีแกลเลอรีอย่างน้อย 4 รูปโดยไม่ต้องหารูปจริงทุกมุม            |
| `buildCar({...})`           | ฟังก์ชัน   | "โรงงานสร้างรถ 1 คัน" — รับพารามิเตอร์ดิบๆ เช่น `brand`, `model`, `dailyRate`, `seats` แล้วประกอบเป็น object เต็มรูปแบบตาม schema จริงที่จะเก็บใน MongoDB (มี `registration_and_license`, `specs`, `reviews_summary` ฯลฯ ซ้อนกันเป็นชั้นๆ) |
| `cars`                      | array      | ผลลัพธ์จากการเรียก `buildCar()` 6 ครั้ง = รถ 6 คัน — **นี่คือตัวที่ seed script เอาไปใส่ MongoDB collection `cars`**                                        |
| `carTypes`, `pickupLocations`, `getCarById()` | (เหลืออยู่ในไฟล์) | เป็น export เก่าที่ frontend เคยใช้ตอนยังอ่าน mock file ตรงๆ **ตอนนี้ไม่มีใครเรียกใช้แล้ว** (frontend มีของตัวเองใน `CatalogContext` แทน) — ปล่อยไว้เฉยๆ ไม่กระทบอะไร |

### `properties.js`

| ชื่อ                           | ประเภท     | หน้าที่                                                                                                                                    |
| ------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `imagesFor(id)`                 | ฟังก์ชัน   | สร้าง path รูปภาพ 5 รูปจาก id ที่พัก (เช่น `/images/siam-heritage-sanctuary/1.jpg` ... `5.jpg`)                                              |
| `makeLocation(...)`             | ฟังก์ชัน   | ประกอบข้อมูลตำแหน่งที่ตั้ง (เมือง, เขต, พิกัด, สถานที่ใกล้เคียง) เป็น object เดียว                                                          |
| `buildAccommodation({...})`     | ฟังก์ชัน   | "โรงงานสร้างที่พัก 1 แห่ง" เหมือน `buildCar` แต่สำหรับที่พัก — ใส่ `rooms[]`, `facilities[]`, `pricing_rules[]` ฯลฯ ตาม schema             |
| `properties`                    | array      | ผลลัพธ์จาก `buildAccommodation()` 14 ครั้ง = ที่พัก 14 แห่ง (กลาง 5, เหนือ 3, อีสาน 3, ใต้ 3) — **สิ่งที่ seed เข้า collection `properties`** |
| `getPropertyById()`, `getOtherProperties()`, `facilityKeywords`, `bedroomOptions`, `renovationOptions` | (เหลืออยู่ในไฟล์) | export เก่าเช่นกัน ไม่มีใครเรียกใช้แล้ว — ตัวที่ frontend ใช้จริงตอนนี้คือของใน `CatalogContext` (สำหรับ `getPropertyById`/`getOtherProperties`) และ `frontend/src/config/propertyFilters.js` (สำหรับ `bedroomOptions`/`renovationOptions`) |

### `masters.js`

| ชื่อ                   | ประเภท | หน้าที่                                                                          |
| ----------------------- | ------ | ----------------------------------------------------------------------------------- |
| `hotelCategories`       | array  | 3 หมวดหมู่ที่พัก (Private Villa, Luxury Hotel, B&B) — seed เข้า collection ชื่อเดียวกัน |
| `hotelSpecialOptions`   | array  | 4 ตัวเลือกพิเศษ (Breakfast, Private Pool, Beach Front, Free Cancellation) — seed เข้า collection ชื่อเดียวกัน |

### `regions.js`

| ชื่อ                   | ประเภท   | หน้าที่                                                                 |
| ----------------------- | -------- | ---------------------------------------------------------------------- |
| `regions`               | array    | 4 ภาคของไทย (north/isan/central/south) พร้อมชื่อไทย+อังกฤษ — seed เข้า collection `regions` |
| `getRegionLabel(id)`    | ฟังก์ชัน | เหลืออยู่ในไฟล์แต่ไม่มีใครเรียกใช้แล้ว (frontend มีของตัวเองใน `CatalogContext`) |

---

# ส่วนที่ 2: Frontend (`frontend/`) — สิ่งที่ผู้ใช้เห็นและกด

## 2.1 แอปเริ่มทำงานยังไง (`main.jsx`)

ทุกอย่างเริ่มจากไฟล์นี้ ห่อ component เป็นชั้นๆ แบบนี้ (จากนอกสุดเข้าไปในสุด):

```
<BrowserRouter>                 ← เปิดใช้การเปลี่ยนหน้าแบบ SPA (ไม่ reload หน้าเว็บ)
  <CatalogProvider>             ← ①  ดึงข้อมูล cars/properties/regions/masters จาก API ก่อน
    <BookingProvider>           ← ②  เตรียม state การจอง (ใช้ข้อมูลจาก ① เป็นค่าเริ่มต้น)
      <App />                   ← ③  ทุกหน้าเว็บ/ทุก route อยู่ในนี้
    </BookingProvider>
  </CatalogProvider>
</BrowserRouter>
```

**สำคัญมาก**: `CatalogProvider` (①) จะ **ไม่ยอม render ลูกๆ ของมัน** จนกว่าจะโหลดข้อมูลจาก backend สำเร็จ ระหว่างรอจะโชว์ข้อความ "Loading GoThailand…" แทน วิธีนี้ทำให้ทุกหน้าเว็บด้านในมั่นใจได้ 100% ว่าตอนมัน render ข้อมูล (เช่น `cars`, `properties`) พร้อมใช้งานแล้วเสมอ ไม่ต้องเขียนโค้ดเช็ค "ข้อมูลยังโหลดไม่เสร็จ" ซ้ำในทุกหน้า

## 2.2 `frontend/src/api/client.js` — ตัวเรียก backend

ไฟล์เล็กๆ ที่ห่อคำสั่ง `fetch()` ให้ใช้ง่ายขึ้น ไม่ต้องเขียน `fetch(...)` ซ้ำๆ ทั่วโปรเจกต์

| ชื่อ                | ประเภท     | หน้าที่                                                                                                                                  |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_BASE`           | ตัวแปร     | ที่อยู่ต้นทางของ API ปกติเป็น `"/api"` (จะถูก Vite proxy ไปที่ backend อัตโนมัติตอน dev) — เปลี่ยนได้ด้วย env var `VITE_API_BASE_URL`     |
| `getJSON(path)`      | ฟังก์ชัน   | ฟังก์ชันกลาง: ยิง `fetch()` ไปที่ `API_BASE + path` แล้วแปลงผลลัพธ์เป็น JSON — ถ้า response ไม่ ok (เช่น 404/500) จะโยน error ออกไปทันที |
| `fetchCars()`        | ฟังก์ชัน   | เรียก `getJSON("/cars")` → คืนรถทั้งหมด                                                                                                    |
| `fetchProperties()`  | ฟังก์ชัน   | เรียก `getJSON("/properties")` → คืนที่พักทั้งหมด                                                                                          |
| `fetchRegions()`     | ฟังก์ชัน   | เรียก `getJSON("/regions")` → คืนรายชื่อภาค                                                                                                |
| `fetchMasters()`     | ฟังก์ชัน   | เรียก `getJSON("/masters")` → คืน `{ hotelCategories, hotelSpecialOptions }`                                                               |
| `postJSON(path, body)` | ฟังก์ชัน | ฟังก์ชันกลางฝั่ง POST: ยิง `fetch()` แบบ `method: "POST"` พร้อม `body` เป็น JSON — ถ้า response ไม่ ok จะโยน error พร้อมข้อความจาก backend (ถ้ามี) |
| `createBooking(payload)` | ฟังก์ชัน | เรียก `postJSON("/bookings", payload)` → **สร้างการจองจริง** คืน `{ order, items, ref }` (`items` เป็น array) |
| `fetchBookingByRef(ref)` | ฟังก์ชัน | เรียก `getJSON(\`/bookings/${ref}\`)` → ดึงการจองที่บันทึกไว้แล้วกลับมา คืน `{ order, items }` (`items` เป็น array) |

**ใครเรียกไฟล์นี้**: `CatalogContext.jsx` เรียก `fetchCars`/`fetchProperties`/`fetchRegions`/`fetchMasters`, `BookingContext.jsx` เรียก `createBooking` (ใน `confirmBooking()`), และ `BookingSuccess.jsx` เรียก `fetchBookingByRef` โดยตรง (หน้าอื่นไม่ต้องรู้จักไฟล์นี้เลย เพราะดึงข้อมูลผ่าน `useCatalog()`/`useBooking()` อีกที)

## 2.3 `frontend/src/context/CatalogContext.jsx` — คลังข้อมูล "แคตตาล็อกสินค้า"

นี่คือไฟล์ใหม่ที่สำคัญที่สุดของการเชื่อมต่อ MongoDB เข้ากับหน้าเว็บ หน้าที่ของมันคือ **โหลดข้อมูลทั้งหมดจาก backend ครั้งเดียวตอนเปิดแอป แล้วแจกจ่ายให้ทุกหน้าใช้** (ไม่ต้อง fetch ซ้ำทุกครั้งที่เปลี่ยนหน้า)

**State ภายใน (`state`) — เก็บด้วย `useState`:**

| field               | ประเภท          | ความหมาย                                                                                          |
| -------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| `status`             | string          | `"loading"` (กำลังโหลด) / `"ready"` (โหลดเสร็จ ใช้งานได้) / `"error"` (โหลดไม่สำเร็จ)                 |
| `error`               | string \| null  | ข้อความ error ถ้าโหลดไม่สำเร็จ (เช่น backend ไม่ได้เปิด)                                             |
| `cars`               | array           | รถทั้งหมดที่ได้จาก `GET /api/cars`                                                                    |
| `properties`         | array           | ที่พักทั้งหมดที่ได้จาก `GET /api/properties`                                                         |
| `regions`            | array           | รายชื่อภาคที่ได้จาก `GET /api/regions`                                                               |
| `hotelCategories`    | array           | หมวดหมู่ที่พักที่ได้จาก `GET /api/masters`                                                            |
| `hotelSpecialOptions`| array           | ตัวเลือกพิเศษที่ได้จาก `GET /api/masters`                                                            |

**ขั้นตอนการทำงาน (`useEffect` ที่รันตอน component นี้เกิดขึ้นครั้งแรก):**

1. ตั้ง `status` เป็น `"loading"`
2. ยิง 4 คำขอพร้อมกัน (`fetchCars`, `fetchProperties`, `fetchRegions`, `fetchMasters`) ด้วย `Promise.all` (เร็วกว่ายิงทีละอัน เพราะรอพร้อมกันแทนที่จะรอเรียงคิว)
3. ถ้าสำเร็จหมดทุกอัน → เซฟผลลัพธ์ทั้งหมดลง state, ตั้ง `status = "ready"`
4. ถ้าอันใดอันหนึ่ง fail (เช่น backend ปิดอยู่) → ตั้ง `status = "error"` พร้อมข้อความ error

**ฟังก์ชันช่วยที่คำนวณจากข้อมูลที่โหลดมา (ไม่ได้ fetch ใหม่ แค่กรอง/ค้นข้อมูลที่มีอยู่แล้ว):**

| ฟังก์ชัน/ตัวแปร                        | รับอะไร                      | ทำอะไร                                                                                                    |
| ---------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `carTypes`                               | -                              | ดึงประเภทรถที่ไม่ซ้ำกันจาก `cars` (เช่น `["SUV", "Economy", "Sedan", ...]`) ใช้เป็นตัวเลือกกรองรถ         |
| `facilityKeywords`                       | -                              | ดึง keyword สิ่งอำนวยความสะดวกที่ไม่ซ้ำกันจาก `properties` ทั้งหมด เรียงตามตัวอักษร ใช้เป็น checkbox กรองที่พัก |
| `getCarById(id)`                         | `id` (string หรือ number)      | หารถ 1 คันจาก `cars` ที่ตรงกับ `_id` หรือ `id` — คืน `undefined` ถ้าไม่เจอ                                |
| `getPropertyById(id)`                    | `id`                            | หาที่พัก 1 แห่งจาก `properties` ที่ตรงกับ `_id` หรือ `id`                                                 |
| `getOtherProperties(excludeId, count=3)` | `excludeId`, จำนวนที่ต้องการ  | คืนที่พักอื่นๆ (ไม่ใช่ที่เลือกไว้) จำนวน `count` รายการ — ใช้ในโซน "You might also like"                  |
| `getRegionLabel(regionId)`               | `regionId` เช่น `"central"`    | คืนชื่อภาคภาษาไทย เช่น `"ภาคกลาง"` — คืนสตริงว่างถ้าไม่เจอ                                                |
| `pickupLocations`                        | -                              | รายชื่อจุดรับ-คืนรถ 4 จุด — **เป็นค่าคงที่ hardcode ไว้ในไฟล์นี้เลย ไม่ได้ดึงจาก MongoDB** (เพราะเป็นแค่ตัวเลือก UI ไม่ใช่ "ข้อมูลธุรกิจ" ที่ต้องเก็บในฐานข้อมูล) |

**สิ่งที่แจกจ่ายออกไปผ่าน `useCatalog()`** (เรียกใช้จากไฟล์ไหนก็ได้ที่อยู่ภายใต้ `<CatalogProvider>`): รวมทุกอย่างข้างบน (`status`, `error`, `cars`, `properties`, `regions`, `hotelCategories`, `hotelSpecialOptions`, `pickupLocations`, `carTypes`, `facilityKeywords`, `getCarById`, `getPropertyById`, `getOtherProperties`, `getRegionLabel`)

## 2.4 `frontend/src/context/BookingContext.jsx` — คลังข้อมูล "ตะกร้า/การจองปัจจุบัน"

ถ้า `CatalogContext` คือ "แคตตาล็อกสินค้าทั้งหมด" `BookingContext` คือ **"ตะกร้าที่ลูกค้ากำลังเลือกอยู่ตอนนี้"** — ครอบคลุมทั้ง flow จองที่พัก **และ** จองรถเช่า **พร้อมกันในตะกร้าเดียว** (ไม่ใช่สลับโหมดแบบเดิมอีกต่อไป)

> **สถาปัตยกรรมตะกร้า (สำคัญ — เปลี่ยนจากเดิม)**: ตะกร้าออกแบบให้รับได้ **ทุกประเภท (รถ/ที่พัก/ไกด์ในอนาคต) พร้อมกัน แต่จำกัดที่ "อย่างละ 1 รายการ"** — เช่น มีรถเช่าในตะกร้าได้สูงสุด 1 คัน + ที่พักได้สูงสุด 1 ที่พร้อมกันในเวลาเดียวกัน ถ้าผู้ใช้กด "Book Now" เลือกที่พัก/รถอีกอันหนึ่งขณะที่มีของประเภทเดียวกันอยู่ในตะกร้าแล้ว **ของเก่าประเภทนั้นจะถูกแทนที่ด้วยของใหม่ทันที** (ไม่ใช่เพิ่มเป็นรายการที่ 2) ส่วนของต่างประเภทกัน (เช่น มีรถอยู่แล้ว แล้วเพิ่มที่พัก) จะ **อยู่ร่วมกันได้** ไม่ทับกัน ดูรายละเอียด state ด้านล่าง

> ไฟล์นี้เรียก `useCatalog()` ก่อนเป็นอันดับแรกเสมอ (บรรทัดแรกในฟังก์ชัน) เพื่อขอยืม `properties`, `cars`, `getPropertyById`, `getCarById`, `pickupLocations` มาใช้ตั้งค่าเริ่มต้นและค้นหาข้อมูล — เพราะแบบนี้ `BookingProvider` ต้องอยู่ **ข้างใน** `CatalogProvider` เสมอ (ดู 2.1) ไม่งั้นจะไม่มีข้อมูลให้ใช้

**ฟังก์ชันช่วย (ไม่เกี่ยวกับ state โดยตรง แค่คำนวณวันที่):**

| ฟังก์ชัน                     | รับอะไร                    | ทำอะไร                                                                                       |
| ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `toISODate(date)`              | `Date` object                | แปลงเป็นสตริงรูปแบบ `YYYY-MM-DD` (ใช้กับ `<input type="date">`)                                |
| `addDays(isoDate, days)`       | สตริงวันที่, จำนวนวัน        | บวกวันที่เพิ่ม แล้วคืนสตริงวันที่ใหม่                                                          |
| `diffDays(fromISO, toISO)`     | วันที่เริ่ม, วันที่สิ้นสุด    | คำนวณจำนวนวัน/คืนระหว่าง 2 วันที่ ขั้นต่ำ 1 เสมอ (ใช้คำนวณทั้ง `nights` และ `carDays`)          |
| `buildDefaultCart(properties, cars, pickupLocations)` | ข้อมูลจาก `useCatalog()` | สร้าง object ตะกร้าเริ่มต้น — คืน `{ accommodation: {...}, car: {...} }` ทั้งสองฟิลด์มีค่า default เสมอ (ที่พัก/รถคันแรกในลิสต์, วันนี้ถึงอีก 3 วัน) แต่ `inCart: false` ทั้งคู่ ใช้ตอนเปิดแอปครั้งแรก/ตอนกด reset |

**State หลัก (`cart`) — แยกเป็น 2 ช่องคงที่ `cart.accommodation` และ `cart.car` (ไม่มีวัน `null` ทั้งคู่ เพื่อไม่ต้องเช็ค null ทั่ว component tree) แต่ละช่องมี field `inCart: boolean` เป็นตัวบอกว่า "อยู่ในตะกร้าจริงหรือแค่กำลังดู/พรีวิวอยู่":**

| field                | ประเภท   | อยู่ที่                              | ความหมาย                                                                            |
| --------------------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `inCart`               | boolean  | `cart.accommodation`, `cart.car`      | `true` = ผู้ใช้กด Book Now/Reserve คอมมิทเข้าตะกร้าแล้วจริงๆ, `false` = แค่ข้อมูล draft ตอนกำลังดูหน้า Detail (ยังไม่ commit) |
| `propertyId`           | string   | `cart.accommodation`                  | id ที่พักที่กำลังเลือกอยู่                                                              |
| `roomTypeId`           | string   | `cart.accommodation`                  | id ประเภทห้องที่เลือกในที่พักนั้น                                                        |
| `checkIn` / `checkOut` | string   | `cart.accommodation`                  | วันที่เข้าพัก/ออก (`YYYY-MM-DD`)                                                        |
| `guests`               | object   | `cart.accommodation`                  | `{ adults, children }` จำนวนผู้เข้าพัก                                                  |
| `rooms`                | number   | `cart.accommodation`                  | จำนวนห้องที่จอง                                                                          |
| `carId`                | string   | `cart.car`                            | id รถที่กำลังเลือกอยู่                                                                   |
| `pickupLocation` / `dropoffLocation` | string | `cart.car`               | จุดรับ/คืนรถ                                                                       |
| `pickupDate` / `dropoffDate`        | string | `cart.car`                 | วันรับ/คืนรถ                                                                        |
| `pickupTime` / `dropoffTime`        | string | `cart.car`                 | เวลารับ/คืนรถ                                                                       |

**Field อื่นๆ ที่แจกจ่ายผ่าน `useBooking()` (คำนวณมาจาก `cart` ด้านบนอีกที):**

| ชื่อ                     | ประเภท          | มาจากไหน                                                                                     |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| `selectedProperty`         | object          | หาที่พักเต็มรายการจาก `cart.accommodation.propertyId` ด้วย `getPropertyById()`                 |
| `selectedRoom`              | object \| null  | ห้องที่เลือกอยู่ ภายใน `selectedProperty.rooms`                                                |
| `selectedCar`               | object          | หารถเต็มรายการจาก `cart.car.carId` ด้วย `getCarById()`                                          |
| `nights`                    | number          | จำนวนคืน คำนวณจาก `cart.accommodation.checkIn`/`checkOut`                                       |
| `carDays`                   | number          | จำนวนวันเช่ารถ คำนวณจาก `cart.car.pickupDate`/`dropoffDate`                                     |
| `hasAccommodationInCart`    | boolean         | shortcut ของ `cart.accommodation.inCart` — ใช้ guard/render แบบเงื่อนไขในหลายหน้า               |
| `hasCarInCart`              | boolean         | shortcut ของ `cart.car.inCart`                                                                    |
| `customer`                  | object \| null  | ข้อมูลลูกค้าจากฟอร์ม Checkout (`null` จนกว่าจะกด Confirm)                                      |
| `bookingRef`                | string \| null  | เลขที่การจอง — ใช้เป็นเงื่อนไข guard ห้ามเข้าหน้า Success ตรงๆ                                 |
| `confirmedOrder`            | object \| null  | ข้อมูล order header (schema `bookings`) หลังกด Confirm — **มีแค่ 1 ต่อออเดอร์เสมอ** |
| `confirmedItems`            | array           | ข้อมูลรายการจองทั้งหมด (schema `booking_items`) หลังกด Confirm — **เป็น array เสมอ** มี 1 หรือ 2 elements ขึ้นกับว่าจองกี่ประเภท (เปลี่ยนจาก `confirmedItem` เดิมที่เป็น object เดี่ยว) |
| `guestLimits`               | object          | ขอบเขต min/max: `{ adults: [1,10], children: [0,6], rooms: [1,6] }`                            |
| `todayISO`                  | string          | วันนี้ในรูปแบบ `YYYY-MM-DD` ใช้เป็น `min` ของ input date                                       |

**ฟังก์ชันที่หน้าเว็บเรียกใช้ผ่าน `useBooking()`:**

| ฟังก์ชัน                          | รับอะไร                        | ทำอะไร                                                                                                                      | ใครเรียก (หน้าไหน)                    |
| ------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `previewProperty(propertyId, roomTypeId?)` | id ที่พัก, id ห้อง (ไม่ใส่ก็ได้) | **ไม่ commit เข้าตะกร้า** — แค่อัปเดตฟิลด์ใน `cart.accommodation` ให้ตรงกับที่พักที่กำลังดูอยู่ (ไม่แตะ `inCart`) ใช้ตอนเปิดหน้า Detail/คลิกลิงก์ View Details/Show on map เพื่อให้ฟอร์มวันที่/จำนวนคนในหน้านั้นแก้ไขได้ทันทีโดยยังไม่ถือว่าจองจริง | `AccommodationDetail` (mount effect), `PropertyCard` (View Details/Show on map) |
| `selectProperty(propertyId, roomTypeId?)` | id ที่พัก, id ห้อง (ไม่ใส่ก็ได้) | เรียก `previewProperty` ก่อน แล้ว **commit จริง**: ตั้ง `cart.accommodation.inCart = true` เคลียร์ `confirmedOrder`/`confirmedItems`/`bookingRef` เก่าทิ้ง (ไม่กระทบ `cart.car` เลย) | `AccommodationDetail`/`PropertyCard` (ตอนกด Book Now) |
| `selectRoomType(roomTypeId)`         | id ประเภทห้อง                    | แค่เปลี่ยนห้องที่เลือกใน `cart.accommodation.roomTypeId` ไม่กระทบอย่างอื่น                                                    | `AccommodationDetail` (ตอนคลิกเลือกห้อง) |
| `selectCar(carConfig)`               | object รายละเอียดการเช่ารถ       | ตั้ง `cart.car.inCart = true` พร้อม field อื่นๆ ที่ส่งมา เคลียร์ `confirmedOrder`/`confirmedItems`/`bookingRef` เก่าทิ้ง (ไม่กระทบ `cart.accommodation` เลย) | `CarDetail` (ตอนกด Book Now)              |
| `removeFromCart(type)`               | `"accommodation"` หรือ `"car"`   | ตั้ง `cart[type].inCart = false` — เอาของประเภทนั้นออกจากตะกร้า (ไม่กระทบอีกประเภทที่เหลืออยู่)                                | `BookingCart` (ปุ่ม Remove)                |
| `updateDates(patch)`                 | object เช่น `{ checkIn, checkOut }` | แก้วันที่ที่พักใน `cart.accommodation` — ถ้าวันเข้าพักเลื่อนจนเลยวันออก จะเลื่อนวันออกตามให้อัตโนมัติ (กันวันที่ผิดตรรกะ)  | `DateRangeFields` (ใช้ภายใน Detail/Cart)  |
| `updateCarDates(patch)`              | object เช่น `{ pickupDate, dropoffDate }` | แก้วันรับ-คืนรถใน `cart.car` เหมือน `updateDates` แต่สำหรับรถ                                                          | `BookingCart` (โหมดแก้ไข)                 |
| `changeGuestCount(field, delta)`     | `"adults"`/`"children"`, `+1`/`-1` | เพิ่ม/ลดจำนวนผู้เข้าพักใน `cart.accommodation.guests` จำกัดไม่ให้เกิน `guestLimits`                                          | `GuestRoomSelector`                        |
| `changeRoomCount(delta)`             | `+1`/`-1`                        | เพิ่ม/ลดจำนวนห้องใน `cart.accommodation.rooms` จำกัดไม่ให้เกิน `guestLimits.rooms`                                           | `GuestRoomSelector`                        |
| `confirmBooking(customerInfo)` (**async**) | object ข้อมูลลูกค้าจากฟอร์ม | **ฟังก์ชันสำคัญที่สุด** — ประกอบ `cartPayload` โดย **ใส่เฉพาะประเภทที่ `inCart === true` เท่านั้น** (เช่นมีแต่ที่พักในตะกร้า `cartPayload` จะมีแค่ `{ accommodation }` ไม่มี `car`) ส่ง `{ cart: cartPayload, customerInfo }` ไปที่ `POST /api/bookings` จริง (ผ่าน `createBooking()` ใน `api/client.js`) แล้ว `await` ผลลัพธ์กลับมา — **backend เป็นคนคำนวณราคา + ประกอบ document ตาม schema `bookings`/`booking_items` เอง** (ดู 1.3) เมื่อได้ผลลัพธ์กลับมาแล้วเก็บลง state (`confirmedOrder`, `confirmedItems`, `bookingRef`, `customer`) แล้ว **เคลียร์ `inCart` ของทั้งสองประเภทกลับเป็น `false`** (ตะกร้าว่างพร้อมเริ่มรอบใหม่) — **เป็น async function ผู้เรียกต้อง `await` และ `try/catch` เผื่อ request ล้มเหลว** (เช่น รถ/ที่พักถูกลบไปแล้ว, เน็ตหลุด) | `Checkout` (ตอนกด "Confirm Booking")     |
| `resetBooking()`                     | -                                 | รีเซ็ตทุกอย่างกลับเป็นค่าเริ่มต้น (เรียก `buildDefaultCart()` ใหม่) เคลียร์ `customer`/`confirmedOrder`/`confirmedItems`/`bookingRef` | (เผื่อใช้ตอนเริ่ม flow ใหม่)              |

## 2.5 `frontend/src/config/propertyFilters.js` — ค่าคงที่ตัวกรอง (ไม่เกี่ยวกับฐานข้อมูล)

| ชื่อ                | ประเภท | หน้าที่                                                                                                                          |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `bedroomOptions`      | array  | ตัวเลือกกรอง "จำนวนห้องนอน" (1 / 2 / 3+) แต่ละตัวมีฟังก์ชัน `test(bedrooms)` ไว้เช็คว่าที่พักผ่านเงื่อนไขไหม                       |
| `renovationOptions`   | array  | ตัวเลือกกรอง "ช่วงเวลาปรับปรุง" (6 เดือน/1 ปี/2 ปี) แต่ละตัวมีค่า `maxMonths` ไว้เทียบกับ `renovatedMonthsAgo` ของที่พัก             |

สองตัวนี้เป็น **ค่าคงที่ล้วนๆ ของ UI** (ไม่ได้มาจาก MongoDB และไม่มีวันเปลี่ยนบ่อย) เลยแยกออกมาไว้ต่างหาก ไม่ปนกับ `CatalogContext` ที่มีไว้จัดการข้อมูลจริงจากฐานข้อมูลเท่านั้น

## 2.6 หน้าเว็บทั้งหมด (Pages) และข้อมูลที่แต่ละหน้าดึงมาใช้

มี 2 flow หลัก: **จองที่พัก** (Home → Listing → Detail → Cart → Checkout → Success) และ **จองรถเช่า** (Home → Car Rental → Car Detail → Cart → Checkout → Success) — **ทั้งสอง flow ใช้หน้า Cart/Checkout/Success ร่วมกัน และตอนนี้สามารถเดินทั้ง 2 flow สลับกันแล้วมาเจอกันในตะกร้าเดียวได้** เช่น จองที่พักก่อน แล้วย้อนไปจองรถเพิ่ม ตะกร้าจะมีทั้งคู่พร้อมกัน ไม่ใช่การ "สลับโหมด" แบบเดิมอีกต่อไป (ดู 2.4)

| #   | หน้า                  | Route             | ไฟล์                                                                                 | ดึงข้อมูลจาก `useCatalog()`                       | ดึง/เขียนผ่าน `useBooking()`                                              | คำอธิบาย                                                                               |
| --- | --------------------- | ----------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 1   | Home (Landing)        | `/`               | [`Home.jsx`](frontend/src/pages/Home.jsx)                                            | -                                                      | -                                                                                | หน้าแรก แนะนำ 3 บริการ + trust bar                                                        |
| 2   | Accommodation Listing | `/accommodations` | [`AccommodationListing.jsx`](frontend/src/pages/AccommodationListing.jsx)            | `properties`                                          | -                                                                                | รายการที่พักทั้งหมด + ค้นหา + ตัวกรอง                                                     |
| 3   | Accommodation Detail  | `/detail/:id`     | [`AccommodationDetail.jsx`](frontend/src/pages/AccommodationDetail.jsx)              | `properties`, `getPropertyById`, `getRegionLabel`      | `previewProperty`, `selectProperty`, `selectRoomType`, `selectedRoom`, `cart`, `nights` | รายละเอียดที่พัก 1 รายการ + กล่องจอง                                                      |
| 4   | Booking Cart          | `/cart`           | [`BookingCart.jsx`](frontend/src/pages/BookingCart.jsx)                              | `cars`, `properties`, `getOtherProperties`            | `cart`, `hasAccommodationInCart`, `hasCarInCart`, `selectedProperty`, `selectedRoom`, `selectedCar`, `nights`, `carDays`, `updateDates`, `updateCarDates`, `removeFromCart` | ตะกร้า แสดง 2 บล็อกอิสระต่อกัน (ที่พัก/รถ) เฉพาะประเภทที่ `inCart === true` เท่านั้น รวมยอดทั้งสองเป็น grand total |
| 5   | Checkout              | `/checkout`       | [`Checkout.jsx`](frontend/src/pages/Checkout.jsx)                                    | -                                                      | `cart`, `hasAccommodationInCart`, `hasCarInCart`, `confirmBooking`              | ฟอร์มลูกค้า (ฟอร์มคนขับโชว์เฉพาะตอนมีรถในตะกร้า) + เลือกวิธีจ่าย + กด Confirm Booking (ยิง `POST /api/bookings` จริง พร้อมทุกประเภทที่อยู่ในตะกร้า) แล้วไปหน้า `/success?ref=...` |
| 6   | Booking Success       | `/success?ref=...`| [`BookingSuccess.jsx`](frontend/src/pages/BookingSuccess.jsx)                        | `cars`, `getOtherProperties`                          | `bookingRef`, `confirmedOrder`, `confirmedItems`                                | ยืนยันการจองสำเร็จ + ดึงข้อมูลจริงจาก `GET /api/bookings/:ref` มาแสดง **ทุกรายการที่จองมา** (วนลูป `items` ทีละชิ้น) + JSON payload inspector (มี tab แยกตาม item) |
| 7   | Car Rental            | `/car-rental`     | [`CarRental.jsx`](frontend/src/pages/CarRental.jsx)                                  | `cars`                                                 | -                                                                                | รายการรถให้เช่า + ตัวกรอง                                                                  |
| 8   | Car Detail            | `/car-rental/:id` | [`CarDetail.jsx`](frontend/src/pages/CarDetail.jsx)                                  | `cars`, `getCarById`, `pickupLocations`                | `selectCar`                                                                      | รายละเอียดรถ 1 คัน + ฟอร์มวันรับ-คืน + กล่องจอง                                          |

> **หมายเหตุ**: `BookingCart` และ `Checkout` จะ redirect กลับ (`/` และ `/cart` ตามลำดับ) ถ้า `hasAccommodationInCart` และ `hasCarInCart` เป็น `false` ทั้งคู่ (ตะกร้าว่างสนิท) — ถ้ามีอย่างน้อย 1 ประเภทก็เข้าได้ปกติ
>
> `BookingSuccess` จะ redirect กลับหน้า `/` ทันทีถ้าไม่มีทั้ง `?ref=` ใน URL และ `bookingRef` ใน `BookingContext` (คือยังไม่เคยกด "Confirm Booking" มาก่อนและไม่ได้เข้าผ่านลิงก์ที่มี ref) — ถ้ามี ref อย่างใดอย่างหนึ่ง หน้านี้จะยิง `GET /api/bookings/:ref` ดึงข้อมูลจริงจาก MongoDB มาแสดง **ครบทุกรายการที่อยู่ในออเดอร์นั้น** แม้จะรีเฟรชหน้าหรือเปิดลิงก์ตรงก็ยังเห็นข้อมูลถูกต้องครบถ้วน

## 2.7 Component ทั้งหมด

| Component           | ไฟล์                                                                    | ใช้ทำอะไร                                                                                                                                                | ใช้อยู่ในหน้า/component ไหนบ้าง                                                                                      |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Header`             | [`Header.jsx`](frontend/src/components/Header.jsx)                       | แถบเมนูบนสุด sticky ไฮไลต์เมนูตาม path ปัจจุบัน (`useLocation`) ปุ่มขวาบนสลับ Login/Register ↔ Back to search/Book Now ตามว่าอยู่ใน booking flow หรือไม่ | ทุกหน้า                                                                                                              |
| `Footer`             | [`Footer.jsx`](frontend/src/components/Footer.jsx)                       | ท้ายเว็บไซต์ ลิงก์ช่วยเชื่อมไปหน้าต่างๆ                                                                                                                  | ทุกหน้า                                                                                                              |
| `Button`             | [`Button.jsx`](frontend/src/components/Button.jsx)                       | ปุ่ม/ลิงก์ใช้ซ้ำได้ (ถ้ามี prop `to` จะ render เป็น `<Link>`) รองรับ `variant` (`primary`/`gold`/`ghost`/`link`) และ `size`                              | เกือบทุกหน้า/การ์ด                                                                                                    |
| `PhotoPlaceholder`   | [`PhotoPlaceholder.jsx`](frontend/src/components/PhotoPlaceholder.jsx)   | กล่องรูปภาพ แสดงรูปจริงถ้ามี `src` ไม่งั้น fallback เป็น gradient จำลอง                                                                                  | `PropertyCard`, `CarCard`, `AccommodationDetail`, `BookingCart`, `Checkout`, `BookingSuccess`                        |
| `SearchBar`          | [`SearchBar.jsx`](frontend/src/components/SearchBar.jsx)                 | ฟอร์มค้นหาที่พัก (ปลายทาง/เช็คอิน-เอาท์/ผู้เข้าพัก) — demo UI ยังไม่ต่อ logic ค้นหาจริง                                                                  | `Home`, `AccommodationListing`                                                                                       |
| `FilterSidebar`      | [`FilterSidebar.jsx`](frontend/src/components/FilterSidebar.jsx)         | ตัวกรองที่พัก: ราคาสูงสุด, Popular Filters (keyword จาก `useCatalog().facilityKeywords`), จำนวนห้องนอน/ช่วงเวลาปรับปรุง (จาก `config/propertyFilters.js`) | `AccommodationListing`                                                                                               |
| `PropertyCard`       | [`PropertyCard.jsx`](frontend/src/components/PropertyCard.jsx)           | การ์ดที่พัก 2 โหมดผ่าน prop `mode`: `"list"` (การ์ดใหญ่แนวนอน) / `"mini"` (การ์ดเล็กแนวตั้ง)                                                             | `AccommodationListing` (list), `BookingCart`/`BookingSuccess` (mini)                                                 |
| `Chip`               | [`Chip.jsx`](frontend/src/components/Chip.jsx)                           | ปุ่มแท็กกดติด/กดปลด (UI-only เก็บ state ในตัวเอง)                                                                                                        | `AccommodationListing`                                                                                               |
| `DateRangeFields`    | [`DateRangeFields.jsx`](frontend/src/components/DateRangeFields.jsx)     | ช่องเลือกวันเข้าพัก/ออก อ่าน-เขียนตรงกับ `BookingContext` เอง ไม่ต้องส่ง props                                                                           | `AccommodationDetail`, `BookingCart` (โหมดแก้ไข)                                                                      |
| `GuestRoomSelector`  | [`GuestRoomSelector.jsx`](frontend/src/components/GuestRoomSelector.jsx) | แผงเลือกจำนวนผู้ใหญ่/เด็ก/ห้อง ประกอบจาก `QuantityStepper` 3 แถว อ่าน-เขียนตรงกับ `BookingContext`                                                       | `AccommodationDetail`, `BookingCart` (โหมดแก้ไข)                                                                      |
| `QuantityStepper`    | [`QuantityStepper.jsx`](frontend/src/components/QuantityStepper.jsx)     | ปุ่ม (−)/(+) เพิ่ม-ลดจำนวนทั่วไป ปิดปุ่มอัตโนมัติเมื่อถึง min/max                                                                                        | ใช้ภายใน `GuestRoomSelector`                                                                                         |
| `OrderSummary`       | [`OrderSummary.jsx`](frontend/src/components/OrderSummary.jsx)           | กล่องสรุปยอด รับ `lines` (array ของ `{label, amount}`) + `total`                                                                                         | `BookingCart`                                                                                                        |
| `Stepper`            | [`Stepper.jsx`](frontend/src/components/Stepper.jsx)                     | แถบ progress 4 ขั้น (Detail → Cart → Checkout → Success) รับ prop `current` (1-4)                                                                        | `AccommodationDetail`, `BookingCart`, `Checkout`, `BookingSuccess`                                                   |
| `CarSearchBar`       | [`CarSearchBar.jsx`](frontend/src/components/CarSearchBar.jsx)           | ฟอร์มค้นหารถเช่า ดึง `carTypes` จาก `useCatalog()` มาทำ dropdown ประเภทรถ                                                                                | `CarRental`                                                                                                          |
| `CarFilterSidebar`   | [`CarFilterSidebar.jsx`](frontend/src/components/CarFilterSidebar.jsx)   | ตัวกรองรถ: ประเภทรถ (checkbox พร้อมจำนวน นับจาก `cars` จริง), ราคาสูงสุด/วัน — ดึง `carTypes`/`cars` จาก `useCatalog()`                                  | `CarRental`                                                                                                          |
| `CarCard`            | [`CarCard.jsx`](frontend/src/components/CarCard.jsx)                     | การ์ดรถ 1 คัน (รูป, ประเภท, เรตติ้ง, ที่นั่ง/เกียร์/เชื้อเพลิง, ราคา/วัน, ปุ่มบันทึก/หัวใจ)                                                              | `CarRental`, `BookingCart`/`BookingSuccess` (โซนแนะนำ)                                                                |

## 2.8 React Hooks ที่ใช้ในโปรเจกต์นี้

| Hook                                | ใช้ที่ไฟล์                                                                                                                | ใช้ทำอะไร                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `useState`                           | เกือบทุก context/page ที่มีฟอร์มหรือตัวกรอง (`CatalogContext`, `BookingContext`, `AccommodationListing`, `CarRental`, `CarDetail`, `BookingCart`, `BookingSuccess`, `Checkout`, `Chip`, `SearchBar`, `CarSearchBar`, `CarCard`) | เก็บ state ภายใน component/context                                                                            |
| `useEffect`                          | `CatalogContext.jsx` (ยิง fetch ตอนเปิดแอป), `AccommodationDetail.jsx` (sync ที่พักที่เลือกเข้ากับ `BookingContext` ตอนเข้าหน้าตรงๆ), `BookingSuccess.jsx` (ยิง `GET /api/bookings/:ref` ทุกครั้งที่ `effectiveRef` เปลี่ยน) | ทำงานที่มี "side effect" เช่น เรียก API, sync ข้อมูลข้าม context                                              |
| `useMemo`                            | `CatalogContext.jsx` (`carTypes`, `facilityKeywords`, `value`), `BookingContext.jsx` (`selectedProperty`, `selectedRoom`, `selectedCar`, `nights`, `carDays`), `AccommodationListing.jsx` (`filteredProperties`), `CarRental.jsx` (`filteredCars`), `CarDetail.jsx` (`days`) | คำนวณค่าที่ขึ้นกับ dependency เฉพาะตอนที่ dependency เปลี่ยน ไม่คำนวณซ้ำทุก render (ประหยัดเวลา render) |
| `useContext` (ผ่าน `useCatalog()`)   | ทุกไฟล์ที่เรียก `useCatalog()`                                                                                             | ดึงข้อมูล catalog (cars/properties/...) จาก `CatalogContext`                                                   |
| `useContext` (ผ่าน `useBooking()`)   | ทุกไฟล์ที่เรียก `useBooking()`                                                                                             | ดึงค่า/ฟังก์ชันจาก `BookingContext`                                                                            |
| **react-router-dom**                 |                                                                                                                              |                                                                                                                  |
| `useParams`                          | `AccommodationDetail.jsx`, `CarDetail.jsx`                                                                                | อ่าน `:id` จาก URL                                                                                              |
| `useSearchParams`                    | `BookingSuccess.jsx`                                                                                                       | อ่าน query string `?ref=...` จาก URL เพื่อดึงการจองด้วยเลขที่การจองแม้ context ในเครื่องจะไม่มีข้อมูล (เช่น รีเฟรชหน้า) |
| `useNavigate`                        | `Checkout.jsx`, `CarDetail.jsx`                                                                                            | สั่งเปลี่ยนหน้าด้วยโค้ด (เช่น ไป `/cart` หลังกด Book Now, ไป `/success` หลัง submit ฟอร์ม)                     |
| `useLocation`                        | `Header.jsx`                                                                                                              | อ่าน path ปัจจุบันเพื่อไฮไลต์เมนูที่ active                                                                    |
| `<Link>`                             | `Header.jsx`, `Footer.jsx`, `Button.jsx`, `PropertyCard.jsx`                                                              | เปลี่ยนหน้าแบบ SPA (ไม่ reload หน้า)                                                                            |
| `<Navigate>`                         | `BookingSuccess.jsx`                                                                                                      | redirect อัตโนมัติถ้าเงื่อนไขไม่ผ่าน (ยังไม่มี `bookingRef`)                                                   |
| `<Routes>` / `<Route>`               | `App.jsx`                                                                                                                  | กำหนดตาราง route ทั้งหมด                                                                                        |

---

# ส่วนที่ 3: ตัวอย่างการเชื่อมต่อจริง — เดินตามทีละสเต็ป

ลองไล่ดูว่าเกิดอะไรขึ้นบ้าง ตอนผู้ใช้ **เปิดหน้ารายการที่พัก แล้วกดดูรายละเอียด 1 ที่พัก**:

1. ผู้ใช้พิมพ์ `localhost:5173/accommodations` หรือกดลิงก์มาที่หน้านี้
2. เพราะทั้งแอปถูกห่อด้วย `<CatalogProvider>` ตั้งแต่ `main.jsx` แล้ว ข้อมูล `properties` (ที่พักทั้งหมดจาก MongoDB) จึงถูกโหลดพร้อมอยู่แล้วตั้งแต่แอปเปิด (ไม่ต้องรอโหลดซ้ำตอนเข้าหน้านี้)
3. `AccommodationListing.jsx` เรียก `const { properties } = useCatalog();` ได้ข้อมูลที่พักทั้ง 14 รายการมาทันที
4. ผู้ใช้ปรับตัวกรอง (ราคา/keyword/ห้องนอน) → `AccommodationListing` กรอง `properties` ในเครื่อง (ฝั่ง frontend ล้วนๆ ไม่ได้ยิง request ใหม่) ด้วย `useMemo` แล้วส่งผลลัพธ์ (`filteredProperties`) ไปแสดงเป็น `PropertyCard` หลายใบ
5. ผู้ใช้กดที่การ์ดที่พักใบหนึ่ง → React Router พาไป `/detail/siam-heritage-sanctuary` (ใช้ `id` ของที่พักเป็นส่วนหนึ่งของ URL)
6. `AccommodationDetail.jsx` อ่าน `id` จาก URL ด้วย `useParams()` แล้วเรียก `getPropertyById(id)` จาก `useCatalog()` เพื่อหาที่พักตัวเต็มจาก `properties` ที่มีอยู่แล้วใน memory (ไม่ต้องยิง `/api/properties/:id` ซ้ำ เพราะข้อมูลมีอยู่แล้ว)
7. `useEffect` ในหน้านี้เรียก `selectProperty(property.id)` จาก `useBooking()` เพื่อบอก `BookingContext` ว่า "ตอนนี้ผู้ใช้กำลังดู/จะจองที่พักนี้อยู่"
8. หน้าแสดงรายละเอียด (ห้องพัก, สิ่งอำนวยความสะดวก, ราคา) โดยดึงจาก object ที่พักที่ได้จากข้อ 6 ทั้งหมด — **ไม่มีการยิง request ไป backend เพิ่มเลยตลอดขั้นตอนนี้** เพราะข้อมูลทั้งหมดถูกโหลดมาไว้ล่วงหน้าตั้งแต่แอปเปิดแล้ว

> เทียบกับตอนกด **"View Detail" รถเช่า** หรือ **"Book Now" ที่พัก** จะเป็นแบบเดียวกันทุกจุด: หาใน array ที่โหลดไว้แล้วใน `CatalogContext`, ไม่ต้องยิง API ใหม่ระหว่างเปลี่ยนหน้า — ยิง API แค่ครั้งเดียวตอนเปิดแอปเท่านั้น (ที่ `CatalogProvider`)

## ตัวอย่างที่ 2: กด "Confirm Booking" จนถึงหน้า Success (flow ที่มีการเขียนข้อมูลจริง — จองที่พัก + รถเช่าพร้อมกัน)

เคสข้างบนมีแต่การ "อ่าน" ข้อมูล เคสนี้คือจุดเดียวในระบบที่มีการ **"เขียน" ข้อมูลใหม่ลง MongoDB จริง** — สมมติผู้ใช้กด Book Now ที่พักไว้ก่อน แล้วย้อนไปกด Book Now รถเช่าเพิ่ม ตอนนี้ตะกร้ามีทั้ง `cart.accommodation.inCart = true` และ `cart.car.inCart = true` พร้อมกัน:

1. ผู้ใช้กรอกฟอร์มในหน้า Checkout แล้วกดปุ่ม "Confirm & Pay"
2. `Checkout.jsx` เรียก `confirmBooking(customerInfo)` จาก `useBooking()` (เป็น `await` เพราะตอนนี้เป็น async function แล้ว) พร้อมปิดปุ่ม/เปลี่ยนข้อความเป็น "Processing…" ระหว่างรอ (state `submitting`)
3. `BookingContext.confirmBooking()` เช็คว่าแต่ละประเภท `inCart` หรือไม่ → ทั้งคู่เป็น `true` เลยประกอบ `cartPayload = { accommodation: cart.accommodation, car: cart.car }` ส่ง `{ cart: cartPayload, customerInfo }` ไปที่ `POST /api/bookings` ผ่าน `createBooking()` ใน `api/client.js`
4. คำขอวิ่งผ่าน Vite proxy ไปที่ backend เหมือนตัวอย่างที่ 1 — แต่รอบนี้ backend **เขียนข้อมูล**:
   - เรียก `generateOrderRef()` **ครั้งเดียว** ได้เลขที่การจอง 1 เลขสำหรับทั้งออเดอร์
   - ค้นที่พักจาก MongoDB ด้วย `propertyId` ที่ส่งมา → เรียก `buildAccommodationItem(...)` ได้ item ที่พัก 1 ชิ้น
   - ค้นรถจาก MongoDB ด้วย `carId` ที่ส่งมา → เรียก `buildCarItem(...)` ได้ item รถ 1 ชิ้น (ไม่เชื่อราคาที่ frontend คำนวณไว้ ทั้งสองกรณี)
   - รวมยอด `subtotal`/`tax`/`total` จากทั้ง 2 item เข้าด้วยกัน เรียก `buildOrderHeader(...)` ได้ `order` หัวเดียว
   - `insertOne(order)` ลง collection `bookings` และ `insertMany([accommodationItem, carItem])` ลง `booking_items` (ทั้งคู่มี `booking_ref` เดียวกัน)
   - ตอบกลับ `201 { order, items: [accommodationItem, carItem], ref }`
5. `confirmBooking()` ฝั่ง frontend ได้ผลลัพธ์กลับมา เก็บลง `confirmedOrder`/`confirmedItems`/`bookingRef` ใน `BookingContext` แล้วเคลียร์ `inCart` ของทั้งสองประเภทกลับเป็น `false` แล้ว `return { order, items, ref }`
6. `Checkout.jsx` ได้ `ref` กลับมา สั่ง `navigate(\`/success?ref=${ref}\`)`
7. `BookingSuccess.jsx` เปิดขึ้นมา อ่าน `ref` จาก URL ด้วย `useSearchParams()` แล้วยิง `GET /api/bookings/:ref` ผ่าน `fetchBookingByRef()` **ดึงข้อมูลที่เพิ่งบันทึกไปจริงๆ กลับมาแสดงครบทั้ง 2 รายการ** (ไม่ได้เชื่อแค่ค่าที่เพิ่งได้จากขั้นตอนที่ 5 เฉยๆ — แม้ผู้ใช้จะกดรีเฟรชหน้านี้ หรือแชร์ลิงก์ไปให้คนอื่นเปิด ก็ยังดึงข้อมูลได้ถูกต้องครบถ้วนเพราะข้อมูลอยู่ใน MongoDB จริงแล้ว) หน้านี้วนลูป `items.map(...)` แสดงการ์ดแยกกันทีละรายการ พร้อม tab JSON inspector แยกตาม item

---

# ส่วนที่ 4: ชื่อตัวแปร/State สำคัญที่ควรรู้ก่อนแก้โค้ด

เพื่อกันตั้งชื่อซ้ำ/สับสนเวลาทำงานต่อ (โปรเจกต์กลุ่ม):

| ชื่อ                                                                     | อยู่ที่ไหน                              | ความหมาย                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `cars`, `properties`, `regions`, `hotelCategories`, `hotelSpecialOptions` | `CatalogContext`                        | ข้อมูล "แคตตาล็อก" จาก MongoDB — ห้ามสร้าง state ซ้ำแยกในหน้าอื่นสำหรับข้อมูลเดียวกัน ให้ดึงจาก `useCatalog()` เสมอ       |
| `cart`                                                                    | `BookingContext`                        | state ตะกร้าตรงกลาง แยกเป็น `cart.accommodation` และ `cart.car` (คนละ field, อยู่ด้วยกันได้พร้อมกัน แต่ละอย่างมี `inCart: boolean`) — ห้ามสร้าง state ชื่อซ้ำแยกในหน้าอื่น ให้ดึงจาก `useBooking()` แทน (ชื่อเก่า `booking` object เดี่ยวถูกเลิกใช้แล้ว) |
| `hasAccommodationInCart`, `hasCarInCart`                                 | `BookingContext`                        | shortcut boolean ของ `cart.accommodation.inCart`/`cart.car.inCart` — ใช้ guard route และแสดง/ซ่อน section แบบมีเงื่อนไขในหลายหน้า |
| `selectedProperty`, `selectedCar`, `selectedRoom`                       | `BookingContext`                        | ของที่กำลังจองอยู่ (มาจาก `cart.accommodation.propertyId`/`cart.car.carId`/`cart.accommodation.roomTypeId`)               |
| `nights`, `carDays`, `subtotal`, `serviceFee`, `taxes`, `total`          | หลายหน้า (Detail/Cart/Checkout/Success) | ตัวแปรคำนวณราคา คำนวณซ้ำแยกในแต่ละหน้าเพื่อ**แสดงตัวอย่างราคาให้ผู้ใช้เห็นระหว่างเลือก** (ยังไม่ได้รวมเป็น helper กลาง) — **ราคาที่บันทึกจริงกลับคำนวณอีกทีฝั่ง backend** (`bookingBuilder.js`, สูตรเดียวกัน) ตอนกด Confirm Booking ถ้าจะแก้สูตรราคาต้องแก้ทั้ง 2 ฝั่งให้ตรงกัน — ใน `Checkout.jsx`/`BookingCart.jsx` ตอนนี้แยกเป็น `hotelSubtotal`/`hotelTotal` กับ `carSubtotal`/`carTotal` (แต่ละอันเป็น 0 ถ้าประเภทนั้นไม่อยู่ในตะกร้า) แล้วรวมเป็น `grandSubtotal`/`grandTotal` |
| `maxPrice`, `selectedKeywords`, `selectedBedroom`, `selectedRenovations` | `AccommodationListing.jsx`              | state ตัวกรองที่พัก ยกขึ้นมาไว้ระดับหน้า (controlled component) แล้วส่งลง `FilterSidebar`                                  |
| `selectedTypes`, `maxPrice`                                              | `CarRental.jsx`                         | state ตัวกรองรถ (คนละตัวแปรกับ `maxPrice` ใน Listing แม้ชื่อเหมือนกัน เพราะอยู่คนละหน้า/scope)                             |
| `editingStay`, `editingCar`                                              | `BookingCart.jsx`                       | สลับโหมดแสดงผลปกติ ↔ โหมดแก้ไขวันที่/ผู้เข้าพัก **แยก state ต่างหากกันคนละประเภท** เพื่อให้แก้ไขที่พักกับรถพร้อมกันเป็นอิสระต่อกันได้ (เดิมมี state เดียวชื่อ `editing`) |
| `bookingRef`                                                             | `BookingContext`                        | เลขที่การจอง (ได้มาจาก backend หลัง `POST /api/bookings` สำเร็จ — เลขเดียวครอบคลุมทุกรายการในออเดอร์นั้น) ใช้เป็นเงื่อนไข guard หน้า Success |
| `status`, `error`                                                        | `CatalogContext`                        | สถานะการโหลดข้อมูลจาก backend (`"loading"`/`"ready"`/`"error"`) ใช้ตัดสินใจว่าจะ render หน้า loading/error/แอปจริง        |
| `submitting`, `submitError`                                              | `Checkout.jsx`                          | สถานะระหว่างรอ `POST /api/bookings` ตอบกลับ (ปิดปุ่ม/โชว์ "Processing…") และข้อความ error ถ้าจองไม่สำเร็จ                 |
| `effectiveRef`, `remoteOrder`, `remoteItems`                             | `BookingSuccess.jsx`                    | `effectiveRef` = ref จาก URL หรือจาก context (`refFromUrl \|\| bookingRef`); `remoteOrder`/`remoteItems` = ผลลัพธ์จาก `GET /api/bookings/:ref` (**`remoteItems` เป็น array**) — เป็นข้อมูล "ตัวจริง" จาก MongoDB ที่หน้านี้ใช้แสดงผล (ถ้ายังโหลดไม่เสร็จจะ fallback ไปใช้ `confirmedOrder`/`confirmedItems` จาก context ชั่วคราว) |

---

# ส่วนที่ 5: Design Tokens (สี/ฟอนต์)

กำหนดไว้ที่ [`frontend/src/styles/theme.css`](frontend/src/styles/theme.css) เป็น CSS variables — แก้สีทั้งเว็บให้แก้ที่ไฟล์นี้ไฟล์เดียว:

- `--color-primary` `#082340` (กรม-น้ำเงินเข้ม) — โทนหลัก header/ปุ่มหลัก/หัวเรื่อง
- `--color-secondary` `#efc265` (ทอง) — โทนรอง ปุ่ม CTA/badge/ราคา
- `--color-accent` `#6cafff` (ฟ้า) — ลิงก์/เน้นข้อมูลรอง

---

# ส่วนที่ 6: สิ่งที่ยังไม่ได้ทำ / ข้อจำกัดปัจจุบัน

- **การจองบันทึกลง MongoDB จริงแล้ว** (`POST /api/bookings` + `GET /api/bookings/:ref` — ดูหัวข้อ 1.3) — **รองรับจองที่พัก+รถเช่าพร้อมกันในออเดอร์เดียวแล้ว** (1 `bookings` + หลาย `booking_items`) แต่ **ยังไม่รองรับการจอง "ไกด์"** (ตามแผนในอนาคตของทีม) — สถาปัตยกรรมปัจจุบัน (ตะกร้าแยกเป็น `cart.accommodation`/`cart.car`/(ในอนาคต `cart.guide`) คนละ field ที่อยู่ร่วมกันได้ + backend วน build item ทีละประเภทที่มีอยู่ในตะกร้า) ออกแบบให้ขยายเพิ่มได้ไม่ยาก: เพิ่ม `cart.guide` ใน `buildDefaultCart()` (`BookingContext.jsx`), เพิ่มเงื่อนไข `if (cart.car) buildGuideItem(...)` ใน `POST /api/bookings` (`server/index.js`) พร้อมฟังก์ชัน `buildGuideItem()` ใหม่ใน `bookingBuilder.js`
- **ตะกร้าจำกัดที่ "อย่างละ 1 รายการ" ต่อประเภท** (ไม่ใช่ e-commerce cart แบบเพิ่มได้หลายชิ้นต่อประเภทเดียวกัน) — เป็นการตัดสินใจออกแบบโดยตั้งใจ เพราะ use case จริงของทีมคือจองที่พัก 1 ที่ + รถ 1 คัน (+ไกด์ 1 คนในอนาคต) ต่อทริป ถ้าจะรองรับ "จองที่พัก 2 ที่พร้อมกัน" ในอนาคต ต้องเปลี่ยน `cart.accommodation` จาก object เดี่ยวเป็น array ทั้งฝั่ง frontend/backend (เป็นการเปลี่ยนโครงสร้างใหญ่ ไม่ใช่แค่ปรับเล็กน้อย)
- **ยังไม่มี authentication/authorization ใดๆ** — ทั้ง `GET /api/*` และ `POST /api/bookings` ใครก็ยิงได้หมด ไม่มีการเช็คว่าใครเป็นคนจอง (เหมาะสำหรับ dev/demo เท่านั้น ยังไม่ควร deploy ให้คนภายนอกเข้าถึงได้โดยตรงแบบนี้)
- **ยังไม่มีการเช็คห้องว่าง/รถว่างจริง (inventory check)** — `POST /api/bookings` ไม่ได้เช็คว่าห้อง/รถถูกจองซ้อนกับช่วงเวลาที่มีคนจองไปแล้วหรือไม่ (จองทับกันได้ทุกครั้ง)
- ยังไม่มีหน้าตะกร้า/checkout แยกเฉพาะของรถเช่า — ใช้หน้า `BookingCart`/`Checkout`/`BookingSuccess` ร่วมกับที่พัก โดยแสดง/ซ่อนแต่ละ section ตาม `hasAccommodationInCart`/`hasCarInCart`
- ฟอร์มค้นหา (`SearchBar`, `CarSearchBar`) และช่องกรอกบัตรเครดิตใน Checkout เป็น UI demo ยังไม่ได้ validate/ต่อ logic ค้นหาจริง
