# คู่มือการต่อเติมระบบ Checkout & Payment (Guitar Integration Guide)

เอกสารนี้จัดทำขึ้นเพื่อบันทึกรายละเอียดการนำเข้าและต่อเติมระบบชำระเงินจากโฟลเดอร์ `go-Thailand-Guitar` เข้าสู่โปรเจกต์หลัก `landing` (Next.js App Router + TypeScript) เพื่อเป็นแนวทางสำหรับทีมและผู้พัฒนาในอนาคต

---

## 1. การจับคู่ไฟล์ (File Mapping Table)

| ไฟล์เดิมใน `go-Thailand-Guitar/` | ไฟล์ใหม่ใน `landing/` | หน้าที่และการปรับปรุง |
| :--- | :--- | :--- |
| `src/components/PaymentPanel.jsx` | [src/components/checkout/PaymentPanel.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/components/checkout/PaymentPanel.tsx) | แผงเลือกวิธีชำระเงิน 3 แบบ (Card, PromptPay QR, Bank Transfer) |
| `src/components/BookingSummary.jsx` | [src/components/checkout/BookingSummary.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/components/checkout/BookingSummary.tsx) | การ์ดสรุปยอดเงิน เชื่อมต่อคำนวณราคาจริงจาก `BookingContext` |
| `src/components/CheckoutSection.jsx` | [src/components/checkout/CheckoutSection.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/components/checkout/CheckoutSection.tsx) | กล่องครอบแต่ละส่วนฟอร์มด้วย Material-UI Card และหัวข้อ |
| `src/components/FormField.jsx` | [src/components/checkout/FormField.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/components/checkout/FormField.tsx) | ฟิลด์อินพุตพร้อม Label และการแจ้งเตือน Error |
| `src/components/CarCheckout.jsx` | [src/app/(landings)/(default)/checkout/page.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/app/%28landings%29/%28default%29/checkout/page.tsx) | หน้ารวมฟอร์ม Checkout เต็มรูปแบบ |
| `Confirmation` (ใน CarCheckout) | [src/app/(landings)/(default)/booking-success/page.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/app/%28landings%29/%28default%29/booking-success/page.tsx) | หน้ายืนยันการจองสำเร็จ พร้อมรหัสอ้างอิงและ NextSteps |

---

## 2. รายละเอียดการต่อเติมเพื่อใช้งานบน `landing`

### 2.1 การเชื่อมต่อกับ State กลาง (Context Integration)

* **เดิม**: ในโค้ดของ Guitar ใช้ข้อมูลจำลองแบบคงที่ (Hardcoded) เช่น ชื่อ "John Doe", รถ Toyota Fortuner ฿7,500
* **สิ่งที่ต่อเติม**:
  1. **เชื่อมต่อกับ `useBooking()`**:
     * ดึงข้อมูลที่พัก/รถเช่าที่ผู้ใช้เลือกจริงจาก [BookingContext.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/contexts/BookingContext.tsx)
     * คำนวณราคา: `(ราคาต่อคืน × จำนวนคืน) + VAT 7%`
     * เมื่อกดยืนยัน จะเรียก `confirmBooking(customerInfo)` เพื่อบันทึกข้อมูลและสร้างรหัสการจองจริง (เช่น `GT202609071234`)
  2. **เชื่อมต่อกับ `useUser()`**:
     * ดึงข้อมูลจาก [UserContext.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/contexts/UserContext.tsx) หากผู้ใช้ล็อกอินอยู่ ระบบจะกรอกชื่อ-นามสกุล, อีเมล, และเบอร์โทรศัพท์ลงในฟอร์มอัตโนมัติ (Autofill)

### 2.2 การแปลงสถาปัตยกรรม (Architecture & Routing)

* **Directive**: ใส่ `'use client';` ไว้หัวไฟล์ทุกคอมโพเนนต์ เพื่อให้ทำงานเป็น Next.js Client Component อย่างถูกต้อง
* **Navigation**:
  * ใช้ `const router = useRouter()` จาก `next/navigation` แทน `useNavigate`
  * เมื่อชำระเงินสำเร็จจะพาไปยัง `/booking-success?ref=${ref}`
* **Suspense Wrapper**: หน้า `booking-success` ใช้ `useSearchParams()` จึงครอบด้วย `<Suspense>` เพื่อให้ Next.js สามารถ Pre-render แบบ Static Optimization ได้อย่างสมบูรณ์

### 2.3 การปรับแต่งสไตล์ (Design System & MUI v7)

* แทนที่การใช้ Tailwind class ทั่วไป ด้วย MUI components (`<Box>`, `<Card>`, `<Grid>`, `<Typography>`, `<Button>`, `<Alert>`) เพื่อให้เข้ากับระบบ Theme Palette ของ `landing`
* คงธีมสีของ Go Thailand:
  * สีหลัก (Navy): `#082340`
  * สีรอง (Gold): `#efc265` / `#c99a33`
  * พื้นหลัง: `#f8fafc`

---

## 3. การทำงานของช่องทางชำระเงิน (Payment Options)

1. **Credit / Debit Card (`card`)**:
   * มีฟิลด์: ชื่อบนบัตร, หมายเลขบัตร (จำกัด 19 หลัก), วันหมดอายุ (MM/YY), และ CVV
   * มีตัวเลือก Checkbox บันทึกบัตรสำหรับการใช้งานครั้งต่อไป
2. **PromptPay QR Code (`promptpay`)**:
   * แสดงยอดเงินสุทธิ และจำลองกล่อง PromptPay Ready
3. **Bank Transfer (`bank`)**:
   * แสดงรายละเอียดเลขที่บัญชีธนาคาร (กสิกรไทย, ไทยพาณิชย์) และข้อกำหนดการส่งหลักฐาน

---

## 4. คำแนะนำสำหรับการต่อ Payment Gateway จริงในอนาคต

เมื่อต้องการเปลี่ยนจากการทดสอบเป็นระบบตัดเงินจริง:

1. **ตัดบัตรเครดิต (เช่น Omise / Stripe)**:
   * ติดตั้ง `@stripe/stripe-js` หรือ `omise-js`
   * ใน [PaymentPanel.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/components/checkout/PaymentPanel.tsx) ให้เปลี่ยน input ธรรมดาเป็น Tokenizer Component (เช่น `CardElement` ของ Stripe)
   * ส่ง `token` ที่ได้ไปประมวลผลที่ Backend API `POST /api/payment/charge`
2. **PromptPay QR จริง**:
   * สร้าง API Route `POST /api/payment/promptpay` เพื่อเรียก API ของ Omise หรือธนาคาร แล้วส่งคืนสตริง QR Code (EMVCo payload) นำมาเรนเดอร์ด้วยไลบรารี `qrcode.react`
3. **บันทึกลง Database**:
   * ในฟังก์ชัน `handleConfirm()` ของ [checkout/page.tsx](file:///c:/WorkFile/web/JSD13/go-thailand-jsd13-grp8-s2/landing/src/app/%28landings%29/%28default%29/checkout/page.tsx) ให้เพิ่มการเรียก `POST /api/orders` เพื่อบันทึกคำสั่งซื้อลงใน MongoDB Orders collection
