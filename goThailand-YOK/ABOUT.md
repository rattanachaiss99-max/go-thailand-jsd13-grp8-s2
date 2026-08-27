# Team 8

# GoThailand sprint2

# Accommodation & Car Rental Booking page

Front-end จองที่พัก + จองรถเช่า สไตล์ luxury travel ของไทย สร้างด้วย React + Vite (SPA, ยังไม่มี backend จริง ข้อมูลทั้งหมดเป็น mock data)

## Tech Stack

| หมวด         | ใช้                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | React 19                                                                                                                                                   |
| Build tool   | Vite                                                                                                                                                       |
| Routing      | react-router-dom v7 (`BrowserRouter`)                                                                                                                      |
| Global state | React Context API (`BookingContext`) — ไม่ใช้ Redux/Zustand                                                                                                |
| Styling      | Plain CSS, ไม่มี framework (Tailwind/Bootstrap ฯลฯ) — ใช้ design token (CSS variables) ที่ `src/styles/theme.css` + คลาสรวมที่ `src/styles/components.css` |
| Font         | Playfair Display (หัวเรื่อง), Barlow (เนื้อหา)                                                                                                             |
| Data         | Mock data ในโค้ด (`src/data/*.js`) ไม่มีการเรียก API จริง                                                                                                  |
| รูปภาพ       | ดาวน์โหลดจาก Unsplash เก็บไว้ใน `public/images/`                                                                                                           |

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — รัน dev server (Vite, ปกติที่ `http://localhost:5173`)
- `npm run build` — build สำหรับ production
- `npm run preview` — เปิดดูผลลัพธ์หลัง build
- `npm run lint` — เช็ค lint ด้วย oxlint

## Project Structure

```
src/
├── components/     # UI ที่ใช้ซ้ำได้หลายหน้า
├── context/        # BookingContext — state กลางของ flow การจอง
├── data/           # mock data (properties, regions, cars)
├── pages/          # แต่ละหน้าเว็บ (1 ไฟล์ = 1 route)
├── styles/         # theme.css (design tokens) + components.css (สไตล์ทุกหน้า)
├── App.jsx         # กำหนด route ทั้งหมด
└── main.jsx        # จุดเริ่มแอป (ประกอบ BrowserRouter + BookingProvider)
```

---

## 1. หน้าเว็บทั้งหมด (Pages)

มี 2 flow หลัก: **จองที่พัก** (Home → Listing → Detail → Cart → Checkout → Success) และ **จองรถเช่า** (Home → Car Rental — ปัจจุบันมีแค่หน้ารายการ ยังไม่มีหน้ารายละเอียด/ตะกร้าแยกของรถ)

