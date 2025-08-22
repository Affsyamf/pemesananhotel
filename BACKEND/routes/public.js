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
        // Query ini sekarang menghitung total harga dinamis (SUM(ra.price))
        // dan memeriksa ketersediaan di setiap hari dalam rentang tanggal.
        const availabilitySql = `
            SELECT
                r.id, r.name, r.type, r.facilities, r.description,
                (SELECT ri.image_url FROM room_images ri WHERE ri.room_id = r.id ORDER BY ri.id ASC LIMIT 1) as image_url,
                SUM(ra.price) AS price, -- Ini sekarang adalah TOTAL HARGA untuk seluruh durasi menginap
                MIN(ra.available_quantity) AS available_quantity
            FROM
                rooms r
            JOIN
                room_availability ra ON r.id = ra.room_id
            WHERE
                ra.date >= ? AND ra.date < ? 
                AND ra.is_active = TRUE
            GROUP BY
                r.id, r.name, r.type, r.facilities, r.description, image_url
            HAVING
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
        // 1. Ambil detail kamar utama
        const [rooms] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        const roomData = rooms[0];

        // 2. Ambil semua gambar dari tabel room_images
        const [images] = await db.query('SELECT id, image_url FROM room_images WHERE room_id = ? ORDER BY id ASC', [id]);
        
        // 3. Gabungkan gambar ke dalam data kamar
        roomData.images = images;

        res.json(roomData);
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
    const userId = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        
        const checkAvailabilitySql = `
            SELECT date, available_quantity, price FROM room_availability
            WHERE room_id = ? AND date >= ? AND date < ? AND is_active = TRUE
            FOR UPDATE;
        `;
        const [availability] = await connection.query(checkAvailabilitySql, [room_id, check_in_date, check_out_date]);

        const dateDiff = (new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24);
        if (availability.length !== dateDiff || availability.some(day => day.available_quantity <= 0)) {
            await connection.rollback();
            return res.status(400).json({ message: 'Kamar tidak tersedia pada sebagian atau seluruh tanggal yang dipilih.' });
        }

        const totalPrice = availability.reduce((sum, day) => sum + parseFloat(day.price), 0);

        const updateAvailabilitySql = `
            UPDATE room_availability 
            SET available_quantity = available_quantity - 1 
            WHERE room_id = ? AND date >= ? AND date < ?;
        `;
        await connection.query(updateAvailabilitySql, [room_id, check_in_date, check_out_date]);

        const [insertResult] = await connection.query(
            'INSERT INTO bookings (user_id, room_id, guest_name, guest_address, total_price, check_in_date, check_out_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, room_id, guest_name, guest_address, totalPrice, check_in_date, check_out_date]
        );
        const newBookingId = insertResult.insertId;
        
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Pesanan dibuat, menunggu pembayaran.',
            bookingId: newBookingId 
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error saat membuat booking:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pemesanan' });
    } finally {
        connection.release();
    }
});

// Endpoint untuk mengelola pembayaran pesanan
router.post('/bookings/:bookingId/pay', isAuthenticated, async (req, res) => {
    const { bookingId } = req.params;
    const { promoCode } = req.body; // <-- Menerima kode promo dari frontend
    const userId = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [bookings] = await connection.query("SELECT * FROM bookings WHERE id = ? AND user_id = ? AND payment_status = 'unpaid'", [bookingId, userId]);
        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibayar.' });
        }
        const booking = bookings[0];
        let finalPrice = booking.total_price;
        let promoCodeUsed = null;

        // Jika ada kode promo, validasi ulang dan hitung diskon
        if (promoCode) {
            const [promos] = await connection.query(
                'SELECT * FROM promos WHERE code = ? AND is_active = TRUE AND expiry_date >= CURDATE()',
                [promoCode]
            );
            if (promos.length > 0) {
                const promo = promos[0];
                const discountAmount = (booking.total_price * promo.discount_percentage) / 100;
                finalPrice = booking.total_price - discountAmount;
                promoCodeUsed = promo.code;
            }
        }

        const paymentId = `pay_sim_${require('crypto').randomBytes(12).toString('hex')}`;

        // Update status dan simpan harga akhir serta kode promo
        await connection.query(
            `UPDATE bookings SET 
                payment_status = 'paid', status = 'pending', payment_id = ?,
                final_price = ?, promo_code_used = ?, is_new = TRUE
             WHERE id = ?`,
            [paymentId, finalPrice, promoCodeUsed, bookingId]
        );

        // Kurangi stok kamar
        await connection.query(
            `UPDATE room_availability SET available_quantity = available_quantity - 1 
             WHERE room_id = ? AND date >= ? AND date < ?`,
            [booking.room_id, booking.check_in_date, booking.check_out_date]
        );

        await connection.commit();
        res.json({ message: 'Pembayaran berhasil!' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error saat proses pembayaran.' });
    } finally {
        connection.release();
    }
});
// Endpoint untuk user mengambil riwayat pesanannya sendiri
router.get('/my-bookings', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Query untuk mengambil data per halaman
        const [bookings] = await db.query(
            `SELECT 
                b.id, b.check_in_date, b.check_out_date, b.created_at, b.status, b.payment_status,
                r.name AS room_name, r.price, r.image_url,
                (SELECT COUNT(*) FROM bookings b2 WHERE b2.user_id = b.user_id AND b2.created_at <= b.created_at) as user_booking_sequence
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        // Query untuk menghitung total pesanan pengguna
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM bookings WHERE user_id = ?', [userId]);
        
        // Kirim respon dalam format paginasi
        res.json({
            data: bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
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
                b.*, r.name AS room_name, r.type AS room_type, r.price AS price_per_night,
                u.username, u.email
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ? AND b.user_id = ?`,
            [id, userId]
        );
        if (bookingDetails.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
        const booking = bookingDetails[0];
        const [[{ sequence_number }]] = await db.query(
            `SELECT COUNT(*) as sequence_number FROM bookings WHERE user_id = ? AND created_at <= ?`,
            [userId, booking.created_at]
        );
        booking.user_booking_sequence = sequence_number;
        res.json(booking);
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

        console.log('============================================');
        console.log('📧 SIMULASI: Mengirim Email Konfirmasi...');
        console.log(`   Kepada: Pengguna ID ${user_id}`);
        console.log(`   Booking ID: ${newBookingId}`);
        console.log(`   Kamar ID: ${room_id}`);
        console.log(`   Check-in: ${check_in_date}, Check-out: ${check_out_date}`);
        console.log('============================================');
        
        res.status(201).json({ message: 'Pemesanan berhasil!' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error saat membatalkan pesanan.' });
    } finally {
        connection.release();
    }
});

// --- ENDPOINT BARU UNTUK MENAMPILKAN KAMAR DI HALAMAN UTAMA ---
router.get('/featured-rooms', async (req, res) => {
    try {
        // Query ini sekarang mengambil satu gambar dari tabel room_images sebagai gambar utama
        const sql = `
            SELECT 
                r.id, r.name, r.type, r.price,
                (SELECT ri.image_url FROM room_images ri WHERE ri.room_id = r.id ORDER BY ri.id ASC LIMIT 1) as image_url
            FROM rooms r 
            ORDER BY r.created_at DESC 
            LIMIT 3;
        `;
        const [rooms] = await db.query(sql);
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching featured rooms:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- API BARU UNTUK MEMVERIFIKASI KODE PROMO ---
router.post('/promos/verify', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Kode promo diperlukan.' });
    }

    try {
        // Cari promo yang aktif dan belum kadaluarsa
        const [promos] = await db.query(
            'SELECT * FROM promos WHERE code = ? AND is_active = TRUE AND expiry_date >= CURDATE()',
            [code.toUpperCase()]
        );

        if (promos.length === 0) {
            return res.status(404).json({ message: 'Kode promo tidak valid atau sudah kadaluarsa.' });
        }

        const promo = promos[0];
        
        // Kirim detail promo yang valid ke frontend
        res.json({
            message: 'Kode promo berhasil diterapkan!',
            discountPercentage: promo.discount_percentage
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;