// C:\Users\hp\Desktop\memo\proto1\dvepo\backend\routes\auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ------------------- REGISTER -------------------
router.post('/register', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hash, phone });
    await user.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ------------------- LOGIN -------------------
// No token or cookie is created here
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Just return user info; rely on middleware's cookie for auth
    res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ------------------- LOGOUT -------------------
// Frontend can clear the cookie
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// ------------------- FORGOT PASSWORD -------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    console.log(`Reset code for ${email}: ${code}`);
    res.json({ message: 'Reset code sent to your email or phone' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error during code sending' });
  }
});

// ------------------- RESET PASSWORD -------------------
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpiry ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// ------------------- GET CURRENT USER -------------------
router.get('/me', protect, async (req, res) => {
  try {
    // protect middleware sets req.user from the cookie
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    res.json({ id: req.user._id, email: req.user.email, fullName: req.user.fullName });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
