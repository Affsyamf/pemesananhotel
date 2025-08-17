const express = require('express');
const db = require('../db');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Endpoint untuk user melihat semua kamar yang tersedia
router.get('/rooms', async (req, res) => {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
        return res.json([]);
    }

    try {
        // Query ini akan mencari kamar yang tersedia di SETIAP HARI
        // dalam rentang tanggal yang dipilih.
        const availabilitySql = `
            SELECT
                r.id, r.name, r.type, r.price, r.facilities, r.description, r.image_url,
                -- Ambil jumlah ketersediaan terendah dalam rentang tanggal sebagai sisa kamar
                MIN(ra.available_quantity) AS available_quantity
            FROM
                rooms r
            JOIN
                room_availability ra ON r.id = ra.room_id
            WHERE
                -- Rentang tanggal inklusif di awal, eksklusif di akhir
                ra.date >= ? AND ra.date < ? 
                AND ra.is_active = TRUE
            GROUP BY
                r.id, r.name, r.type, r.price, r.facilities, r.description, r.image_url
            HAVING
                -- Hanya tampilkan kamar jika sisa kamar di setiap hari > 0
                MIN(ra.available_quantity) > 0;
        `;
        
        const [availableRooms] = await db.query(availabilitySql, [checkInDate, checkOutDate]);
        res.json(availableRooms);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error saat mengambil ketersediaan kamar' });
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

// --- API BARU UNTUK CEK KETERSEDIAAN ---
router.post('/rooms/check-availability', async (req, res) => {
    const { roomId, checkInDate, checkOutDate } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ message: 'ID Kamar, tanggal check-in, dan check-out diperlukan' });
    }

    try {
        // 1. Dapatkan total kuantitas kamar
        const [roomData] = await db.query('SELECT quantity FROM rooms WHERE id = ?', [roomId]);
        if (roomData.length === 0) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        const totalQuantity = roomData[0].quantity;

        // 2. Hitung berapa banyak kamar yang sudah dipesan pada rentang tanggal tersebut
        const countBookedSql = `
            SELECT COUNT(*) as booked_count
            FROM bookings
            WHERE room_id = ?
            AND status = 'confirmed'
            AND check_in_date < ? 
            AND check_out_date > ?
        `;
        const [bookedResult] = await db.query(countBookedSql, [roomId, checkOutDate, checkInDate]);
        const bookedCount = bookedResult[0].booked_count;

        // 3. Hitung ketersediaan
        const availableRooms = totalQuantity - bookedCount;

        res.json({
            isAvailable: availableRooms > 0,
            availableCount: availableRooms
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saat memeriksa ketersediaan' });
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

// Endpoint untuk memeriksa apakah seorang pengguna bisa memberi ulasan untuk kamar tertentu
router.get('/rooms/:roomId/can-review', isAuthenticated, async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id; // Diambil dari token

        // Query untuk menghitung jumlah pesanan yang sudah dikonfirmasi
        // oleh user ini untuk kamar ini.
        const sql = `
            SELECT COUNT(*) AS bookingCount 
            FROM bookings 
            WHERE user_id = ? AND room_id = ? AND status = 'confirmed'
        `;

        const [results] = await db.query(sql, [userId, roomId]);

        // Jika jumlah pesanan lebih dari 0, maka pengguna boleh memberi ulasan.
        const canReview = results[0].bookingCount > 0;

        res.json({ canReview }); // Kirim hasilnya: { "canReview": true } atau { "canReview": false }

    } catch (error) {
        console.error("Error saat memeriksa eligibilitas ulasan:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Endpoint untuk user membuat pemesanan (booking)
// --- MODIFIKASI ENDPOINT PEMESANAN ---
router.post('/bookings', isAuthenticated, async (req, res) => {
    const { room_id, guest_name, guest_address, check_in_date, check_out_date } = req.body;
    const user_id = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        
        // 1. Kunci dan periksa ketersediaan untuk setiap hari dalam rentang tanggal
        const checkAvailabilitySql = `
            SELECT date, available_quantity FROM room_availability
            WHERE room_id = ? AND date >= ? AND date < ? AND is_active = TRUE
            FOR UPDATE;
        `;
        const [availability] = await connection.query(checkAvailabilitySql, [room_id, check_in_date, check_out_date]);

        // Periksa apakah semua hari dalam rentang ada di database dan tersedia
        const dateDiff = (new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24);
        if (availability.length !== dateDiff) {
            await connection.rollback();
            return res.status(400).json({ message: 'Beberapa tanggal tidak tersedia untuk pemesanan.' });
        }
        for (const day of availability) {
            if (day.available_quantity <= 0) {
                await connection.rollback();
                return res.status(400).json({ message: `Kamar penuh pada tanggal ${day.date.toISOString().split('T')[0]}` });
            }
        }

        // 2. Jika semua tersedia, kurangi stok untuk setiap hari
        const updateAvailabilitySql = `
            UPDATE room_availability 
            SET available_quantity = available_quantity - 1 
            WHERE room_id = ? AND date >= ? AND date < ?;
        `;
        await connection.query(updateAvailabilitySql, [room_id, check_in_date, check_out_date]);

        // 3. Masukkan data pemesanan
        await connection.query(
            'INSERT INTO bookings (user_id, room_id, guest_name, guest_address, check_in_date, check_out_date) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, room_id, guest_name, guest_address, check_in_date, check_out_date]
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
        // Menambahkan b.created_at untuk tanggal pemesanan
        const [bookings] = await db.query(
            `SELECT 
                b.id, 
                b.check_in_date, 
                b.check_out_date,
                b.created_at,
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
        
        // 1. Dapatkan detail booking
        const [bookings] = await connection.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ? FOR UPDATE',
            [bookingId, userId]
        );
        if (bookings.length === 0 || bookings[0].status === 'cancelled') {
            await connection.rollback();
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibatalkan.' });
        }
        const booking = bookings[0];

        // 2. Kembalikan stok kamar untuk setiap hari
        const updateAvailabilitySql = `
            UPDATE room_availability 
            SET available_quantity = available_quantity + 1 
            WHERE room_id = ? AND date >= ? AND date < ?;
        `;
        await connection.query(updateAvailabilitySql, [booking.room_id, booking.check_in_date, booking.check_out_date]);

        // 3. Ubah status booking menjadi 'cancelled'
        await connection.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [bookingId]);
        
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