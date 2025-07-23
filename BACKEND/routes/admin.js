// backend/routes/admin.js
const express = require('express');
const db = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware ini akan berlaku untuk semua rute di file ini
// Memastikan hanya admin yang sudah login yang bisa mengakses
router.use(isAuthenticated, isAdmin);

// CRUD Users
router.get('/users', async (req, res) => {
  const [users] = await db.query('SELECT id, username, email, role FROM users');
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User berhasil dihapus' });
});

// CRUD Rooms (Contoh Sederhana)
// Anda perlu membuat tabel 'rooms' terlebih dahulu di database
router.get('/rooms', async (req, res) => {
    // Logika untuk mengambil semua kamar
    res.json({ message: 'Mengambil semua data kamar' });
});

router.post('/rooms', async (req, res) => {
    // Logika untuk menambah kamar baru
    res.json({ message: 'Kamar baru berhasil ditambahkan' });
});

module.exports = router;