// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// === Endpoint untuk Registrasi ===
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    // Cek apakah email atau username sudah ada
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email atau username sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user ke database
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// === Endpoint untuk Login ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // Buat token JWT
   const payload = {
      id: user.id,
      username: user.username,
      role: user.role // Tambahkan role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Kirim token dan role ke frontend
    res.json({ message: 'Login berhasil', token, role: user.role });
    // --- AKHIR PERUBAHAN ---
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// === Endpoint untuk Lupa Password (Versi Sederhana) ===
// PERHATIAN: Di aplikasi nyata, ini seharusnya mengirim email dengan link reset, bukan langsung mengganti password.
router.post('/forgot-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email dan password baru harus diisi' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// --- ENDPOINT BARU UNTUK UBAH PASSWORD ---
// --- ENDPOINT UNTUK UBAH PASSWORD (DIPERBARUI) ---
router.put('/change-password', isAuthenticated, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Password lama dan password baru diperlukan.' });
    }

    // --- PERUBAHAN VALIDASI SESUAI PERMINTAAN ---
    if (newPassword.length < 1 || newPassword.length > 10) {
        return res.status(400).json({ message: 'Password baru harus antara 1 hingga 10 karakter.' });
    }

    try {
        // 1. Ambil hash password pengguna saat ini dari database
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        const hashedPassword = users[0].password;

        // 2. Bandingkan password lama yang dimasukkan dengan yang ada di database
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password lama salah.' });
        }

        // 3. Jika cocok, hash password baru
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update password di database dengan yang baru
        await db.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId]);

        res.json({ message: 'Password berhasil diubah.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saat mengubah password.' });
    }
});


// --- ENDPOINT UNTUK MENGAMBIL PROFIL PENGGUNA ---
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.query('SELECT id, username, email, role FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saat mengambil profil.' });
    }
});

// Endpoint 1: Meminta link reset password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            // Kirim respon sukses meskipun email tidak ditemukan untuk keamanan
            return res.json({ message: 'Jika email terdaftar, instruksi reset password akan dikirim.' });
        }
        const user = users[0];

        // Buat token reset yang aman
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set waktu kadaluarsa token (misalnya, 1 jam dari sekarang)
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 jam

        // Simpan token yang sudah di-hash ke database
        await db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [hashedToken, tokenExpiry, user.id]);

        // Buat link reset (untuk ditampilkan di console, simulasi pengiriman email)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        console.log('--- LINK RESET PASSWORD (SIMULASI EMAIL) ---');
        console.log(`Klik link ini untuk mereset password: ${resetUrl}`);
        console.log('-------------------------------------------');

        res.json({ message: 'Jika email terdaftar, instruksi reset password akan dikirim.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Endpoint 2: Mereset password dengan token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 1 || newPassword.length > 10) {
        return res.status(400).json({ message: 'Password baru harus antara 1 hingga 10 karakter.' });
    }

    try {
        // Hash token dari URL agar bisa dibandingkan dengan yang di database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Cari pengguna berdasarkan token yang belum kadaluarsa
        const [users] = await db.query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [hashedToken]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
        }
        const user = users[0];

        // Hash password baru dan simpan
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [newHashedPassword, user.id]
        );

        res.json({ message: 'Password berhasil direset. Silakan login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


module.exports = router;