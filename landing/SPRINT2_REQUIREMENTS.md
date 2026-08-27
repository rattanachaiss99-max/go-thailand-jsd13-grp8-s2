# Sprint 2 — Requirements (MERN E-Commerce)

อ้างอิงจาก Excel requirement ที่อาจารย์ให้
อัปเดตล่าสุด: 2026-08-27

---

## 📋 ภาพรวมโปรเจกต์

- **ประเภท:** E-Commerce Application (MERN Stack)
- **ธุรกิจ:** เลือก **ธุรกิจเดียว (ไม่ใช่ marketplace)** มี Product หลากหลาย
  - 💡 เราเลือก: **Go Thailand — ท่องเที่ยว/จำหน่ายสถานที่ท่องเที่ยวและแพ็กเกจทัวร์**
  - Product สามารถเป็น **บริการ (service)** ได้ เช่น ทัวร์เที่ยวเชียงใหม่, ที่พัก, แพ็กเกจดำน้ำ
- **ห้าม:** สินค้าผิดกฎหมาย หรือขัดวัฒนธรรม
- **Payment:** **ไม่ต้องต่อของจริง** — จำลองการชำระเงินสำเร็จได้

---

## ✅ Assessment Criteria — Checklist

### Technical skills — Task 4 (Form Validation)

- [ ] False→ต้องทำ: ทุกช่องฟอร์ม validate ตอน submit (Name, Description, Price, Quantity, Date, Tag)
- [ ] False→ต้องทำ: แสดง error message ที่มีความหมายเมื่อช่องผิด
- [x] False→ต้องทำ: UI สร้างด้วย React ✅ (เราใช้ Next.js/React แล้ว)

### Technical skills — Task 5 (E-Commerce Components)

- [ ] False→ต้องทำ: React components แสดงเว็บ e-commerce: product info, cart, checkout
- [ ] False→ต้องทำ: React component แสดงรายการสินค้า (product list)
- [ ] False→ต้องทำ: ใช้ JSX ถูกต้องร่วมกับ library ที่เลือก

### Technical skills — Task 6 (Cart API — User)

- [ ] False→ต้องทำ: **GET** `/products/<user_id>` คืนสินค้าในตะกร้าของ user นั้น
- [ ] False→ต้องทำ: **POST** บันทึกสินค้าที่เลือกลงตะกร้า
- [ ] False→ต้องทำ: **DELETE** ลบรายการออกจากตะกร้า
- [ ] False→ต้องทำ: **PUT** อัปเดตสถานะรายการ เช่น quantity

### Admin User Features (Product CRUD)

- [ ] False→ต้องทำ: **POST** สร้างสินค้าใหม่ลงร้าน
- [ ] False→ต้องทำ: **PUT** แก้ไขสินค้าในระบบ
- [ ] False→ต้องทำ: **DELETE** ลบสินค้าออกจากระบบ
- [ ] False→ต้องทำ: **GET** ดึงสินค้าทั้งหมดในร้านมาแสดง

### Technical skills — Task 7 (MongoDB + Mongoose)

- [x] False→ต้องทำ: CRUD ทุกตัวต้องต่อ MongoDB จริง
- [x] False→ต้องทำ: Mongoose ติดตั้งเป็น dependency (npm) ✅ — มีใน package.json แล้ว
- [ ] False→ต้องทำ: Mongoose + DB setup ถูกต้อง ไม่มี error ตอน start server

### Technical skill — Coding Fluency (ประเมินตลอด Sprint)

- [ ] False→ต้องทำ: เข้าใจแนวคิดโปรแกรมมิ่ง สามารถ implement ได้
- [ ] False→ต้องทำ: อธิบายพฤติกรรมโค้ดทั้งหมดได้
- [ ] False→ต้องทำ: แปลความคิดเป็นโค้ดโดยไม่ยากลำบาก

---

## 📊 สถานะปัจจุบัน (อิงโค้ดที่มีแล้ว)

| หมวด              | สิ่งที่ทำไปแล้ว                          | สิ่งที่ยังขาด                       |
| ----------------- | ---------------------------------------- | ----------------------------------- |
| User backend      | ✅ Mongoose models (User/Customer/Admin) | —                                   |
| Auth API          | ✅ register/login/me                     | ❌ logout, ❌ forgot-password route |
| Task 4 Form       | ❌ ยังไม่มีฟอร์มสินค้า                   | ต้องทำ validate ครบช่อง             |
| Task 5 Components | ❌ ยังไม่มี Product/Cart/Checkout UI     | ต้องสร้าง                           |
| Task 6 Cart API   | ❌ ไม่มี Cart model/route                | ต้องทำ CRUD ตะกร้า                  |
| Admin CRUD        | ❌ ไม่มี Product model/route             | ต้องทำ CRUD สินค้า                  |
| Task 7 DB         | ✅ Mongoose พร้อม                        | ❌ ยังไม่มี Product/Cart collection |

---

## 🗺️ แผนงานแนะนำ (เรียงตาม Rubric)

### Wave 1 — โครงสร้างข้อมูล (Task 7 พื้นฐาน)

1. สร้าง `Product` model (name, description, price, quantity, date, tag, isService, imageUrl)
2. สร้าง `Cart` model (userRef, items[], status)
3. ต่อ Mongoose ให้เปิดเซิร์ฟเวอร์ไม่ error

### Wave 2 — Admin Product CRUD (Admin Features)

4. `POST /api/products` สร้างสินค้า
5. `PUT /api/products/:id` แก้ไข
6. `DELETE /api/products/:id` ลบ
7. `GET /api/products` ดึงทั้งหมด

### Wave 3 — User Cart API (Task 6)

8. `POST /api/cart` เพิ่มลงตะกร้า
9. `GET /api/cart/:user_id` ดูตะกร้า
10. `PUT /api/cart/:id` อัปเดต quantity
11. `DELETE /api/cart/:id` ลบรายการ

### Wave 4 — UI Components (Task 5)

12. `ProductList` component
13. `ProductInfo` component
14. `Cart` component
15. `Checkout` component (จำลองชำระเงิน)

### Wave 5 — Form Validation (Task 4)

16. ตรวจ Name/Description/Price/Quantity/Date/Tag ตอน submit
17. แสดง error message มีความหมาย

---

## 📝 หมายเหตุสำหรับทีม

- Stack เราเป็น **Next.js (React+Node ในตัว) + Mongoose** → ครอบคลุม MERN ยกเว้นแยก Express server (Next API routes ทำหน้าที่แทน)
- Payment จำลองได้ → ไม่ต้อง Stripe จริง
- Product เป็น "service" ได้ → เพิ่ม field `isService: boolean` ใน Product model
- ห้ามลืมแก้ rubric เป็น ✅ เมื่อทำเสร็จ (อัปเดตไฟล์นี้)
- ดูโครง User backend เพิ่มเติมใน `src/server/README.md`
- ดูสถานะ backend ใน `TODO_BACKEND.md`

---

_เอกสารนี้สรุป requirement Sprint 2 จาก Excel เพื่อให้ทีมทำตรงตาม Rubric และเช็คสถานะว่าทำอะไรไปแล้วบ้าง_
