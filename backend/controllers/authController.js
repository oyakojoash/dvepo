// controllers/AuthController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper: sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Helper: set cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ✅ Register new user
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: '❌ Missing required fields' });
    }

    // 1. Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: '❌ Email already registered' });
    }

    // 2. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Save user
    const user = new User({ fullName, email, password: hashed, phone });
    await user.save();

    // 4. JWT + cookie
    const token = signToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      message: '✅ Registration successful',
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error('[register] ❌', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ✅ Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '❌ Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: '❌ Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '❌ Invalid credentials' });

    const token = signToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      message: '✅ Login successful',
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error('[login] ❌', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ Get logged-in user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: '❌ User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('[getUser] ❌', err.message);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// ✅ Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.status(200).json({ message: '✅ Logged out successfully' });
};
