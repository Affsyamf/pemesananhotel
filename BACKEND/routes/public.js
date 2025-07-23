// backend/routes/public.js
const express = require('express');
const db = require('../db');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Hanya butuh cek login
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

// Endpoint untuk user membuat pemesanan (booking)
// Ini adalah operasi yang kompleks dan butuh transaksi database
router.post('/bookings', isAuthenticated, async (req, res) => {
    const { room_id, guest_name, guest_address, booking_date } = req.body;
    const user_id = req.user.id; // Ambil user_id dari token

    const connection = await db.getConnection(); // Dapatkan koneksi dari pool

    try {
        await connection.beginTransaction(); // Mulai transaksi

        // 1. Cek ketersediaan kamar dan kunci baris untuk update (mencegah race condition)
        const [rooms] = await connection.query('SELECT quantity FROM rooms WHERE id = ? FOR UPDATE', [room_id]);
        
        if (rooms.length === 0 || rooms[0].quantity <= 0) {
            await connection.rollback(); // Batalkan transaksi
            return res.status(400).json({ message: 'Kamar tidak tersedia atau sudah habis' });
        }

        // 2. Kurangi jumlah kamar
        await connection.query('UPDATE rooms SET quantity = quantity - 1 WHERE id = ?', [room_id]);

        // 3. Masukkan data pemesanan baru
        await connection.query(
            'INSERT INTO bookings (user_id, room_id, guest_name, guest_address, booking_date) VALUES (?, ?, ?, ?, ?)',
            [user_id, room_id, guest_name, guest_address, booking_date]
        );

        await connection.commit(); // Sukses, simpan semua perubahan
        res.status(201).json({ message: 'Pemesanan berhasil!' });

    } catch (error) {
        await connection.rollback(); // Jika ada error, batalkan semua perubahan
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pemesanan' });
    } finally {
        connection.release(); // Selalu lepaskan koneksi kembali ke pool
    }
});

module.exports = router;