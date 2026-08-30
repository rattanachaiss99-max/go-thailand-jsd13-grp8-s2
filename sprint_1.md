# Sprint 1 — Design Phase

> เอกสารนี้แยกมาจาก `README.md` เพื่อให้ README โฟกัสเฉพาะ Sprint 2
> อัปเดตล่าสุด: 2026-08-24

# 📋 Sprint Backlog — Go Thailand (GT)

> JSD13 ทีม 8 · สมาชิก 5 คน (Dev A – Dev E)
> Kanban: [Team-8 | JSD Project Board](https://wax-thrill-937.notion.site/Team-8-JSD-Project-Board-32e69220d6c445618caf5cfa93401e43) (Notion)
> อัปเดตล่าสุด: 2026-08-24

---

## 🎯 โปรเจกต์นี้คืออะไร

**Go Thailand** = เว็บแอปพลิเคชัน **ท่องเที่ยว/จำหน่ายสินค้าและสถานที่ท่องเที่ยว**
ไม่ใช่แค่เว็บแนะนำตัว — มีระบบสมาชิก ตะกร้าสินค้า ชำระเงิน และหลังบ้านจัดการสินค้า

**ขอบเขตตาม Requirement บนบอร์ด**

| Requirement   | เนื้อหา                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **#1 (GT00)** | ออกแบบฐานข้อมูล (BMC, Use Case, ER-Diagram, MongoDB Schema) + Wireframe + ลงทะเบียน (GT12) + Dashboard |
| **#2 (GT00)** | การแสดงผลข้อมูล (Product & Shopping)                                                                   |
| **#3 (GT00)** | การจัดวางข้อมูล (Product Card & Product List)                                                          |

---

## 🗂️ วิธีใช้เอกสารนี้กับ Notion

เอกสารนี้ **ไม่แทนบอร์ด** — บอร์ดคือแหล่งความจริง เอกสารนี้คือสรุปว่า _ใครทำอะไร และงานไหนรอใคร_

**คอลัมน์บนบอร์ด (Design Phase)**
`Backlog` → `To Do` → `In Progress` → `Done`

**ระดับความสำคัญที่บอร์ดใช้อยู่**
🔴 High · 🟡 Medium · 🟢 Low

**Property ที่ควรเพิ่มในการ์ด** (ถ้ายังไม่มี)

| Property     | ชนิด     | ค่า                                      |
| ------------ | -------- | ---------------------------------------- |
| `Assignee`   | Person   | Dev A – Dev E                            |
| `Sprint`     | Select   | `Sprint 1 – Design` / `Sprint 2 – React` |
| `Blocked by` | Relation | โยงไปการ์ดที่ต้องรอ                      |
| `GT Code`    | Text     | `GT08`, `GT12` … (มีในชื่อการ์ดแล้ว)     |

> ⚠️ **กฎ:** การ์ดที่มี `Blocked by` ยังไม่ `Done` → ห้ามลากเข้า `In Progress`

---

## 🏃 Sprint 1 — Design Phase (งานออกแบบ)

**เป้าหมาย:** ออกแบบฐานข้อมูล + Wireframe + ต้นแบบ HTML/CSS ให้ครบก่อนเขียน React
**เกณฑ์ตรวจ Sprint 1 (จากบอร์ด):**

1. อธิบายแนวทางได้หลายวิธี + ชี้ข้อดีข้อเสียของแต่ละวิธี
2. ตัดสินใจอย่างมีเหตุผลโดยพิจารณาข้อจำกัด
3. นำแนวทางไปปฏิบัติได้เต็มที่ **โดยไม่ต้องอาศัยความช่วยเหลือจากผู้สอน**

> 💡 เกณฑ์ข้อ 1–2 หมายความว่า **ต้องมีบันทึกเหตุผล** ไม่ใช่ส่งแค่ผลงาน — ทุกการ์ดควรมีหมายเหตุว่า _เลือกวิธีนี้เพราะอะไร ตัดวิธีอื่นเพราะอะไร_

### 1.1 งานวางแผน / เอกสาร

| GT     | งาน                                 | ผู้รับผิดชอบ | ระดับ     | กำหนด   | รอ     |
| ------ | ----------------------------------- | ------------ | --------- | ------- | ------ |
| `GT00` | Requirement : Sprint #1             | Dev A        | 🔴 High   | 1 ส.ค.  | —      |
| `GT01` | Business Model Canvas — Go Thailand | Dev A        | 🟡 Medium | 30 ก.ค. | `GT00` |
| —      | Use Case Diagram                    | Dev A        | 🟢 Low    | 10 ส.ค. | `GT01` |

### 1.2 งานออกแบบฐานข้อมูล

| GT     | งาน                                            | ผู้รับผิดชอบ | ระดับ     | กำหนด   | รอ         |
| ------ | ---------------------------------------------- | ------------ | --------- | ------- | ---------- |
| —      | ER-Diagram : แผนภาพฐานข้อมูล                   | Dev B        | 🔴 High   | 6 ส.ค.  | Use Case   |
| —      | ER-Diagram : เพิ่มฐานข้อมูล (User & Admin)     | Dev B        | 🟡 Medium | —       | ER-Diagram |
| —      | Admin UI > ER-Diagram : เพิ่มฐานข้อมูล (Admin) | Dev B        | 🟡 Medium | —       | ER-Diagram |
| `GT07` | ตัวอย่าง DB : BKK-001                          | Dev B        | 🟡 Medium | 31 ก.ค. | ER-Diagram |
| —      | MongoDB : ฐานข้อมูล (Schema Design)            | Dev B        | 🟢 Low    | —       | `GT07`     |

### 1.3 งานลงทะเบียน / สมาชิก

| GT     | งาน                                                        | ผู้รับผิดชอบ | ระดับ     | กำหนด  | รอ                  |
| ------ | ---------------------------------------------------------- | ------------ | --------- | ------ | ------------------- |
| `GT12` | Registration : รายละเอียด                                  | Dev C        | 🟡 Medium | 6 ส.ค. | `GT00`              |
| `GT13` | Registration > UI : รูปแบบการสมัคร                         | Dev C        | 🟢 Low    | 6 ส.ค. | `GT12`              |
| `GT14` | Registration > UI : การล็อกอิน                             | Dev C        | 🟢 Low    | —      | `GT12`              |
| `GT15` | Registration > UI : โปรไฟล์ผู้ใช้งาน                       | Dev C        | 🟢 Low    | —      | `GT12`              |
| —      | **เพิ่มฐานข้อมูล** > Registration > UI : ช่องกรอกเพิ่มเติม | Dev C        | 🔴 High   | —      | `GT12` + ER-Diagram |
| —      | ประเภทผู้ใช้ > Registration > UI : ช่องกรอกเพิ่มเติม       | Dev C        | 🟡 Medium | —      | ER-Diagram          |
| —      | Registration > UI : ช่องกรอกเพิ่มเติม                      | Dev C        | 🟢 Low    | —      | `GT12`              |

### 1.4 งานสินค้า / ตะกร้า (Requirement #2, #3)

| GT     | งาน                                         | ผู้รับผิดชอบ | ระดับ     | กำหนด   | รอ           |
| ------ | ------------------------------------------- | ------------ | --------- | ------- | ------------ |
| —      | Product Card : รายละเอียด                   | Dev D        | 🔴 High   | 30 ก.ค. | `GT00`       |
| —      | Product Card : Requirement #1               | Dev D        | 🟡 Medium | 8 ส.ค.  | Product Card |
| `GT06` | Card : ตัวอย่าง html                        | Dev D        | 🟢 Low    | 6 ส.ค.  | Product Card |
| `GT09` | Product Card > Shopping Cart : ตะกร้าสินค้า | Dev D        | 🟢 Low    | 6 ส.ค.  | Product Card |
| `GT10` | Product Card > Check-Out : หน้าชำระเงิน     | Dev D        | 🟢 Low    | 6 ส.ค.  | `GT09`       |
| `GT11` | Product Card > Confirm : หน้าสรุปรายการ     | Dev D        | 🟢 Low    | 6 ส.ค.  | `GT10`       |

### 1.5 งานหน้าเว็บ / แบรนด์ / Dashboard

| GT     | งาน                                          | ผู้รับผิดชอบ | ระดับ  | กำหนด  | รอ                 |
| ------ | -------------------------------------------- | ------------ | ------ | ------ | ------------------ |
| —      | โลโก้ Go-Thailand                            | Dev E        | 🟢 Low | 1 ส.ค. | —                  |
| `GT08` | Landing Page (หน้าหลัก) : แสดงสินค้า/สถานที่ | Dev E        | 🟢 Low | 6 ส.ค. | โลโก้              |
| —      | ออกแบบ Landing page Banner                   | Dev E        | 🟢 Low | 2 ส.ค. | โลโก้              |
| `GT16` | User UI > Dashboard : รายละเอียด             | Dev E        | 🟢 Low | —      | `GT12`             |
| `GT17` | Admin UI > Dashboard : รายละเอียด            | Dev E        | 🟢 Low | —      | ER-Diagram (Admin) |
| `GT18` | Admin UI > Management : จัดการสินค้า         | Dev E        | 🟢 Low | —      | `GT17`             |
| —      | Dashboard : รายละเอียด                       | Dev E        | 🟢 Low | —      | `GT16` `GT17`      |

### 1.6 งาน Implementation (จุดเชื่อมไป Sprint 2)

| GT  | งาน                             | ผู้รับผิดชอบ | ระดับ   | รอ               |
| --- | ------------------------------- | ------------ | ------- | ---------------- |
| —   | **Implementation : CSS & HTML** | ทั้งทีม      | 🔴 High | งานออกแบบทั้งหมด |

**ผลลัพธ์ของการ์ดนี้ = โฟลเดอร์ `go-thailand-jsd13-grp8-main/`**

สิ่งที่ทำได้จริงแล้ว (4 หน้า + Design System):

| ไฟล์                           | เนื้อหา                                       |
| ------------------------------ | --------------------------------------------- |
| `shared/styles/variables.css`  | Design Token — สี ฟอนต์ spacing radius shadow |
| `shared/styles/reset.css`      | ล้างค่าเริ่มต้นเบราว์เซอร์                    |
| `shared/styles/components.css` | navbar / btn / card / badge / footer          |
| `apps/main-website/`           | หน้าแรก + เกี่ยวกับเรา                        |
| `apps/admin-dashboard/`        | sidebar + stat card 3 ใบ                      |
| `apps/landing-page/`           | หน้าโปรโมชัน                                  |
| `vercel.json`                  | clean URL สำหรับ deploy                       |

> ⚠️ **ยังไม่ได้ทำใน HTML/CSS** (ออกแบบไว้แล้วแต่ยังไม่มีหน้าจริง): `GT09` ตะกร้า · `GT10` ชำระเงิน · `GT11` สรุปรายการ · `GT12`–`GT15` ลงทะเบียน/ล็อกอิน/โปรไฟล์ · `GT16`–`GT18` Dashboard ผู้ใช้/แอดมิน/จัดการสินค้า · Product Card / Product List
> → **งานเหล่านี้ยกไป Sprint 2 ทำบน React โดยตรง** (ไม่ต้องเขียน HTML ทิ้งอีกรอบ)

### 📌 บทเรียนจาก Sprint 1

1. `shared/assets/images/` และ `icons/` **ว่างเปล่า** — ยังไม่มีรูปสินค้า/สถานที่เลย ทั้งที่เป็นเว็บท่องเที่ยว
2. `vercel.json` ทำ clean URL ได้ **เฉพาะบน Vercel** — รันบนเครื่องต้องใช้ path เต็ม
3. CSS ใช้ path absolute → **เปิดไฟล์ตรง ๆ เว็บพัง** ต้องรันผ่าน web server
4. ต้นแบบเป็น dark theme ล้วน — Sprint 2 เปลี่ยนเป็น light เป็นค่าเริ่มต้น
5. **ออกแบบไว้เยอะกว่าที่ implement** — Sprint 2 จึงไม่ใช่ "ย้ายของเก่า" แต่เป็น "ย้าย + สร้างที่ยังไม่มี"
