// middleware/authMiddleware.js — JWT Protection
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Middleware that validates JWT and attaches user to req
 * Usage: router.get('/protected', protect, controller)
 */
const protect = async (req, res, next) => {
  let token;

  // JWT is passed as Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

/**
 * adminOnly — Restricts route to admin users only
 * Must be used AFTER protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Access denied — admins only' });
};

module.exports = { protect, adminOnly };
