// backend/index.js
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- INI PERBAIKANNYA ---
// Mengubah prefix dari '/api' menjadi '/api/public' agar cocok dengan frontend
app.use('/api/public', publicRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: '🎉 Halo! API backend berhasil terhubung!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