| #   | หน้า                  | Route             | ไฟล์                                                                       | คำอธิบาย                                                                                                         | Component หลักที่ใช้                                                                                                                |
| --- | --------------------- | ----------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Home (Landing)        | `/`               | [`src/pages/Home.jsx`](src/pages/Home.jsx)                                 | หน้าแรก แนะนำ 3 บริการ (ที่พัก/รถเช่า/ไกด์) + trust bar                                                          | `Header`, `Footer`, `SearchBar`, `Button`                                                                                           |
| 2   | Accommodation Listing | `/accommodations` | [`src/pages/AccommodationListing.jsx`](src/pages/AccommodationListing.jsx) | รายการที่พักทั้งหมด + ค้นหา + ตัวกรอง (ราคา, popular filters, จำนวนห้องนอน, ช่วงเวลาปรับปรุง)                    | `Header`, `Footer`, `SearchBar`, `FilterSidebar`, `PropertyCard`, `Chip`                                                            |
| 3   | Accommodation Detail  | `/detail/:id`     | [`src/pages/AccommodationDetail.jsx`](src/pages/AccommodationDetail.jsx)   | รายละเอียดที่พัก 1 รายการ (แกลเลอรี, สิ่งอำนวยความสะดวก, แผนที่) + กล่องจองที่เลือกวันที่/จำนวนผู้เข้าพักได้จริง | `Header`, `Footer`, `Stepper`, `PhotoPlaceholder`, `Button`, `DateRangeFields`, `GuestRoomSelector`                                 |
| 4   | Booking Cart          | `/cart`           | [`src/pages/BookingCart.jsx`](src/pages/BookingCart.jsx)                   | ตรวจสอบ/แก้ไขการจอง (เปิดโหมดแก้ไขวันที่+ผู้เข้าพักได้) + สรุปยอด + ที่พักแนะนำเพิ่มเติม                         | `Header`, `Footer`, `Stepper`, `PhotoPlaceholder`, `Button`, `OrderSummary`, `PropertyCard`, `DateRangeFields`, `GuestRoomSelector` |
| 5   | Checkout              | `/checkout`       | [`src/pages/Checkout.jsx`](src/pages/Checkout.jsx)                         | ฟอร์มข้อมูลลูกค้า + เลือกวิธีชำระเงิน + สรุปยอดด้านขวา                                                           | `Header`, `Footer`, `Stepper`, `PhotoPlaceholder`, `Button`                                                                         |
| 6   | Booking Success       | `/success`        | [`src/pages/BookingSuccess.jsx`](src/pages/BookingSuccess.jsx)             | ยืนยันการจองสำเร็จ + เลขที่การจอง + สรุปการชำระเงิน + ที่พักแนะนำ                                                | `Header`, `Footer`, `Stepper`, `PhotoPlaceholder`, `Button`, `PropertyCard`                                                         |
| 7   | Car Rental            | `/car-rental`     | [`src/pages/CarRental.jsx`](src/pages/CarRental.jsx)                       | รายการรถให้เช่า + ค้นหา (ทำเลรับ-คืนรถ/วันที่/ประเภทรถ) + ตัวกรอง (ประเภทรถ, ราคา/วัน)                           | `Header`, `Footer`, `CarSearchBar`, `CarFilterSidebar`, `CarCard`                                                                   |

> **หมายเหตุ**: `BookingSuccess` จะ redirect กลับหน้า `/` ทันทีถ้ายังไม่เคยกด "Confirm Booking" มาก่อน (เช็คจาก `bookingRef` ใน `BookingContext` ที่ยังเป็น `null`) กันไม่ให้เห็นหน้าสำเร็จลอยๆ

---

## 2. Component ทั้งหมด

