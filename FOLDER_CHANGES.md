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

- MongoDB models: `User` (base) / `Customer` (สมาชิก) / `Admin`
- Auth API: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- หน้า `/register` (แท็บ สมัคร/ล็อกอิน/ลืมรหัส)
- ปุ่ม "สมัครสมาชิก / ล็อกอิน" บน Hero หน้าแรก → ลิงก์ `/register`
- `.env.example` + `TODO_BACKEND.md`

ดูรายละเอียด backend เพิ่มเติมใน `landing/src/server/README.md`
ดูสิ่งที่ยังไม่ทำใน `landing/TODO_BACKEND.md`

---

_เอกสารนี้เขียนขึ้นเพื่อบันทึกว่าสถานที่เก็บโค้ดเปลี่ยนจาก go-thailand-app-dev มาที่โฟลเดอร์ทีมแล้ว_
