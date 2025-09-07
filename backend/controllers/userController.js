const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ Get logged-in user profile
exports.getUser = async (req, res) => {
  console.log("👤 GET /auth/profile", { userId: req.user?.id });

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('[getUser] ❌', err.message);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// ✅ Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    const { fullName, email, phone, photo } = req.body;

    // Email update validation
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: '❌ Email already in use' });
      }
      user.email = email;
    }

    // Optional fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (photo) user.photo = photo;

    await user.save();

    res.status(200).json({
      message: '✅ Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error('[updateProfile] ❌', err.message);
    res.status(500).json({ message: 'Profile update failed' });
  }
};

// ✅ Change user password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: '❌ Current and new passwords are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Incorrect current password' });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: '❌ New password must be at least 8 characters and include uppercase, lowercase, number, and symbol',
      });
    }

    // Save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: '✅ Password updated successfully' });
  } catch (err) {
    console.error('[updatePassword] ❌', err.message);
    res.status(500).json({ message: 'Password update failed' });
  }
};
