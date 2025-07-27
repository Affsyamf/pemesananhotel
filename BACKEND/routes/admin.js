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

// === CRUD BOOKINGS ===
// GET all bookings
router.get('/bookings', async (req, res) => {
    try {
        // Query dengan JOIN untuk mendapatkan info user dan kamar
        const [bookings] = await db.query(`
            SELECT 
                b.id, b.guest_name, b.booking_date, b.status,
                u.username AS user_username,
                r.name AS room_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC
        `);
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE a booking
// PENTING: Saat admin menghapus booking, stok kamar harus dikembalikan jika statusnya 'confirmed'
router.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Cek booking yang akan dihapus
        const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ?', [id]);
        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }
        const booking = bookings[0];

        // Jika statusnya confirmed, kembalikan stok kamar
        if (booking.status === 'confirmed') {
            await connection.query('UPDATE rooms SET quantity = quantity + 1 WHERE id = ?', [booking.room_id]);
        }

        // Hapus booking
        await connection.query('DELETE FROM bookings WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Booking berhasil dihapus' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error saat menghapus booking' });
    } finally {
        connection.release();
    }
});

// Endpoint untuk admin mengambil detail satu pesanan
router.get('/booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [details] = await db.query(
            `SELECT 
                b.*, r.name AS room_name, r.type AS room_type, r.price, u.username, u.email
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ?`,
            [id]
        );
        if (details.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
        res.json(details[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;