| Component           | ไฟล์                                                            | ใช้ทำอะไร                                                                                                                                                | ใช้อยู่ในหน้า/component ไหนบ้าง                                                                                      |
| ------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Header`            | [`Header.jsx`](src/components/Header.jsx)                       | แถบเมนูบนสุด sticky ไฮไลต์เมนูตาม path ปัจจุบัน (`useLocation`) ปุ่มขวาบนสลับ Login/Register ↔ Back to search/Book Now ตามว่าอยู่ใน booking flow หรือไม่ | ทุกหน้า                                                                                                              |
| `Footer`            | [`Footer.jsx`](src/components/Footer.jsx)                       | ท้ายเว็บไซต์ ลิงก์ช่วยเชื่อมไปหน้าต่างๆ                                                                                                                  | ทุกหน้า                                                                                                              |
| `Button`            | [`Button.jsx`](src/components/Button.jsx)                       | ปุ่ม/ลิงก์ใช้ซ้ำได้ (ถ้ามี prop `to` จะ render เป็น `<Link>`) รองรับ `variant` (`primary`/`gold`/`ghost`/`link`) และ `size`                              | เกือบทุกหน้า/การ์ด (Home, Header, PropertyCard, CarCard, AccommodationDetail, BookingCart, Checkout, BookingSuccess) |
| `PhotoPlaceholder`  | [`PhotoPlaceholder.jsx`](src/components/PhotoPlaceholder.jsx)   | กล่องรูปภาพ แสดงรูปจริงถ้ามี `src` ไม่งั้น fallback เป็น gradient จำลอง                                                                                  | `PropertyCard`, `CarCard`, `AccommodationDetail` (แกลเลอรี), `BookingCart`, `Checkout`, `BookingSuccess`             |
| `SearchBar`         | [`SearchBar.jsx`](src/components/SearchBar.jsx)                 | ฟอร์มค้นหาที่พัก (ปลายทาง/เช็คอิน-เอาท์/ผู้เข้าพัก) demo UI ยังไม่ต่อ API จริง                                                                           | `Home`, `AccommodationListing`                                                                                       |
| `FilterSidebar`     | [`FilterSidebar.jsx`](src/components/FilterSidebar.jsx)         | ตัวกรองที่พัก: ราคาสูงสุด, Popular Filters (keyword), จำนวนห้องนอน, ช่วงเวลาปรับปรุง                                                                     | `AccommodationListing`                                                                                               |
| `PropertyCard`      | [`PropertyCard.jsx`](src/components/PropertyCard.jsx)           | การ์ดที่พัก 2 โหมดผ่าน prop `mode`: `"list"` (การ์ดใหญ่แนวนอน) / `"mini"` (การ์ดเล็กแนวตั้ง) เมื่อกดเลือกจะบันทึกลง `BookingContext`                     | `AccommodationListing` (list), `BookingCart` และ `BookingSuccess` (mini, โซน "You might also like")                  |
| `Chip`              | [`Chip.jsx`](src/components/Chip.jsx)                           | ปุ่มแท็กกดติด/กดปลด (UI-only เก็บ state ในตัวเอง ยังไม่ผูก logic กรองจริง)                                                                               | `AccommodationListing` (แถบด้านบนตัวกรอง)                                                                            |
| `DateRangeFields`   | [`DateRangeFields.jsx`](src/components/DateRangeFields.jsx)     | ช่องเลือกวันเข้าพัก/ออก อ่าน-เขียนตรงกับ `BookingContext` เอง ไม่ต้องส่ง props                                                                           | `AccommodationDetail` (กล่องจอง), `BookingCart` (โหมดแก้ไข)                                                          |
| `GuestRoomSelector` | [`GuestRoomSelector.jsx`](src/components/GuestRoomSelector.jsx) | แผงเลือกจำนวนผู้ใหญ่/เด็ก/ห้อง ประกอบจาก `QuantityStepper` 3 แถว อ่าน-เขียนตรงกับ `BookingContext`                                                       | `AccommodationDetail` (กล่องจอง), `BookingCart` (โหมดแก้ไข)                                                          |
| `QuantityStepper`   | [`QuantityStepper.jsx`](src/components/QuantityStepper.jsx)     | ปุ่ม (−)/(+) เพิ่ม-ลดจำนวนทั่วไป ปิดปุ่มอัตโนมัติเมื่อถึง min/max                                                                                        | ใช้ภายใน `GuestRoomSelector`                                                                                         |
| `OrderSummary`      | [`OrderSummary.jsx`](src/components/OrderSummary.jsx)           | กล่องสรุปยอด รับ `lines` (array ของ `{label, amount}`) + `total`                                                                                         | `BookingCart`                                                                                                        |
| `Stepper`           | [`Stepper.jsx`](src/components/Stepper.jsx)                     | แถบ progress 4 ขั้น (Detail → Cart → Checkout → Success) รับ prop `current` (1-4)                                                                        | `AccommodationDetail`, `BookingCart`, `Checkout`, `BookingSuccess`                                                   |
| `CarSearchBar`      | [`CarSearchBar.jsx`](src/components/CarSearchBar.jsx)           | ฟอร์มค้นหารถเช่า (ทำเลรับ-คืนรถ/วันที่/ประเภทรถ) demo UI เหมือน `SearchBar` แต่คนละฟิลด์                                                                 | `CarRental`                                                                                                          |
| `CarFilterSidebar`  | [`CarFilterSidebar.jsx`](src/components/CarFilterSidebar.jsx)   | ตัวกรองรถ: ประเภทรถ (checkbox พร้อมจำนวน), ราคาสูงสุด/วัน                                                                                                | `CarRental`                                                                                                          |
| `CarCard`           | [`CarCard.jsx`](src/components/CarCard.jsx)                     | การ์ดรถ 1 คัน (รูป, ประเภท, เรตติ้ง, ที่นั่ง/เกียร์/เชื้อเพลิง, ราคา/วัน, ปุ่มบันทึก/หัวใจ)                                                              | `CarRental`                                                                                                          |

---

## 3. Global State: `BookingContext`

ไฟล์: [`src/context/BookingContext.jsx`](src/context/BookingContext.jsx)

ใช้ React Context แชร์สถานะการจอง "ที่พัก" ข้ามหน้า Detail → Cart → Checkout → Success (ไม่ครอบคลุมรถเช่า — `CarRental` เก็บ state ของตัวเองแยกต่างหาก)

**ค่าที่ดึงไปใช้ได้ผ่าน `useBooking()`:**

| ชื่อตัวแปร/ฟังก์ชัน              | ประเภท         | ความหมาย                                                                                               |
| -------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| `booking`                        | object         | `{ propertyId, checkIn, checkOut, guests: { adults, children }, rooms }` — ข้อมูลการจองปัจจุบัน        |
| `selectedProperty`               | object         | ที่พักเต็มรายการที่ตรงกับ `booking.propertyId` (หาโดย auto ทุกครั้งที่ context re-render)              |
| `nights`                         | number         | จำนวนคืน คำนวณจาก `checkIn`/`checkOut` (คำนวณด้วย `useMemo`)                                           |
| `customer`                       | object \| null | ข้อมูลลูกค้าจากฟอร์ม Checkout (`null` จนกว่าจะกด Confirm Booking)                                      |
| `bookingRef`                     | string \| null | เลขที่การจอง เช่น `GT202608269123` (`null` จนกว่าจะยืนยันสำเร็จ) — ใช้เช็คว่าห้ามเข้าหน้า Success ตรงๆ |
| `guestLimits`                    | object         | ขอบเขต min/max ของ adults/children/rooms: `{ adults: [1,10], children: [0,6], rooms: [1,6] }`          |
| `todayISO`                       | string         | วันที่วันนี้ในรูปแบบ `YYYY-MM-DD` ใช้เป็น `min` ของ input date                                         |
| `selectProperty(id)`             | function       | เลือกที่พัก (เรียกตอนกด Book Now/Reserve)                                                              |
| `updateDates(patch)`             | function       | แก้ `checkIn`/`checkOut` — ถ้าวันเข้าพักเลื่อนจนเลยวันออก จะเลื่อนวันออกตามอัตโนมัติ                   |
| `changeGuestCount(field, delta)` | function       | เพิ่ม/ลดจำนวน `adults` หรือ `children` ทีละ 1                                                          |
| `changeRoomCount(delta)`         | function       | เพิ่ม/ลดจำนวนห้องทีละ 1                                                                                |
| `confirmBooking(customerInfo)`   | function       | สร้าง `bookingRef` + เก็บ `customer` เรียกตอนกด Confirm Booking ในหน้า Checkout                        |

---

## 4. React Hooks ที่ใช้ในโปรเจกต์นี้

| Hook                               | ใช้ที่ไฟล์                                                                                                                                                           | ใช้ทำอะไร                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `useState`                         | `BookingContext.jsx`, `Chip.jsx`, `SearchBar.jsx`, `CarSearchBar.jsx`, `CarCard.jsx`, `AccommodationListing.jsx`, `CarRental.jsx`, `BookingCart.jsx`, `Checkout.jsx` | เก็บ state ภายใน component/context (ฟอร์ม, ตัวกรอง, on-off toggle)                                     |
| `useEffect`                        | `AccommodationDetail.jsx`                                                                                                                                            | sync ที่พักที่เลือกเข้ากับ `BookingContext` ตอนเข้าหน้านี้ตรงๆ (เช่น พิมพ์ URL เอง ไม่ได้กดมาจากการ์ด) |
| `useMemo`                          | `BookingContext.jsx` (`nights`), `AccommodationListing.jsx` (`filteredProperties`), `CarRental.jsx` (`filteredCars`)                                                 | คำนวณค่าที่ขึ้นกับ dependency เฉพาะตอนที่ dependency เปลี่ยน ไม่คำนวณซ้ำทุก render                     |
| `useContext` (ผ่าน `useBooking()`) | ทุกหน้า/component ที่เรียก `useBooking()`                                                                                                                            | ดึงค่า/ฟังก์ชันจาก `BookingContext`                                                                    |
| **react-router-dom**               |                                                                                                                                                                      |                                                                                                        |
| `useParams`                        | `AccommodationDetail.jsx`                                                                                                                                            | อ่าน `:id` จาก URL (`/detail/:id`)                                                                     |
| `useNavigate`                      | `Checkout.jsx`                                                                                                                                                       | สั่งเปลี่ยนหน้าไป `/success` หลัง submit ฟอร์มสำเร็จ                                                   |
| `useLocation`                      | `Header.jsx`                                                                                                                                                         | อ่าน path ปัจจุบันเพื่อไฮไลต์เมนูที่ active                                                            |
| `<Link>`                           | `Header.jsx`, `Footer.jsx`, `Button.jsx`, `PropertyCard.jsx`                                                                                                         | เปลี่ยนหน้าแบบ SPA (ไม่ reload หน้า)                                                                   |
| `<Navigate>`                       | `BookingSuccess.jsx`                                                                                                                                                 | redirect อัตโนมัติถ้าเงื่อนไขไม่ผ่าน (ยังไม่มี `bookingRef`)                                           |
| `<Routes>` / `<Route>`             | `App.jsx`                                                                                                                                                            | กำหนดตาราง route ทั้งหมด                                                                               |

---

## 5. Data files (mock data)

| ไฟล์                                      | Export                                  | คำอธิบาย                                                                                                                                                                                                                                                         |
| ----------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`properties.js`](src/data/properties.js) | `properties` (array, 14 รายการ)         | ข้อมูลที่พักทั้งหมด แบ่งภาคเหนือ/อีสาน/ใต้ ภาคละ 3, ภาคกลาง 5 แต่ละรายการมี `id, name, type, region, location, rating, reviews, pricePerNight, bedrooms, renovatedMonthsAgo, images[], tags[], keywords[], description, descriptionExtra, amenities[], nearby[]` |
|                                           | `getPropertyById(id)`                   | หา property ตัวเดียวจาก id                                                                                                                                                                                                                                       |
|                                           | `getOtherProperties(excludeId, count)`  | สุ่ม/เลือกที่พักอื่นสำหรับโซน "You might also like"                                                                                                                                                                                                              |
|                                           | `facilityKeywords`                      | list คำ keyword ทั้งหมด (ดึงจาก `properties` จริง ไม่ hardcode) ใช้เป็น checkbox "Popular Filters"                                                                                                                                                               |
|                                           | `bedroomOptions` / `renovationOptions`  | ตัวเลือกตัวกรอง "จำนวนห้องนอน" / "ช่วงเวลาปรับปรุง" แต่ละตัวมีฟังก์ชัน `test()`/ค่า `maxMonths` ไว้เทียบกับที่พักจริงตอนกรอง                                                                                                                                     |
| [`regions.js`](src/data/regions.js)       | `regions` (4 ภาค), `getRegionLabel(id)` | ชื่อภาคภาษาไทย/อังกฤษ ใช้ผูกกับ `property.region` และแสดงใน breadcrumb หน้า Detail                                                                                                                                                                               |
| [`cars.js`](src/data/cars.js)             | `cars` (array, 6 คัน), `carTypes`       | ข้อมูลรถให้เช่าทั้งหมด แต่ละคันมี `id, name, type, image, rating, reviews, seats, transmission, fuel, pricePerDay` — `carTypes` ดึง type ที่ไม่ซ้ำจาก `cars` จริง ใช้เป็นตัวกรอง Car Type                                                                        |

---

## 6. ชื่อตัวแปร/State สำคัญที่ควรรู้ก่อนแก้โค้ด

เพื่อกันตั้งชื่อซ้ำ/สับสนเวลาทำงานต่อ (โปรเจกต์กลุ่ม):

| ชื่อ                                                                     | อยู่ที่ไหน                              | ความหมาย                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `booking`                                                                | `BookingContext`                        | state การจองที่พักตรงกลาง (ห้ามสร้าง state ชื่อซ้ำแยกในหน้าอื่นสำหรับข้อมูลเดียวกัน — ให้ดึงจาก `useBooking()` แทน)        |
| `selectedProperty`                                                       | `BookingContext`                        | ที่พักที่กำลังจอง (มาจาก `booking.propertyId`)                                                                             |
| `nights`, `subtotal`, `serviceFee`, `taxes`, `total`                     | หลายหน้า (Detail/Cart/Checkout/Success) | ตัวแปรคำนวณราคา คำนวณซ้ำแยกในแต่ละหน้า (ยังไม่ได้รวมเป็น helper กลาง) — ถ้าจะแก้สูตรราคาต้องแก้ให้ครบทุกหน้าที่มีตัวแปรนี้ |
| `maxPrice`, `selectedKeywords`, `selectedBedroom`, `selectedRenovations` | `AccommodationListing.jsx`              | state ตัวกรองที่พัก ยกขึ้นมาไว้ระดับหน้า (controlled component) แล้วส่งลง `FilterSidebar`                                  |
| `selectedTypes`, `maxPrice`                                              | `CarRental.jsx`                         | state ตัวกรองรถ (คนละตัวแปรกับ `maxPrice` ใน Listing แม้ชื่อเหมือนกัน เพราะอยู่คนละหน้า/scope)                             |
| `editing`                                                                | `BookingCart.jsx`                       | สลับโหมดแสดงผลปกติ ↔ โหมดแก้ไขวันที่/ผู้เข้าพัก                                                                            |
| `bookingRef`                                                             | `BookingContext`                        | เลขที่การจอง ใช้เป็นเงื่อนไข guard หน้า Success                                                                            |
| `todayISO`, `guestLimits`                                                | `BookingContext`                        | ค่าคงที่ช่วยจำกัด input (วันที่ย้อนหลัง, จำนวนผู้เข้าพักเกินขอบเขต)                                                        |

---

## 7. Design Tokens (สี/ฟอนต์)

กำหนดไว้ที่ [`src/styles/theme.css`](src/styles/theme.css) เป็น CSS variables — แก้สีทั้งเว็บให้แก้ที่ไฟล์นี้ไฟล์เดียว:

- `--color-primary` `#082340` (กรม-น้ำเงินเข้ม) — โทนหลัก header/ปุ่มหลัก/หัวเรื่อง
- `--color-secondary` `#efc265` (ทอง) — โทนรอง ปุ่ม CTA/badge/ราคา
- `--color-accent` `#6cafff` (ฟ้า) — ลิงก์/เน้นข้อมูลรอง

## 8. สิ่งที่ยังไม่ได้ทำ (Out of scope ปัจจุบัน)

- ยังไม่มีหน้ารายละเอียดรถ / ตะกร้า / checkout แยกสำหรับ flow รถเช่า (ปุ่ม "View Detail" ในหน้า Car Rental ยังเป็นปุ่มโชว์ดีไซน์เฉยๆ)
- ยังไม่มี backend/API จริง — ข้อมูลทั้งหมดเป็น mock data ในโค้ด รีเฟรชหน้าจะรีเซ็ต state การจอง (ไม่ persist)
- ฟอร์มค้นหา (`SearchBar`, `CarSearchBar`) และช่องกรอกบัตรเครดิตใน Checkout เป็น UI demo ยังไม่ได้ validate/ต่อระบบจริง
