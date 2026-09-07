# คู่มือการรวมระบบ Tourist Guide จาก Dev Meng เข้าสู่ Landing (MENG Integration Guide)

เอกสารนี้จัดทำขึ้นเพื่อบันทึกรายละเอียดการนำเข้าและดัดแปลงคอมโพเนนต์ **ระบบไกด์นำเที่ยว (Tourist Guide)** จากโฟลเดอร์ `GoThailand-Meng` เข้าสู่ `landing` เพื่อให้ทีมงานและผู้พัฒนารุ่นหลังเข้าใจสถาปัตยกรรมและสามารถนำไปต่อยอดได้อย่างราบรื่น

---

## 1. 📂 สรุปการจับคู่ไฟล์ (File Mapping)

| ต้นทาง (`GoThailand-Meng`) | ปลายทางใน `landing/` | การดัดแปลง / การปรับปรุง |
| :--- | :--- | :--- |
| `public/images/` (hero-beach, cta-sunset, Guide01-09) | `landing/public/images/` | ย้ายรูปภาพจริงทั้งหมดมาที่โฟลเดอร์ public เพื่อไม่ให้เกิด 404 |
| `moc-data/guides.js` | `src/data/guides.ts` | แปลงเป็น TypeScript (`Guide`, `GuideAvatarConfig`), เพิ่ม location, languages, daily rate, และใช้ `Array.from` เพื่อรองรับ ES5 |
| `components/GuideAvatar.jsx` | `src/components/guides/GuideAvatar.tsx` | แปลงเป็น React 19 + TypeScript, ใช้ React `useId()` ป้องกัน Gradient ID ชนกันเมื่อแสดงการ์ดหลายใบ |
| `components/AvailabilityCalendar.jsx` | `src/components/guides/AvailabilityCalendar.tsx` | ปรับเป็น MUI + Typography, รองรับการกดเลื่อนเดือน และส่ง callback วันที่เลือก |
| `components/GuideCard.jsx` | `src/components/guides/GuideCard.tsx` | แปลงเป็น MUI Card พร้อมมิติเงาและเอฟเฟกต์โฮเวอร์สีทอง เพิ่ม Dialog แสดงข้อมูลภาษา/ราคา และปุ่มจอง |
| `components/CtaBanner.jsx` | `src/components/guides/CtaBanner.tsx` | แปลงจาก `react-router-dom` `<Link to="...">` เป็น Next.js `<Link href="...">` พร้อมครอบด้วย MUI Box |
| `pages/TouristGuide.jsx` | `src/app/(landings)/(default)/guides/page.tsx` | สร้าง Route `/guides` รองรับ Responsive 3 คอลัมน์, ตัวกรองจุดหมาย (Bangkok/Chiang Mai), และ Pagination |
| `components/Navbar.jsx` | `src/views/landings/default/data/navbar.tsx` | เพิ่มเมนู "ไกด์นำเที่ยว" (`/guides`) บนแถบเมนูหลัก |

---

## 2. 🛠️ จุดที่ได้รับการต่อเติมและปรับปรุง (Key Architectural Enhancements)

### 2.1 การจัดการ SVG Gradient ใน `GuideAvatar`
* **ปัญหาเดิม**: หากมีการ์ดไกด์หลายใบในหน้าเดียวกัน และใช้ ID ของ `<linearGradient>` ซ้ำกัน อาจทำให้สีพื้นหลังของ Avatar แสดงผลเพี้ยน
* **วิธีแก้ใน Landing**: ใช้ Hook `useId()` จาก React ในการสร้าง `gradientId = 'grad-' + rawId.replace(/:/g, '')` ทำให้อวาตาร์ทุกใบมี Gradient Scope ที่เป็นอิสระต่อกัน 100%

### 2.2 ปฏิทินและสถานะวันว่าง (Availability Calendar)
* คงสูตรคำนวณ Deterministic Hash จาก Meng ไว้ครบถ้วน:
  ```ts
  const seed = guideId * 731 + year * 37 + month * 13 + day * 3;
  const noise = Math.abs(Math.sin(seed)) * 10000;
  const fraction = noise - Math.floor(noise);
  if (fraction > 0.55) available.push(day);
  ```
* ทำให้วันที่ว่างของไกด์แต่ละคนจะคงที่เสมอเมื่อกดเปลี่ยนเดือน และต่างกันอย่างสมจริงในแต่ละคน

### 2.3 การคลิกดูข้อมูลเพิ่มเติม ("More information" Modal)
* **ของเดิมใน Meng**: เป็นปุ่มสไตล์ Pill ซ้อนทับขอบล่างการ์ด แต่ยังไม่มี Action ผูกไว้
* **การต่อเติมใน Landing**: เมื่อคลิกปุ่มหรือคลิกวันที่ว่างบนปฏิทิน จะเปิด **MUI Dialog** แสดง:
  * ข้อมูลความเชี่ยวชาญ (Specialty) และจังหวัดที่ประจำอยู่
  * ชิปภาษาที่สื่อสารได้ (Languages Spoken)
  * อัตราค่าบริการต่อวัน (Price Per Day)
  * วันที่เลือก (Selected Date)
  * ปุ่ม **"จองไกด์นำเที่ยว"** ซึ่งส่งต่อไปยังโฟลว์ Checkout

### 2.4 ตัวกรองปลายทาง (Destination Filter)
* เพิ่มแถบกรองด่วน: **ทั้งหมด (All)**, **กรุงเทพฯ (Bangkok)**, **เชียงใหม่ (Chiang Mai)** ทำให้ผู้ใช้ค้นหาไกด์ตามพื้นที่เป้าหมายได้รวดเร็วขึ้น

---

## 3. 🔮 แนวทางการต่อยอดในอนาคต (Future Enhancements)

1. **ผูกเข้ากับ `BookingContext`**:
   * สามารถเพิ่ม field ใน `BookingContext.tsx`:
     ```ts
     selectedGuide?: Guide;
     guideBookingDate?: string;
     ```
   * เมื่อผู้ใช้กดจองไกด์ใน Dialog สามารถเรียก `selectGuide(guide, date)` แล้วส่งยอดรวมไปคิดราคารวมที่หน้า `/checkout`
2. **ต่อยอด API จริง**:
   * ในอนาคตเมื่อมีตาราง `guides` ใน MongoDB สามารถเปลี่ยนจาก mock `guides.ts` มาดึงผ่าน `GET /api/guides` ได้ทันที โดยไม่ต้องแก้ไขโครงสร้าง UI
