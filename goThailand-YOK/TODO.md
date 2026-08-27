# TODO — เทียบงานกับ Team_task.md

> เทียบ `Team_task.md` (งานที่มอบหมายให้ YOK / Dev D: Product Card, Product List, ตะกร้า, ชำระเงิน) กับโค้ดจริงในรีโปนี้
> ตรวจเมื่อ: 2026-08-27

## งานที่ได้รับมอบหมาย (จาก Team_task.md)

จากบรรทัดบนสุดของ `Team_task.md`:

> **YOK** - ร่างแบบ Accommodation **Product Card/List, ตะกร้า, ชำระเงิน**

และใน Sprint Backlog ตรงกับ **Dev D**:

| GT / ID          | งาน                                  | เกี่ยวกับ    |
| ---------------- | ------------------------------------ | ------------ |
| —                | Product Card : รายละเอียด            | Req #2/#3    |
| `GT06`           | Card : ตัวอย่าง html                 | Product Card |
| `GT09` / `S2-14` | ตะกร้าสินค้า                         | Cart         |
| `GT10` / `S2-15` | หน้าชำระเงิน                         | Checkout     |
| `GT11` / `S2-16` | หน้าสรุปรายการ                       | Confirm      |
| `S2-12`          | Product Card component               | React        |
| `S2-13`          | Product List — หน้ารวมสินค้า/สถานที่ | React        |

---

## ✅ ทำไปแล้ว

- **Product Card** — [`PropertyCard.jsx`](src/components/PropertyCard.jsx) (โหมด `list`/`mini`) และ [`CarCard.jsx`](src/components/CarCard.jsx) → ครอบคลุม `GT06`, `S2-12`
- **Product List** — [`AccommodationListing.jsx`](src/pages/AccommodationListing.jsx) (ค้นหา + filter ราคา/keyword/ห้องนอน/ช่วงปรับปรุง) และ [`CarRental.jsx`](src/pages/CarRental.jsx) (filter ประเภทรถ/ราคา) → ครอบคลุม `S2-13`
- **ตะกร้า** — [`BookingCart.jsx`](src/pages/BookingCart.jsx) + [`OrderSummary.jsx`](src/components/OrderSummary.jsx) (แก้วันที่/จำนวนผู้เข้าพักได้ในตะกร้า) → ครอบคลุม `GT09`, `S2-14` **(เฉพาะที่พัก)**
- **หน้าชำระเงิน** — [`Checkout.jsx`](src/pages/Checkout.jsx) (ฟอร์มลูกค้า + เลือกวิธีจ่าย + สรุปยอด) → ครอบคลุม `GT10`, `S2-15` **(เฉพาะที่พัก)**
- **หน้าสรุปรายการ** — [`BookingSuccess.jsx`](src/pages/BookingSuccess.jsx) (เลข booking ref + guard ห้ามเข้าตรง ๆ) → ครอบคลุม `GT11`, `S2-16` **(เฉพาะที่พัก)**
- **State กลาง** — `BookingContext` เชื่อม Detail → Cart → Checkout → Success ครบ flow ที่พัก
- **รูปภาพ** — มีรูปจริงครบทั้งที่พัก (14 รายการ) และรถ (6 คัน) แล้ว ไม่ใช่ placeholder ว่างเปล่าเหมือนที่ Sprint 1 เคยติดปัญหาไว้
- ทำเกินขอบเขตเดิม: เพิ่ม flow **รถเช่า** (Home, `CarRental.jsx` list, `CarDetail.jsx`) ที่ไม่ได้อยู่ใน backlog เดิม

## ❌ สิ่งที่ยังขาด / ต้องทำต่อ

- [ ] **ตะกร้า/ชำระเงิน/สรุปรายการฝั่งรถเช่า** — `CarDetail.jsx` ปุ่ม "Book Now" ยังเป็นปุ่มโชว์ดีไซน์เฉย ๆ ไม่มีหน้าตะกร้า/checkout/success ของสายรถเช่าเลย (ระบุไว้ใน README ข้อ 8 แล้ว) — ถ้า scope ต้องครอบคลุมรถเช่าด้วย ต้องทำ 3 หน้านี้เพิ่ม หรือตัดสินใจร่วม `BookingContext` เดิม/แยก context ใหม่

- [ ] **ฟอร์มค้นหา (`SearchBar`, `CarSearchBar`) ยังไม่ผูก logic จริง** — กดค้นหาไม่ filter อะไร (ยอมรับได้ตามที่ README ระบุว่าเป็น demo UI แต่ควรเป็นรายการที่ต้องคุยกับทีมว่าจะทำต่อไหม)
- [ ] **เมนู "Local Guide" ใน Header ยังเป็น anchor `#guide` ที่ไม่มีปลายทางจริง** — ไม่ใช่ scope ของ Dev D โดยตรง แต่ Header เป็นไฟล์ที่แก้ร่วม ควรเช็คว่ามีคนอื่นทำหน้านี้อยู่หรือยัง
