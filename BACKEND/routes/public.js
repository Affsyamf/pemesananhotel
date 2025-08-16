const express = require('express');
const db = require('../db');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Endpoint untuk user melihat semua kamar yang tersedia
router.get('/rooms', async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms WHERE quantity > 0 ORDER BY price ASC');
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rooms] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        res.json(rooms[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/rooms/:roomId/reviews', async (req, res) => {
    try {
        const { roomId } = req.params;
        const sql = `
            SELECT r.id, r.rating, r.comment, r.createdAt, u.username
            FROM reviews AS r
            JOIN users AS u ON r.userId = u.id
            WHERE r.roomId = ?
            ORDER BY r.createdAt DESC
        `;
        const [reviews] = await db.query(sql, [roomId]);
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error saat mengambil ulasan" });
    }
});

// Point B: Endpoint untuk user membuat ulasan baru (memerlukan login)
// POST /api/public/rooms/:roomId/reviews (Contoh URL lengkap)
router.post('/rooms/:roomId/reviews', isAuthenticated, async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id; // Diambil dari token setelah melewati isAuthenticated
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ message: "Rating dan komentar tidak boleh kosong" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Masukkan ulasan baru
        const insertReviewSql = 'INSERT INTO reviews (roomId, userId, rating, comment) VALUES (?, ?, ?, ?)';
        await connection.query(insertReviewSql, [roomId, userId, rating, comment]);

        // 2. Update tabel rooms dengan rating baru
        const updateRoomSql = `
            UPDATE rooms SET
                numReviews = (SELECT COUNT(*) FROM reviews WHERE roomId = ?),
                averageRating = (SELECT AVG(rating) FROM reviews WHERE roomId = ?)
            WHERE id = ?
        `;
        await connection.query(updateRoomSql, [roomId, roomId, roomId]);
        
        await connection.commit();
        res.status(201).json({ message: "Ulasan berhasil ditambahkan" });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan ulasan' });
    } finally {
        connection.release();
    }
});

// Endpoint untuk user membuat pemesanan (booking)
router.post('/bookings', isAuthenticated, async (req, res) => {
    const { room_id, guest_name, guest_address, booking_date } = req.body;
    const user_id = req.user.id;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [rooms] = await connection.query('SELECT quantity FROM rooms WHERE id = ? FOR UPDATE', [room_id]);
        if (rooms.length === 0 || rooms[0].quantity <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Kamar tidak tersedia atau sudah habis' });
        }
        await connection.query('UPDATE rooms SET quantity = quantity - 1 WHERE id = ?', [room_id]);
        await connection.query(
            'INSERT INTO bookings (user_id, room_id, guest_name, guest_address, booking_date) VALUES (?, ?, ?, ?, ?)',
            [user_id, room_id, guest_name, guest_address, booking_date]
        );
        await connection.commit();
        res.status(201).json({ message: 'Pemesanan berhasil!' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pemesanan' });
    } finally {
        connection.release();
    }
});

// Endpoint untuk user mengambil riwayat pesanannya sendiri
router.get('/my-bookings', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const [bookings] = await db.query(
            `SELECT 
                b.id, 
                b.booking_date, 
                b.status,
                r.name AS room_name, 
                r.price,
                r.image_url
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC`,
            [userId]
        );
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk mengambil detail satu pesanan
router.get('/booking/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const [bookingDetails] = await db.query(
            `SELECT 
                b.*, r.name AS room_name, r.type AS room_type, r.price, u.username, u.email
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ? AND b.user_id = ?`,
            [id, userId]
        );
        if (bookingDetails.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau Anda tidak memiliki akses' });
        }
        res.json(bookingDetails[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk user membatalkan pesanannya (YANG HILANG)
router.put('/bookings/:bookingId/cancel', isAuthenticated, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [bookings] = await connection.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ? FOR UPDATE',
            [bookingId, userId]
        );
        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau Anda tidak berhak.' });
        }
        const booking = bookings[0];
        if (booking.status === 'cancelled') {
            await connection.rollback();
            return res.status(400).json({ message: 'Pesanan ini sudah dibatalkan.' });
        }
        await connection.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [bookingId]);
        await connection.query('UPDATE rooms SET quantity = quantity + 1 WHERE id = ?', [booking.room_id]);
        await connection.commit();
        res.json({ message: 'Pesanan berhasil dibatalkan.' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error saat membatalkan pesanan.' });
    } finally {
        connection.release();
    }
});

module.exports = router;