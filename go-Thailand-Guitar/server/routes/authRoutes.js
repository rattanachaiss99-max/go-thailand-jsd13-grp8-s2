import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// สมัครสมาชิก (เชื่อมกับ Register.jsx)
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// เข้าสู่ระบบ (เชื่อมกับ SignIn.jsx)
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    res.json({ message: 'เข้าสู่ระบบสำเร็จ', user: { fullName: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ลืมรหัสผ่าน (เชื่อมกับ ForgotPassword.jsx)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
    }
    res.json({ message: `ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;