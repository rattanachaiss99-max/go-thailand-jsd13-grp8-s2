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

// 1. ลงทะเบียนสมาชิกใหม่ (Register)
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
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newCustomer._id,
        _id: newCustomer._id,
        email: newCustomer.email,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        role: newCustomer.role,
        membershipTier: newCustomer.membershipTier,
        points: newCustomer.points,
        bookingCount: newCustomer.bookingCount
      }
    });
  } catch (err) {
    console.error('[authController:register]', err);
    return res.status(500).json({ error: err.message });
  }
};

// 2. เข้าสู่ระบบ (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[authController:login]', err);
    return res.status(500).json({ error: err.message });
  }
};

// 3. ตรวจสอบสถานะผู้ใช้ปัจจุบัน (GetMe)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ isAuthenticated: false, user: null, error: 'User not found' });
    }
    return res.json({ isAuthenticated: true, user });
  } catch (err) {
    console.error('[authController:getMe]', err);
    return res.status(500).json({ isAuthenticated: false, error: err.message });
  }
};

// 4. ดึงข้อมูลผู้ใช้รายบุคคล (Service-to-Service: GET /api/users/:id)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      id: user._id,
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      membershipTier: user.membershipTier || 'bronze',
      points: user.points || 0
    });
  } catch (err) {
    console.error('[authController:getUserById]', err);
    return res.status(500).json({ error: err.message });
  }
};
