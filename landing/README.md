# Go Thailand — Web Application (Landing & Portal)

> 🚀 **Sprint 2 Status:** 🟢 All Technical Criteria Passed (100%) | Next.js 16.1.1 Turbopack Build: PASS (Exit 0)  
> 📖 ดูรายละเอียดสถานะโครงการแบบละเอียดได้ที่ [Root README](../README.md) และคลังเอกสารเทคนิคที่ [Documentation Hub](./docs/README.md)

---

## ⚡ Quick Start

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server (Turbopack)
npm run dev
# เปิดดูเว็บที่ http://localhost:3000

# ทดสอบ Production Build
npm run build
npm run start
```

---

## 🛠️ สรุปฟีเจอร์หลัก (Key Features Implemented)

- **Task 4 Form Validation:** ตรวจสอบ 8 ฟิลด์ก่อนบันทึก (`Name`, `Description`, `Price`, `Quantity`, `Date`, `Tag`, `Province` 77 จังหวัด, `Service Type` 4 ประเภท) ทั้งฝั่งลูกค้าและ Admin
- **Task 5 Product Showcase:** หน้ารวมสินค้าพร้อมระบบตัวกรองตามภูมิภาค จังหวัด หมวดหมู่ และการค้นหา
- **Task 6 Cart System:** จัดการตะกร้าสินค้า ปรับจำนวน คำนวณราคาสุทธิ รองรับทั้ง Guest และสมาชิก
- **Task 7 MongoDB Atlas Integration:** เชื่อมต่อ Live Database ด้วย Mongoose พร้อม API ครบทุก Entity
- **Admin Management:** หน้าจัดการสินค้า (`/admin/products`) เพิ่ม/แก้ไข/ลบ สินค้าแบบ Real-time
- **AI Travel Copilot:** ค้นหาและแนะนำสถานที่ด้วย 768-dim Vector Embeddings & Cosine Similarity บน MongoDB Atlas
- **On-Demand Vector Maps:** สถาปัตยกรรมแผนที่แบบ On-Demand เพื่อความเร็วสูงสุดในการโหลดหน้าเว็บ

---

## 📚 Technical Documentation Hub

เอกสารสถาปัตยกรรมและคู่มือทางเทคนิคทั้งหมดรวบรวมไว้ที่ [`landing/docs/`](./docs/README.md):
- [Index & Overview](./docs/README.md)
- [Task 4 Form Validation Spec](./docs/task4-form-validation.md)
- [AI Vector Embeddings & Semantic Search](./docs/ai-vector-database-guide.md)
- [On-Demand Vector Maps Note](./docs/maps-vector-ondemand-note.md)
- [Sprint 2 Verification Summary](./docs/sprint2-verification-summary.md)

