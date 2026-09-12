# 🚀 Sprint 3 — Planning & Roadmap Note (Go Thailand)

> **บันทึกแผนงานและสิ่งที่ต้องต่อยอดใน Sprint 3**  
> จัดทำสำหรับ: **JSD13 ทีม 8 (Go Thailand)**  
> วันที่บันทึก: **12 กันยายน 2026**

---

## 🎯 สรุปเป้าหมายหลักใน Sprint 3

ใน Sprint 2 เราได้สร้างระบบ MERN E-Commerce, Product CRUD, Central Auth, และรวมหน้า Landing พร้อมแสดงผล UI Dashboard และสกีมาการจองรถของ Guitar เรียบร้อยแล้ว  
**เป้าหมายของ Sprint 3 คือ**: การนำ Microservices ของทุกคนขึ้น Render.io จริง, แยกสถาปัตยกรรม Dashboard ให้เป็นสัดส่วน, และต่อยอดระบบ Production ให้ครบวงจร

---

## 📌 5 สิ่งสำคัญที่ต้องทำ/เพิ่มใน Sprint 3

```
+-------------------------------------------------------------------------------+
|                             SPRINT 3 ROADMAP                                  |
+-------------------------------------------------------------------------------+
|  1. แยกสถาปัตยกรรม Dashboard (Customer Portal vs Admin Dashboard)              |
|  2. เชื่อมต่อ Car Booking Service สดจาก Render.io ของ Guitar                  |
|  3. อัปเกรดระบบชำระเงิน (Payment Gateway / Omise / PromptPay EMVCo)            |
|  4. การผสาน Microservices ทั้ง 5 ของทีม (Distributed Federation)              |
|  5. ระบบแจ้งเตือนหลังการจอง (Email Confirmation & Travel Passport Trophy)     |
+-------------------------------------------------------------------------------+
```

---

### 1. 🗂️ การแยกสถาปัตยกรรม Dashboard (Dashboard Separation Architecture)

* **แยกตามบทบาท (Role Separation)**:
  * **Customer Dashboard (`/dashboard`)**:
    * ยกระดับเป็น **Customer Portal** สำหรับนักท่องเที่ยว/ลูกค้าโดยเฉพาะ
    * แสดงเฉพาะทริปของตัวเอง (รถเช่า, ที่พัก, ไกด์), แต้มสะสม Gold Member, และ e-Ticket
    * ติดตั้ง **Auth Guard Middleware** หากยังไม่ล็อกอิน ให้ Redirect ไปหน้า Login ทันที
  * **Admin / Partner Dashboard (`/admin` หรือ `admin.gothailand.com`)**:
    * แยกส่วนการจัดการหลังบ้านออกมาจากหน้าลูกค้า
    * แสดงภาพรวมยอดขายรวมทั้งแพลตฟอร์ม (Total Revenue), ยอดจองรถและที่พักทั้งหมด
    * จัดการสต็อกสินค้า/บริการ และกดยืนยันหรือยกเลิกออเดอร์
* **แยกตามประสิทธิภาพ (Performance & Bundle Size)**:
  * หน้า Landing Page (`/`): มุ่งเน้นความเร็วสูงสุด (SSG) และ SEO
  * หน้า Dashboard (`/portal` หรือ Subdomain): เน้น Data-Heavy และ Realtime Data Fetching

---

### 2. 🚗 การเชื่อมต่อ Car Booking Service บน Render.io (Guitar Integration E2E)

* **เชื่อมต่อ Endpoint จริง**:
  * เมื่อฝั่ง Booking (Guitar) นำ Server ขึ้น Render.io สำเร็จ นำ URL จริงมากำหนดใน `landing/.env`:
    ```env
    NEXT_PUBLIC_CAR_SERVICE_URL=https://<guitar-booking-service>.onrender.com
    ```
