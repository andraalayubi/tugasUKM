const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // ganti dengan username PostgreSQL Anda
    host: 'localhost',
    database: 'sekolah',
    password: 'andra123', // ganti dengan password PostgreSQL Anda
    port: 5432,
});

const app = express();
app.use(express.json());

// Fungsi bantuan untuk mengirim respon JSON yang terstruktur
function sendResponse(res, status, data, message = '') {
    res.status(status).json({
        status: status === 200 ? 'success' : 'error',
        message,
        data
    });
}

// Endpoint untuk mendapatkan semua siswa
app.get('/siswa', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM siswa');
        sendResponse(res, 200, rows, 'Daftar semua siswa.');
    } catch (error) {
        sendResponse(res, 500, null, 'Gagal mengambil data siswa.');
    }
});

// Endpoint untuk mendapatkan satu siswa
app.get('/siswa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM siswa WHERE id = $1', [id]);
        if (rows.length) {
            sendResponse(res, 200, rows[0], 'Detail siswa.');
        } else {
            sendResponse(res, 404, null, 'Siswa tidak ditemukan.');
        }
    } catch (error) {
        sendResponse(res, 500, null, 'Gagal mengambil data siswa.');
    }
});

// Endpoint untuk menambah siswa baru
app.post('/siswa', async (req, res) => {
    const { nama, kelas, alamat } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO siswa (nama, kelas, alamat) VALUES ($1, $2, $3) RETURNING *', [nama, kelas, alamat]);
        sendResponse(res, 201, rows[0], 'Siswa baru berhasil ditambahkan.');
    } catch (error) {
        sendResponse(res, 500, null, 'Gagal menambahkan siswa baru.');
    }
});

// Endpoint untuk memperbarui data siswa
app.put('/siswa/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, kelas, alamat } = req.body;
    try {
        const { rows } = await pool.query('UPDATE siswa SET nama = $1, kelas = $2, alamat = $3 WHERE id = $4 RETURNING *', [nama, kelas, alamat, id]);
        sendResponse(res, 200, rows[0], 'Data siswa berhasil diperbarui.');
    } catch (error) {
        sendResponse(res, 500, null, 'Gagal memperbarui data siswa.');
    }
});

// Endpoint untuk menghapus siswa
app.delete('/siswa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM siswa WHERE id = $1', [id]);
        sendResponse(res, 204, rows, 'Siswa berhasil dihapus.');
    } catch (error) {
        sendResponse(res, 500, rows, 'Gagal menghapus siswa.');
    }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
