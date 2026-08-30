# แผนการนำ MongoDB มาใช้กับหน้า Order & Booking Confirmation (`goThailand-Wa`)

เอกสารนี้สรุปสถาปัตยกรรม แผนภาพกระบวนการทำงาน (Flowchart & Sequence Diagram) และโครงสร้างฐานข้อมูล **MongoDB** สำหรับระบบคำสั่งซื้อและการจองของโปรเจกต์ `goThailand-Wa`

---

## 1. แผนภาพกระบวนการทำงานของ Order (Order Data Flow Diagram)

### 1.1 กระบวนการทำงานระดับระบบ (System Architecture Flowchart)

```mermaid
flowchart TD
    subgraph Client ["Client (React App: goThailand-Wa)"]
        A["1. User Submits Checkout"] --> B["2. Order Pending State"]
        E["5. Confirmation Page Rendered"] --> F["6. Next Steps (Check Email / Pick Up)"]
    end

    subgraph Backend ["Backend API (Express.js / Node.js)"]
        B --> C["3. POST /api/orders"]
        C --> DB_Save[("Save Order to MongoDB")]
        DB_Save --> PayGate["Payment Gateway Callback"]
        PayGate --> StatusUpdate["Update Status to Paid & Confirmed"]
        StatusUpdate --> D["4. GET /api/orders/:bookingRef"]
        D --> E
    end

    subgraph Database ["MongoDB Database"]
        DB_Save --- Col_Orders[("Collection: orders")]
        Col_Orders --- Col_Users[("Collection: users")]
    end
```

---

### 1.2 ลำดับการส่งข้อมูล (Order Processing Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as ผู้ใช้งาน (User)
    participant Frontend as React App (goThailand-Wa)
    participant API as Express API Server
    participant DB as MongoDB (orders)

    User->>Frontend: กรอกข้อมูลและกดปุ่มยืนยันการจอง (Checkout)
    Frontend->>API: POST /api/orders (ข้อมูลการจองและลูกค้า)
    API->>DB: insertOne(OrderDocument) [status: "pending"]
    DB-->>API: คืนค่า _id และ bookingReference (เช่น GT-CR-2026-00128)
    API-->>Frontend: 201 Created { bookingReference: "GT-CR-2026-00128" }
    
    Note over Frontend, API: การชำระเงินสำเร็จ (Payment Completed)
    API->>DB: updateOne(status: "paid", bookingStatus: "confirmed")
    
    User->>Frontend: แสดงหน้า Confirmation Page (?ref=GT-CR-2026-00128)
    Frontend->>API: GET /api/orders/GT-CR-2026-00128
    API->>DB: findOne({ bookingReference: "GT-CR-2026-00128" })
    DB-->>API: คืนค่าข้อมูล Order แบบสมบูรณ์
    API-->>Frontend: 200 OK (Order JSON)
    Frontend-->>User: แสดงผล Hero, Reference ID, และ Next Steps Bento Grid
```

---

## 2. แผนภาพความสัมพันธ์ของข้อมูล (Data Relationship & ER Diagram)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places"
    ORDERS ||--|| CAR_ITEMS : "contains"
    ORDERS ||--|| PAYMENTS : "includes"

    USERS {
        ObjectId _id PK
        string fullName
        string email
        string phone
    }

    ORDERS {
        ObjectId _id PK
        string bookingReference UK
        ObjectId userId FK
        string bookingStatus
        date createdAt
    }

    CAR_ITEMS {
        string category
        string title
        number pricePerDay
        number totalDays
        date pickupDate
        date returnDate
    }

    PAYMENTS {
        string status
        string method
        number totalAmount
        string currency
    }
```

---

## 3. โครงสร้างฐานข้อมูล (MongoDB Schema: `orders` collection)

ตัวอย่างโครงสร้าง Document สำหรับเก็บข้อมูลการจองรถเช่า/การสั่งซื้อ:

