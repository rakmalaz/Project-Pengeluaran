import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();

app.use(cors()); // izinkan akses dari aplikasi mobile
app.use(express.json()); // baca body berformat JSON

app.get('/', (req, res) => {
  res.send('API Pengeluaran berjalan');
});
let daftar = [
  { id: 1, judul: 'Makan siang', nominal: 20000 },
  { id: 2, judul: 'Bensin', nominal: 15000 },
];
app.get('/kategori', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nama FROM kategori ORDER BY id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal mengambil kategori' });
  }
});
app.get('/pengeluaran', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.judul, p.nominal,    DATE_FORMAT(p.tanggal, '%Y-%m-%d') AS tanggal,
       k.nama AS kategori
       FROM pengeluaran p
       LEFT JOIN kategori k ON p.id_kategori = k.id
       ORDER BY p.tanggal DESC`
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      pesan: 'Gagal mengambil data',
    });
  }
});

app.get('/pengeluaran/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.judul, p.nominal,
                 DATE_FORMAT(p.tanggal, '%Y-%m-%d') AS tanggal,
                 p.catatan, p.id_kategori, k.nama AS kategori
          FROM pengeluaran p
          LEFT JOIN kategori k ON p.id_kategori = k.id
          WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'Data tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal mengambil data' });
  }
});

app.post('/pengeluaran', async (req, res) => {
  const { judul, nominal, id_kategori } = req.body;
  if (!judul || !nominal) {
    return res.status(400).json({ pesan: 'judul & nominal wajib' });
  }
  try {
    const [hasil] = await pool.query(
      `INSERT INTO pengeluaran (judul, nominal, id_kategori)
       VALUES (?, ?, ?)`,
      [judul, Number(nominal), id_kategori ?? null]
    );
    res.status(201).json({ id: hasil.insertId, judul, nominal });
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal menyimpan data' });
  }
});

app.put('/pengeluaran/:id', async (req, res) => {
  const { judul, nominal } = req.body;
  const [hasil] = await pool.query(
    'UPDATE pengeluaran SET judul = ?, nominal = ? WHERE id = ?',
    [judul, Number(nominal), req.params.id]
  );
  if (hasil.affectedRows === 0) {
    return res.status(404).json({ pesan: 'Data tidak ditemukan' });
  }
  res.json({ id: Number(req.params.id), judul, nominal });
});

app.delete('/pengeluaran/:id', async (req, res) => {
  const [hasil] = await pool.query(
    'DELETE FROM pengeluaran WHERE id = ?', [req.params.id]
  );
  if (hasil.affectedRows === 0) {
    return res.status(404).json({ pesan: 'Data tidak ditemukan' });
  }
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
