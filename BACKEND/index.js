// backend/index.js
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

 // <-- Import rute auth

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // <-- Gunakan rute auth
app.use('/api/admin', adminRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: '🎉 Halo! API backend berhasil terhubung!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});