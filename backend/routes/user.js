const express = require('express');
const { protect } = require('../middleware/auth');
const userCtrl = require('../controllers/userController');

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get('/me', protect, userCtrl.getUser); // 🔥 fixed name to match controller

/**
 * @route   PUT /api/users/me
 * @desc    Update logged-in user's profile (name, email, phone)
 * @access  Private
 */
router.put('/me', protect, userCtrl.updateProfile);

/**
 * @route   PUT /api/users/password
 * @desc    Update logged-in user's password
 * @access  Private
 */
router.put('/password', protect, userCtrl.updatePassword);

module.exports = router;
