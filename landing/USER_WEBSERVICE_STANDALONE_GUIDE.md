# 🚀 คู่มือการสร้าง User & Auth Web Service แยกเดี่ยว (Standalone Express.js Microservice)

คู่มือนี้จัดทำขึ้นสำหรับ **ฝั่ง User & Auth (ของคุณ)** เพื่อพัฒนา แยกโฟลเดอร์ หรือแยก Repository เป็น **Web Service อิสระ (Express.js)** ก่อนที่จะนำไปเชื่อมต่อกับ Web Services ของเพื่อนๆ อีก 4 สาย (Stays, Orders, Payments, Guides) ในระบบ Production

---

## 🎯 1. หน้าที่และขอบเขตของ User Service (Service Scope)

User Service มีบทบาทเป็น **Central Identity Provider (ศูนย์กลางการยืนยันตัวตน)** ของทั้งแพลตฟอร์ม:
1. **การลงทะเบียนและเข้าสู่ระบบ (Register & Login)**: ตรวจสอบอีเมล/รหัสผ่าน และออก **JWT Token**
2. **การตรวจสอบสิทธิ์ (Auth Verification)**: ให้บริการ `GET /api/auth/me` เพื่อให้ทั้ง Frontend และ Service อื่นๆ ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
3. **การจัดการโปรไฟล์ (User & Customer Profile)**: อัปเดตข้อมูลส่วนตัว, ภาษาที่ต้องการ, ที่อยู่, คะแนนสะสม
4. **Service-to-Service Information**: ให้บริการ `GET /api/users/:id` สำหรับ Service อื่น (เช่น Backend Wa หรือ Guitar) ดึงชื่อ-อีเมลลูกค้าไปใส่ในใบเสร็จ
5. **ฐานข้อมูลประจำตัว**: ดูแล MongoDB Atlas Database: **`gothailand_user`** (Collections: `users`, `feedbacks`)

---

## 📁 2. โครงสร้างโฟลเดอร์ที่แนะนำ (`user-service/`)

คุณสามารถสร้างโฟลเดอร์ใหม่ชื่อ `user-service/` (หรือจะสร้างเป็น Git Repository แยกเดี่ยวบน GitHub ก็ได้):

```
user-service/
├── src/
│   ├── config/
│   │   └── db.js                 # เชื่อมต่อ MongoDB Atlas (gothailand_user)
│   ├── controllers/
│   │   ├── authController.js     # Logic: Register, Login, Me
│   │   └── userController.js     # Logic: GetUserById, UpdateProfile
│   ├── middlewares/
│   │   ├── authMiddleware.js     # ตรวจสอบ JWT Bearer Token
│   │   └── errorHandler.js       # จัดการ Error กลาง
│   ├── models/
│   │   ├── User.js               # Base Model (users collection)
│   │   ├── Customer.js           # Discriminator: customer
│   │   └── Admin.js              # Discriminator: admin
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── userRoutes.js         # /api/users/*
│   └── app.js                    # Express App Configuration
├── server.js                     # จุดเริ่มต้นรันเซิร์ฟเวอร์ (Listen Port)
├── .env                          # ตัวแปรแวดล้อม (ห้าม commit)
├── .env.example                  # ตัวอย่างตัวแปรแวดล้อม
├── package.json
└── README.md
```

---

## 📦 3. ไฟล์ตั้งค่าโปรเจกต์ (Setup Files)

### 3.1 `package.json`
```json
{
  "name": "gt-user-service",
  "version": "1.0.0",
  "description": "Go Thailand - User & Authentication Web Service",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

### 3.2 `.env` (ประจำ User Web Service)
```env
PORT=5001
NODE_ENV=development

# ฐานข้อมูล MongoDB Atlas ของคุณ (ชี้ไปที่ gothailand_user)
MONGODB_URI=mongodb://rattanachaiss99_db_user:ckQY1EbZsaho6XE4@ac-d7hbbcc-shard-00-00.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-01.ms885cg.mongodb.net:27017,ac-d7hbbcc-shard-00-02.ms885cg.mongodb.net:27017/gothailand_user?ssl=true&replicaSet=atlas-rnbrym-shard-0&authSource=admin&appName=Cluster0

# กุญแจลับสำหรับเข้ารหัส JWT (ต้องแชร์ค่านี้ให้กับ Backend ของเพื่อนๆ ทั้ง 4 คนด้วย)
JWT_SECRET=gt_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d

