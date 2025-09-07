const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ✅ Helper to set cookie safely on Render/Production
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,        // prevent XSS stealing
    secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
    sameSite: 'None',      // needed for cross-domain cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// ------------------- REGISTER -------------------
router.post('/register', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: '⚠️ Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    const hash = await bcrypt.hash(password, 12); // stronger hashing
    const user = await User.create({ fullName, email, password: hash, phone });

    res.status(201).json({ message: '✅ Registered successfully', userId: user._id });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ------------------- LOGIN -------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: '⚠️ Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    setTokenCookie(res, token);

    res.json({ message: '✅ Login successful' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ------------------- LOGOUT -------------------
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.json({ message: '✅ Logged out' });
});

// ------------------- FORGOT PASSWORD -------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: '⚠️ Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: '❌ User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // ⚠️ TODO: integrate email/SMS service (SendGrid, Twilio, etc.)
    console.log(`🔐 Reset code for ${email}: ${code}`);

    res.json({ message: '✅ Reset code sent to your email/phone' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error during code sending' });
  }
});

// ------------------- RESET PASSWORD -------------------
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: '⚠️ Missing fields' });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpiry ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({ message: '❌ Invalid or expired code' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ message: '✅ Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// ------------------- GET CURRENT USER -------------------
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: '❌ User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