```json
{
  "_id": "66ce7890f1a2b3c4d5e6f7a8",
  "bookingReference": "GT-CR-2026-00128",
  "userId": "66ce7000f1a2b3c4d5e6f700",
  "item": {
    "category": "car_rental",
    "title": "Toyota Fortuner 2.8 V 4WD",
    "image": "/images/cars/fortuner.png",
    "pickupLocation": "Suvarnabhumi Airport (BKK)",
    "dropoffLocation": "Suvarnabhumi Airport (BKK)",
    "pickupDate": "2026-09-01T09:00:00.000Z",
    "returnDate": "2026-09-05T18:00:00.000Z",
    "pricePerDay": 2500,
    "totalDays": 4
  },
  "pricing": {
    "subtotal": 10000,
    "tax": 700,
    "discount": 500,
    "totalAmount": 10200,
    "currency": "THB"
  },
  "customerInfo": {
    "fullName": "Somchai Jaidee",
    "email": "somchai@example.com",
    "phone": "081-234-5678",
    "idPassport": "1100800123456"
  },
  "payment": {
    "status": "paid",
    "method": "credit_card",
    "transactionId": "TXN-99887766",
    "paidAt": "2026-08-27T13:30:00.000Z"
  },
  "bookingStatus": "confirmed",
  "createdAt": "2026-08-27T13:30:00.000Z",
  "updatedAt": "2026-08-27T13:30:00.000Z"
}
```

---

## 4. รายละเอียดไฟล์และส่วนประกอบ (Files & Components Structure)

### 4.1 ฝั่ง Backend (Express + Mongoose)
- `server/config/db.js`: ตั้งค่าการเชื่อมต่อ MongoDB ผ่าน Mongoose (`process.env.MONGODB_URI`)
- `server/models/Order.js`: นิยาม Mongoose Order Schema พร้อม Index ที่ `bookingReference`
- `server/controllers/orderController.js`:
  - `createOrder`: บันทึกคำสั่งซื้อใหม่และสร้างรหัส `bookingReference`
  - `getOrderByRef`: ดึงข้อมูลคำสั่งซื้อด้วย `bookingReference`
- `server/routes/orderRoutes.js`: กำหนด API endpoints (`GET /api/orders/:bookingRef`, `POST /api/orders`)
- `server/seed/seedOrders.js`: Script สร้างข้อมูลจำลองคำสั่งซื้อสำหรับทดสอบ

### 4.2 ฝั่ง Frontend (`src/`)
- `src/services/api.js`: ฟังก์ชันสืบค้นข้อมูล order จาก backend (`fetchOrderByRef`)
- `src/components/BookingSuccessHero.jsx`: รับค่า props ข้อมูลการจองจริงมาแสดงผล
- `src/components/NextStepsBento.jsx`: แสดงขั้นตอนถัดไปตามสถานะของ Order
- `src/App.jsx`: ดึงรหัสการจองจาก URL และดึงข้อมูลจริงจาก MongoDB API

---

## 5. ลำดับขั้นตอนการพัฒนา (Implementation Phases)

1. **Phase 1: ตั้งค่า Backend & MongoDB**:
   - ติดตั้ง `express`, `mongoose`, `dotenv`, `cors`
   - สร้างไฟล์เชื่อมต่อ DB และ Schema ของ `Order`
2. **Phase 2: พัฒนา API & Data Seeding**:
   - สร้าง API Endpoint สำหรับ Query และ Create Order
   - เพิ่มข้อมูลตัวอย่างลงใน MongoDB
3. **Phase 3: เชื่อมต่อ Frontend**:
   - ปรับแต่ง React Component ใน `goThailand-Wa` ให้แสดงผล Dynamic Data
4. **Phase 4: ทดสอบระบบ (Testing & Verification)**:
   - ทดสอบสร้าง Order และดึงข้อมูลแสดงผลบน UI
