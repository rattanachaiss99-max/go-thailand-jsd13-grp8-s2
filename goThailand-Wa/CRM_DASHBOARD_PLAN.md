# แผน CRM Dashboard (Mock Data) — `goThailand-Wa`

**ข้อสรุปที่ตกลงกันแล้ว**
1. ยังไม่ต่อ MongoDB จริง → ใช้ **mock data ที่มีรูปร่างเหมือน MongoDB document**
2. **hardcode `userId`** เพราะระบบ login อยู่ในโฟลเดอร์ `landing`
3. **ยังไม่สร้าง backend** (`server/`) ในโปรเจกต์นี้
4. Rewards เก็บเป็นตัวเลขเดียว ไม่ทำ `rewardTransactions`

---

## 1. ⚠️ ของสำคัญที่เจอ: `landing` มี User schema อยู่แล้ว

`landing/src/server/models/User.ts` + `Customer.ts` ใช้ Mongoose discriminator
(`users` collection เดียว แยก `customer` / `admin`) — **field ที่มีอยู่แล้วตรงกับการ์ด 2 ใบ:**

| การ์ดใน mockup | field ที่ `landing` มีอยู่แล้ว | ต้องสร้างใหม่ไหม |
|---|---|---|
| REWARDS POINTS (4,500) | `Customer.points` (Number, default 0) | ❌ **ใช้ของเดิม** |
| TOTAL BOOKINGS (12) | `Customer.bookingCount` (Number, default 0) | ❌ **ใช้ของเดิม** |
| SAVED PLACES (8) | `Customer.wishlist` (String[]) | ⚠️ มีแล้วแต่เป็น id เปล่า — ดูข้อ 2 |
| UPCOMING TRIPS (2) | ไม่มี | ✅ ต้องคำนวณจาก bookings |

**กติกา: ห้ามตั้งชื่อใหม่ทับ** — ใช้ `points`, `bookingCount`, `wishlist`, `membershipTier`
ตาม `landing` เป๊ะ ไม่ใช้ `rewards.points` / `rewards.tier` แบบที่ร่างไว้ตอนแรก
ไม่งั้นตอนเชื่อม login จริงจะต้องมา map ชื่อกันใหม่ทั้งหมด

---

## 2. `wishlist` เป็น `string[]` — จะแสดงชื่อสถานที่ไม่ได้

การ์ดต้องการแค่ **จำนวน** → `wishlist.length` ใช้ได้เลย ✅
แต่ถ้าคลิกการ์ดแล้วอยากเห็น "Wat Arun / Bangkok / รูป" ต้องมี lookup

**ทางออกในเฟส mock:** เก็บ `places` เป็น mock collection แยก แล้ว join ด้วย `wishlist` id
```js
// mock/places.js  — ทำหน้าที่เหมือน collection `places`
{ placeId: 'wat-arun-bkk', name: 'Wat Arun', province: 'Bangkok',
  category: 'temple', image: '/images/places/wat-arun.png' }
```
ตอนต่อ DB จริงค่อยเปลี่ยนเป็น `$lookup` — โครง component ไม่ต้องแก้

---

## 3. รูปร่าง mock data

### `src/mock/currentUser.js` — เลียนแบบ document จาก `GET /api/auth/me`
```js
export const MOCK_USER_ID = '66ce7000f1a2b3c4d5e6f700'; // hardcode ชั่วคราว

export const mockUser = {
  _id: MOCK_USER_ID,
  email: 'somchai@example.com',
  role: 'customer',
  firstName: 'Somchai',
  lastName: 'Jaidee',
  phone: '081-234-5678',
  avatarUrl: null,
  emailVerified: true,
  isActive: true,
  // --- Customer discriminator fields (ชื่อตรงกับ landing) ---
  membershipTier: 'gold',
  points: 4500,
  bookingCount: 12,
  wishlist: ['wat-arun-bkk','doi-inthanon','maya-bay','phi-phi',
             'ayutthaya-park','erawan-falls','railay-beach','chatuchak'], // → 8
  coupons: [],
  preferredLanguage: 'th',
  createdAt: '2026-01-10T04:00:00.000Z',
  updatedAt: '2026-08-27T13:30:00.000Z'
};
```

### `src/mock/bookings.js` — เลียนแบบ `orders` ตาม `ORDER_MONGODB_PLAN.md`
คงโครง `item` / `pricing` / `payment` / `bookingStatus` เดิมไว้ทั้งหมด
ต้องมี **12 รายการ** โดย 2 รายการเป็น `confirmed` + `pickupDate` อนาคต → `upcomingTrips = 2`

| จำนวน | bookingStatus | pickupDate | ผลต่อการ์ด |
|---|---|---|---|
| 2 | `confirmed` | อนาคต | นับเป็น upcoming ✅ |
| 9 | `completed` | อดีต | นับใน total |
| 1 | `confirmed` | อดีต | นับใน total ไม่นับ upcoming |
| 1 | `cancelled` | — | **ไม่นับทั้งคู่** (ทดสอบว่ากรองจริง) |

> รวม document ทั้งหมด 13 ใบ → `totalBookings` = 12 ✅
> ทำแบบนี้เพื่อพิสูจน์ว่าโค้ดกรอง `cancelled` ออกจริง ไม่ใช่แค่ `array.length`

### `src/mock/places.js`
8 รายการ ให้ `placeId` ตรงกับ `wishlist` ด้านบน

