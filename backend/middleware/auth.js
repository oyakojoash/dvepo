const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @middleware protect
 * Ensures the user is authenticated via JWT stored in cookies
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: '❌ Not authorized: no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: '❌ Invalid token payload' });
    }

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: '❌ User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ JWT verification error:', err.message);
    return res.status(401).json({ message: '❌ Invalid or expired token' });
  }
};

/**
 * @middleware isAdmin
 * Restricts access to admin users
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ message: '❌ Admin access required' });
};

module.exports = { protect, isAdmin };
