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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Query untuk mengambil data per halaman
        const [users] = await db.query(
            'SELECT id, username, email, role FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Query untuk menghitung total data
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM users');
        
        res.json({
            data: users,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
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
        // Perbaikan: Pastikan jumlah placeholder (?) cocok dengan jumlah field
        await db.query(
            'INSERT INTO rooms (name, type, price, quantity, facilities, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, type, price, quantity, facilities, description, image_url]
        );
        res.status(201).json({ message: 'Kamar berhasil ditambahkan' });
    } catch (error) {
        console.error(error);
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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Query untuk mengambil data per halaman
        const [bookings] = await db.query(`
            SELECT 
                b.id, b.guest_name, b.status,
                b.created_at, b.check_in_date, b.check_out_date,
                u.username AS user_username,
                r.name AS room_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        // Query untuk menghitung total data
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM bookings');

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

router.get('/availability/:roomId', async (req, res) => {
    const { roomId } = req.params;
    // Ambil bulan dan tahun dari query, default ke bulan ini jika tidak ada
    const year = req.query.year || new Date().getFullYear();
    const month = req.query.month || new Date().getMonth() + 1;

    try {
        const availabilitySql = `
            SELECT 
                id, 
                date, 
                available_quantity, 
                is_active
            FROM room_availability
            WHERE 
                room_id = ? 
                AND YEAR(date) = ? 
                AND MONTH(date) = ?
            ORDER BY date ASC;
        `;
        const [availabilityData] = await db.query(availabilitySql, [roomId, year, month]);
        res.json(availabilityData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error saat mengambil data ketersediaan' });
    }
});

// Endpoint untuk memperbarui ketersediaan (jumlah & status aktif)
// Menerima array of updates untuk efisiensi
router.put('/availability', async (req, res) => {
    const { updates } = req.body; // updates akan berbentuk: [{ id: 1, quantity: 8, isActive: true }, { id: 2, ... }]

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Data update tidak valid' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Looping melalui setiap update dan jalankan query
        for (const update of updates) {
            const { id, quantity, isActive } = update;
            const updateSql = `
                UPDATE room_availability 
                SET 
                    available_quantity = ?, 
                    is_active = ? 
                WHERE id = ?;
            `;
            await connection.query(updateSql, [quantity, isActive, id]);
        }

        await connection.commit();
        res.json({ message: 'Ketersediaan berhasil diperbarui' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error saat memperbarui ketersediaan' });
    } finally {
        connection.release();
    }
});

// --- API UNTUK DASHBOARD STATISTIK (FITUR BARU) ---
router.get('/stats', async (req, res) => {
    try {
        // 1. Hitung total pengguna (hanya role 'user')
        const [usersResult] = await db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'");
        
        // 2. Hitung total pesanan yang sudah dikonfirmasi
        const [bookingsResult] = await db.query("SELECT COUNT(*) as totalBookings FROM bookings WHERE status = 'confirmed'");
        
        // 3. Hitung total pendapatan bulan ini
        const [revenueResult] = await db.query(`
            SELECT SUM(r.price) as monthlyRevenue
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.status = 'confirmed'
            AND MONTH(b.check_in_date) = MONTH(CURDATE())
            AND YEAR(b.check_in_date) = YEAR(CURDATE())
        `);
        
        // 4. Ambil 5 pesanan terakhir
        const [recentBookings] = await db.query(`
            SELECT b.id, r.name as room_name, u.username as user_username, b.created_at
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
            LIMIT 5
        `);
        
        // 5. (Untuk Grafik) Ambil pendapatan 6 bulan terakhir
        const [monthlyRevenueData] = await db.query(`
            SELECT 
                DATE_FORMAT(check_in_date, '%Y-%m') AS month,
                SUM(r.price) AS revenue
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.status = 'confirmed' AND b.check_in_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC;
        `);

        res.json({
            totalUsers: usersResult[0].totalUsers,
            totalBookings: bookingsResult[0].totalBookings,
            monthlyRevenue: revenueResult[0].monthlyRevenue || 0,
            recentBookings,
            monthlyRevenueChart: monthlyRevenueData
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
