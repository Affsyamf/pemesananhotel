// backend/routes/admin.js
const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware ini akan melindungi semua rute di file ini
router.use(isAuthenticated, isAdmin);

// === CRUD USERS ===
// GET all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, role FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE a user
router.put('/users/:id', async (req, res) => {
    try {
        const { username, email, role } = req.body;
        await db.query('UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?', [username, email, role, req.params.id]);
        res.json({ message: 'User berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE a user
router.delete('/users/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// === CRUD ROOMS ===
// GET all rooms
router.get('/rooms', async (req, res) => {
    try {
        // Secara eksplisit pilih semua kolom yang dibutuhkan
        const [rooms] = await db.query('SELECT id, name, type, price, quantity, facilities, description, image_url, created_at FROM rooms ORDER BY created_at DESC');
        res.json(rooms);
    } catch (error) {
        console.error(error); // Tambahkan ini untuk melihat error backend di terminal
        res.status(500).json({ message: 'Server Error' });
    }
});

// CREATE a new room
router.post('/rooms', async (req, res) => {
    try {
        const { name, type, price, quantity, facilities, description, image_url } = req.body;
        await db.query(
            'INSERT INTO rooms (name, type, price, description, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, type, price, quantity, facilities, description, image_url]
        );
        res.status(201).json({ message: 'Kamar berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE a room
router.put('/rooms/:id', async (req, res) => {
    try {
        const { name, type, price, quantity, facilities, description, image_url } = req.body;
        await db.query(
            'UPDATE rooms SET name = ?, type = ?, price = ?, quantity = ?, facilities = ?, description = ?, image_url = ? WHERE id = ?',
            [name, type, price, quantity, facilities, description, image_url, req.params.id]
        );
        res.json({ message: 'Kamar berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE a room
router.delete('/rooms/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Kamar berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;