---

## 4. Service layer — จุดสลับ mock → API

`src/services/dashboardService.js` — **ทุก function เป็น `async` และมี delay เทียม**
```js
const USE_MOCK = true; // สลับเป็น false ตอน backend พร้อม

export async function fetchDashboardStats(userId) {
  if (USE_MOCK) {
    await delay(400);                    // ให้เห็น loading state จริง
    return computeStats(mockUser, mockBookings);
  }
  const res = await fetch(`/api/dashboard/${userId}`);
  if (!res.ok) throw new Error('DASHBOARD_FETCH_FAILED');
  return (await res.json()).stats;
}
```

`computeStats` — logic เดียวกับที่ backend จะทำ:
```js
const now = new Date();
return {
  upcomingTrips: bookings.filter(b =>
      b.bookingStatus === 'confirmed' &&
      new Date(b.item.pickupDate) > now).length,
  totalBookings: bookings.filter(b =>
      b.bookingStatus !== 'cancelled').length,
  rewardsPoints: user.points,          // ← ชื่อ field ของ landing
  savedPlaces: user.wishlist.length
};
```
**ทำไมต้อง async ทั้งที่เป็น mock:** component จะมี loading/error path จริงตั้งแต่วันแรก
ตอนสลับเป็น fetch จริงไม่ต้องแก้ component แม้แต่บรรทัดเดียว

---

## 5. ไฟล์ที่จะสร้าง / แก้

| ไฟล์ | สถานะ | หน้าที่ |
|---|---|---|
| `src/mock/currentUser.js` | ใหม่ | user document + `MOCK_USER_ID` |
| `src/mock/bookings.js` | ใหม่ | 13 order documents |
| `src/mock/places.js` | ใหม่ | 8 place documents |
| `src/services/dashboardService.js` | ใหม่ | `fetchDashboardStats`, `fetchUpcomingTrips`, `fetchSavedPlaces` + flag `USE_MOCK` |
| `src/hooks/useDashboard.js` | ใหม่ | `useEffect` + cleanup `active=false` กัน stale setState |
| `src/components/StatCard.jsx` | ใหม่ | ลอก pattern การ์ดจาก `NextStepsBento.jsx` |
| `src/components/DashboardStats.jsx` | ใหม่ | grid 4 คอลัมน์ + loading skeleton + error |
| `src/views/DashboardView.jsx` | ใหม่ | ประกอบหน้า |
| `src/App.jsx` | แก้ | สลับ view (`currentView`) |
| `src/components/Header.jsx` | แก้ | เพิ่มลิงก์ Dashboard |
| `NextStepsBento.jsx` / `Footer.jsx` | reuse | ไม่แก้ logic |

### `StatCard` props
```jsx
<StatCard icon="flight_takeoff" label="Upcoming Trips" value={2} variant="highlight" />
<StatCard icon="calendar_month"  label="Total Bookings" value={12} />
<StatCard icon="stars"           label="Rewards Points" value={4500} suffix="PTS" />
<StatCard icon="bookmark"        label="Saved Places"  value={8} />
```

### สไตล์ (ใช้ token ที่มีใน `tailwind.config.js` แล้ว ไม่เพิ่มสีใหม่)
| ส่วน | class |
|---|---|
| การ์ด highlight | `bg-primary-container text-on-primary` |
| ไอคอนทอง | `text-secondary-fixed-dim` |
| การ์ดปกติ | `bg-surface-container-lowest border border-outline-variant/20` |
| label | `font-label-sm text-label-sm uppercase tracking-wider` |
| ตัวเลข | `font-headline-lg text-headline-lg` |
| suffix PTS | `font-label-sm text-on-surface-variant ml-1` |
| grid | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter` |
| ตัวเลขมี comma | `value.toLocaleString('en-US')` → `4,500` |

---

## 6. ลำดับการทำงาน

| Phase | งาน | เสร็จเมื่อ |
|---|---|---|
| **0** | แก้ `class=` → `className=` **44 จุด / 6 ไฟล์** | Tailwind แสดงผลจริง — ต้องทำก่อน StatCard |
| **1** | สร้าง 3 ไฟล์ mock | ค่าคำนวณได้ 2 / 12 / 4500 / 8 |
| **2** | `dashboardService` + `useDashboard` | log stats ถูกต้อง |
| **3** | `StatCard` + `DashboardStats` | การ์ด 4 ใบตรง mockup |
| **4** | `DashboardView` + Header link + App routing | คลิกเข้าหน้าได้ |
| **5** | ทดสอบ: loading, `wishlist: []` → 0, service throw → error state | ครบ 3 เคส |
| **6** | `npm run build` | ผ่าน ไม่มี warning `class` |

---

## 7. ตอนต่อ MongoDB จริงในอนาคต ต้องแก้แค่

1. `USE_MOCK = false` ใน `dashboardService.js`
2. เอา `userId` จาก `GET /api/auth/me` ของ `landing` แทน `MOCK_USER_ID`
3. ฝั่ง backend ทำ endpoint `GET /api/dashboard/:userId` คืน `{ stats: {...} }`
   โดยย้าย logic `computeStats` ไปเป็น aggregation `$facet`

**component ทั้งหมดไม่ต้องแก้** — นี่คือเหตุผลที่ mock ถูกวางไว้หลัง service layer ไม่ใช่ import ตรงเข้า component