# URL ของ Frontend ที่อนุญาตให้เรียกใช้งาน (CORS)
CLIENT_URL=http://localhost:3000,http://localhost:5173,https://gothailand.com
```

---

## 💻 4. โค้ดสำคัญพร้อมใช้งาน (Core Implementation)

### 4.1 เชื่อมต่อ Database: `src/config/db.js`
```javascript
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ [User-Service] Connected to MongoDB Atlas: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ [User-Service] MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
```

---

### 4.2 Models (Mongoose Discriminator): `src/models/`

#### `src/models/User.js` (Base Model)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, discriminatorKey: 'role', collection: 'users' }
);

module.exports = mongoose.model('User', userSchema);
```

#### `src/models/Customer.js` (ลูกค้า/นักท่องเที่ยว)
```javascript
const mongoose = require('mongoose');
const User = require('./User');

const customerSchema = new mongoose.Schema(
  {
    membershipTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    points: { type: Number, default: 0 },
    preferredLanguage: { type: String, default: 'th' },
    bookingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = User.discriminator('customer', customerSchema);
```

---

### 4.3 Middleware ตรวจสอบสิทธิ์: `src/middlewares/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: '...', role: 'customer', email: '...' }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Token expired or invalid' });
  }
}

module.exports = { requireAuth };
```

---

### 4.4 Controllers: `src/controllers/authController.js`
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// 1. ลงทะเบียนสมาชิกใหม่
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });

    const token = generateToken(newCustomer);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newCustomer._id,
        email: newCustomer.email,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        role: newCustomer.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+passwordHash');
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. ตรวจสอบข้อมูลตนเอง (Me)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ isAuthenticated: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

### 4.5 Express App & Server: `src/app.js` & `server.js`

#### `src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// อนุญาต CORS ให้ Frontend เรียกใช้งานได้
const allowedOrigins = (process.env.CLIENT_URL || '*').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint (สำคัญมากสำหรับ Cloud hosting เช่น Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gt-user-service', time: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;
```

#### `server.js`
```javascript
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001;

// เชื่อมต่อ DB ก่อนเริ่มเปิดรับ Request
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [User-Service] Server is running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
});
```

---

## 📡 5. รายการ Endpoints (API Specification สำหรับส่งให้ทีม)

| Method | Endpoint | สิทธิ์ | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | เช็คสถานะเซิร์ฟเวอร์ (ใช้ตอน Deploy บน Cloud) |
| `POST` | `/api/auth/register` | Public | สมัครสมาชิกใหม่ (ส่ง email, password, firstName, lastName) |
| `POST` | `/api/auth/login` | Public | ล็อกอิน คืนค่า JWT Token |
| `GET` | `/api/auth/me` | Bearer Token | ตรวจสอบสถานะและข้อมูลผู้ใช้ที่ล็อกอินอยู่ |
| `GET` | `/api/users/:id` | Public/Service | ให้ Backend เพื่อน (Wa, Guitar) ใช้ดึงชื่อ-อีเมลลูกค้า |

---

## ☁️ 6. ขั้นตอนการนำขึ้น Cloud (Deploy บน Render.com ฟรี)

1. นำโค้ดขึ้น **GitHub** (ใน Repository แยกเดี่ยว หรือ subfolder)
2. เข้าเว็บไซต์ [render.com](https://render.com) แล้วล็อกอิน
3. กดปุ่ม **"New +"** ➔ เลือก **"Web Service"**
4. เลือก Repository ของคุณ
5. ตั้งค่าการ Build:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
6. เพิ่ม **Environment Variables** ในหน้าการตั้งค่า:
   - `PORT`: `5001`
   - `MONGODB_URI`: ใส่ Connection String Atlas ของคุณ
   - `JWT_SECRET`: `gt_super_secret_jwt_key_2026`
   - `CLIENT_URL`: `*` (หรือใส่ URL ของ Frontend เช่น `https://gothailand.vercel.app`)
7. กด **Create Web Service** แล้วรอระบบสร้างจนสถานะขึ้น **Live**
8. คุณจะได้ URL ประจำตัว เช่น: `https://gt-user-service.onrender.com`

---

## 🔄 7. การสลับให้ React Frontend (`landing`) มาเรียก Web Service ของเรา

เมื่อ User Web Service ของคุณรันสำเร็จ:
ในไฟล์ `.env` ของฝั่ง Frontend (`landing/.env`) เพียงเปลี่ยนหรือเพิ่มตัวแปร:

```env
# ชี้ API การล็อกอินมาที่ Express Web Service แยกเดี่ยวของคุณ
NEXT_PUBLIC_AUTH_API_URL=https://gt-user-service.onrender.com/api
```

และเพื่อนๆ ในทีม (Wa, Meng, Yok, Guitar) ก็สามารถเรียก API นี้เพื่อตรวจสอบสิทธิ์ผู้ใช้ได้จากทุกที่ครับ!
