# คู่มือการออกแบบและการเชื่อมต่อระบบตรวจสอบสถานะผู้ใช้งานกลาง (Centralized User Auth & Profile Integration Guide)

เอกสารนี้จัดทำขึ้นสำหรับทีมพัฒนา **Go Thailand (JSD13 Grp8)** ทุกคน เพื่อเป็นมาตรฐานกลางในการตรวจสอบสถานะผู้ใช้งาน (Authentication & User Profile) จากทุกโฟลเดอร์ (`landing`, `goThailand-YOK`, `goThailand-Wa`, `go-Thailand-Guitar`, `GoThailand-Meng`)

---

## 1. 🌐 สถาปัตยกรรมระบบ (System Architecture)

ระบบกำหนดให้โฟลเดอร์ **`landing/` (Next.js 16 App Router)** เป็น **Single Source of Truth** สำหรับข้อมูลผู้ใช้งานและฐานข้อมูล MongoDB

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MongoDB Database (Collection: users)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │     Central Backend API: landing (http://localhost:3000)│
       │                                                        │
       │  • POST /api/auth/register                             │
       │  • POST /api/auth/login                                │
       │  • GET  /api/auth/me      <-- เช็คสถานะผู้ใช้ (เปิด CORS)│
       │  • OPTIONS /api/auth/me   <-- รองรับ Preflight ข้ามพอร์ต│
       └────────────────────────────┬───────────────────────────┘
                                    │ (REST API / Bearer JWT)
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ landing/         │      │ goThailand-Wa/   │      │ go-Guitar / YOK /│
│ (Next.js :3000)  │      │ (Vite :5173)     │      │ Meng (Vite)      │
│ ใช้ UserContext  │      │ เรียก authService│      │ เรียก authService│
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 2. 📋 ข้อกำหนด API ส่วนกลาง (Central API Contract)

### 2.1 Endpoint ตรวจสอบผู้ใช้: `GET /api/auth/me`

* **URL**: `http://localhost:3000/api/auth/me`
* **Method**: `GET`
* **Headers**:
  ```http
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```

#### กรณีที่ 1: ตรวจสอบสำเร็จ (200 OK)
ส่งคืนข้อมูลตามโครงสร้างของ `Customer` Discriminator Model:
```json
{
  "isAuthenticated": true,
  "user": {
    "_id": "66ce7000f1a2b3c4d5e6f700",
    "email": "somchai@example.com",
    "role": "customer",
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "phone": "081-234-5678",
    "avatarUrl": null,
    "membershipTier": "gold",
    "points": 4500,
    "bookingCount": 12,
    "wishlist": ["wat-arun-bkk", "doi-inthanon", "maya-bay"],
    "addresses": [
      {
        "label": "บ้าน",
        "line1": "123 ถ.สุขุมวิท ซอย 4",
        "city": "คลองเตย",
        "province": "กรุงเทพมหานคร",
        "postalCode": "10110",
        "country": "TH"
      }
    ],
    "preferredLanguage": "th"
  }
}
```

#### กรณีที่ 2: ยังไม่ล็อกอิน หรือ Token หมดอายุ (401 Unauthorized)
```json
{
  "isAuthenticated": false,
  "user": null,
  "error": "ไม่พบ token หรือ token หมดอายุ"
}
```

---

### 2.2 การปลดล็อก CORS (Cross-Origin Resource Sharing)
ฝั่ง Backend (`landing/src/app/api/auth/me/route.ts`) ได้รับการตั้งค่า Response Headers ดังนี้:
* `Access-Control-Allow-Origin: *` (หรือ Origin ของ Vite)
* `Access-Control-Allow-Methods: GET, POST, OPTIONS`
* `Access-Control-Allow-Headers: Content-Type, Authorization`
* รองรับ Method `OPTIONS` สำหรับ Browser Preflight Request

---

## 3. 📦 โค้ด Client สำหรับทุกคนนำไปใช้ (`authService.js`)

เพื่อนๆ ในโฟลเดอร์ `goThailand-YOK`, `goThailand-Wa`, `go-Thailand-Guitar`, `GoThailand-Meng` สามารถนำไฟล์นี้ไปวางในโฟลเดอร์ `src/services/authService.js` ของตนเองได้ทันที:

```javascript
// src/services/authService.js
// บริการตรวจสอบสถานะผู้ใช้งานกลางสำหรับทีม Go Thailand

const BACKEND_URL = "http://localhost:3000";
const TOKEN_KEY = "gt_token";

// Mock Fallback: ป้องกันหน้า UI พังเมื่อยังไม่ได้เปิดรัน backend port 3000
const MOCK_USER_FALLBACK = {
  _id: "66ce7000f1a2b3c4d5e6f700",
  email: "somchai@example.com",
  role: "customer",
  firstName: "Somchai",
  lastName: "Jaidee",
  phone: "081-234-5678",
  membershipTier: "gold",
  points: 4500,
  bookingCount: 12,
  wishlist: ["wat-arun-bkk", "doi-inthanon"],
  addresses: [{ line1: "123 Sukhumvit", city: "Bangkok", province: "Bangkok", postalCode: "10110" }]
};

/**
 * 1. ตรวจสอบสถานะผู้ใช้ปัจจุบัน
 * @returns {Promise<{ isAuthenticated: boolean, user: object|null }>}
 */
export async function checkCurrentUser() {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, user: data.user };
    }

    // Token ผิดหรือหมดอายุ
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.warn("[authService] ไม่สามารถติดต่อ Backend ได้ (ใช้ Mock Fallback สำหรับ Dev):", error);
    // กรณีที่กำลังพัฒนา UI แต่ยังไม่ได้รัน backend
    return { isAuthenticated: true, user: MOCK_USER_FALLBACK };
  }

  return { isAuthenticated: false, user: null };
}

/**
 * 2. เข้าสู่ระบบ (Login)
 */
export async function login(email, password) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

/**
 * 3. ออกจากระบบ (Logout)
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 4. ดึง Token ที่เก็บไว้
 */
export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
```

---

## 4. 💡 ตัวอย่างการเรียกใช้งานใน React Component (Custom Hook)

สร้าง Hook ง่ายๆ ในโฟลเดอร์ของเพื่อนๆ เช่น `useAuth.js`:

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { checkCurrentUser, logout } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser().then((res) => {
      setIsAuthenticated(res.isAuthenticated);
      setUser(res.user);
      setLoading(false);
    });
  }, []);

  return { user, isAuthenticated, loading, logout };
}
```

---

## 5. 🎯 การนำข้อมูลผู้ใช้ไปใช้งานของแต่ละโฟลเดอร์

### 5.1 โฟลเดอร์ `go-Thailand-Guitar` (Checkout & ชำระเงิน)
ใช้ข้อมูลผู้ใช้มา **Autofill (กรอกข้อมูลอัตโนมัติ)** เพื่อความสะดวกของผู้ซื้อ:
```javascript
const { user, isAuthenticated } = useAuth();