* **ทดสอบ End-to-End Flow**:
  1. ลูกค้าทำรายการจองรถผ่านหน้า `CarCheckout`
  2. ข้อมูลถูกส่งไปบันทึกลง MongoDB Atlas ของ Car Service
  3. หน้า Customer Dashboard ดึงรายการสดผ่าน `GET /api/bookings?email=...` มาเรนเดอร์ลงในการ์ด `CarBookingDetailCard` ครบทั้ง 22 ฟิลด์ทันที
* **การจัดการ Cold Start & Uptime**:
  * เพิ่ม Loading Skeleton หรือ Spinner ขณะรอ Render Free Tier ตื่น (30-50 วินาที)
  * ตั้งระบบ Ping / Uptime Monitor ป้องกัน Server หลับ

---

### 3. 💳 การยกระดับระบบชำระเงิน (Real Payment Gateway & Security)

* **Payment Gateway Integration**:
  * ยกระดับจากการจำลองการจ่ายเงิน สู่การต่อ Payment Gateway จริง (เช่น Omise หรือ Stripe Sandbox)
  * บัตรเครดิต: ใช้ Tokenization ผ่าน Component ของผู้ให้บริการ (เช่น Stripe Elements หรือ Omise.js) โดย **ไม่ส่งข้อมูลเลขบัตรและ CVV ผ่านเซิร์ฟเวอร์เราโดยตรง**
  * พร้อมเพย์ (PromptPay QR): ดึง Payload QR Code มาตรฐาน EMVCo มาแสดงผลผ่าน `qrcode.react` พร้อมตรวจสอบยอดเงินอัตโนมัติ
* **การจัดการสลิปโอนเงิน (Slip Verification)**:
  * อัปโหลดสลิปธนาคารและตรวจสอบยอดผ่าน Webhook หรือ API ตรวจสลิป

---

### 4. 🌐 การรวมศูนย์ 5 Microservices ของทีม (Distributed Federation)

รวบรวมและทดสอบการเชื่อมต่อ API จากเพื่อนร่วมทีมทั้ง 5 คน:

| สมาชิก | บริการ (Service) | หน้าที่ | พอร์ต Local | การแชร์ Auth |
| :--- | :--- | :--- | :--- | :--- |
| **ส่วนกลาง** | `user-service` | ยืนยันตัวตน, สมาชิก, JWT | :5001 (Render) | ออก Bearer JWT Token |
| **Dev Yok** | `stay-service` | ที่พักและแพ็กเกจห้องพัก | :5002 | ตรวจสอบ JWT Token |
| **Dev Wa** | `order-service` | ตะกร้าและประวัติคำสั่งซื้อ CRM | :5003 | บันทึก Orders ผูกกับ `userId` |
| **Dev Guitar** | `car-booking-service` | จองรถเช่าและการชำระเงิน | :5004 / 5002 | บันทึก Car Bookings & Payments |
| **Dev Meng** | `guide-service` | ไกด์นำเที่ยวและปฏิทินวันว่าง | :5005 | จองและคำนวณคิวงานไกด์ |

---

### 5. 📬 ฟีเจอร์หลังการจอง & Customer Experience (Post-Booking Features)

* **Email Confirmation & E-Ticket (E-Voucher)**:
  * ส่งอีเมลยืนยันการจองพร้อมรหัสอ้างอิง (`bookingReference`), รายละเอียดคนขับรถ, และจุดรับรถ ไปยังอีเมลลูกค้า (ผ่าน Nodemailer / SendGrid)
* **Travel Passport & Gamification (ระบบแสตมป์ท่องเที่ยว)**:
  * เมื่อทริปเสร็จสิ้น (`status: 'completed'`) ปลดล็อกแสตมป์จังหวัดและเหรียญรางวัล (Trophy) ในพาสปอร์ตของผู้ใช้
* **ระบบรีวิวและประเมินความพึงพอใจ (Ratings & Reviews)**:
  * เปิดให้ลูกค้าที่เดินทางเสร็จสิ้นสามารถให้คะแนนดาวและเขียนรีวิวการบริการรถเช่าและที่พักได้จริง
