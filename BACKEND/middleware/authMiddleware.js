// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk memeriksa apakah user sudah login (punya token valid)
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user dari token ke request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware untuk memeriksa apakah user adalah admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak, hanya untuk admin' });
  }
};

module.exports = { isAuthenticated, isAdmin };