useEffect(() => {
  if (user) {
    setFullName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email);
    setPhone(user.phone || "");
    if (user.addresses?.[0]) {
      setAddress(`${user.addresses[0].line1}, ${user.addresses[0].city}, ${user.addresses[0].province}`);
    }
  }
}, [user]);
```

### 5.2 โฟลเดอร์ `goThailand-Wa` (CRM Customer Dashboard)
ใช้ข้อมูลมาแสดงผลการ์ดสถิติและโปรไฟล์:
```javascript
const { user } = useAuth();

// แสดงระดับสมาชิกและคะแนน
<p>ยินดีต้อนรับคุณ {user?.firstName}</p>
<StatCard title="REWARDS POINTS" value={user?.points} />
<StatCard title="TOTAL BOOKINGS" value={user?.bookingCount} />
<StatCard title="SAVED PLACES" value={user?.wishlist?.length || 0} />
```

### 5.3 โฟลเดอร์ `goThailand-YOK` (ค้นหาที่พัก & รถเช่า)
ใช้ตรวจสอบว่าสถานที่พักนี้อยู่ใน Wishlist ของผู้ใช้หรือไม่:
```javascript
const { user } = useAuth();
const isSaved = user?.wishlist?.includes(property.id);

<button className={isSaved ? "heart-active" : "heart-idle"}>
  ❤️
</button>
```

### 5.4 โฟลเดอร์ `GoThailand-Meng` (Tourist Guide)
ใช้ชื่อและ ID ผู้ใช้สำหรับสร้างคำขอจองไกด์นำเที่ยว:
```javascript
const { user } = useAuth();

const handleBookGuide = (guideId, selectedDate) => {
  if (!user) {
    alert("กรุณาเข้าสู่ระบบก่อนจองไกด์");
    return;
  }
  // ส่งคำขอจองพร้อมระบุ userId: user._id
};
```

---

## 6. 🚀 วิธีทดสอบระบบ (Verification)

1. รัน Server หลักใน `landing/`:
   ```bash
   cd landing
   npm run dev
   ```
2. ทดสอบเช็ค API ด้วย `curl`:
   ```bash
   # ตรวจสอบว่า endpoint ตอบสนอง (ไม่มี token -> 401)
   curl -i http://localhost:3000/api/auth/me
   ```
3. เมื่อเข้าสู่ระบบที่หน้า `/register` ของ `landing` Token จะถูกบันทึกใน `localStorage` (`gt_token`) อัตโนมัติ ทำให้ทุกหน้าและทุกคอมโพเนนต์ดึงข้อมูลผู้ใช้คนเดียวกันได้ทันที
