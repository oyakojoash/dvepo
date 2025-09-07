const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT from cookies
 */
function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.token; // safer optional chaining

    if (!token) {
      return res.status(401).json({ message: "❌ Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "❌ Invalid token payload" });
    }

    // Attach user id to request
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("❌ JWT verification error:", err.message);
    return res.status(401).json({ message: "❌ Invalid or expired token" });
  }
}

module.exports = verifyToken;
