const BASE_URL = 'http://192.168.1.20:3000';

async function panggil(path, opsi = {}) {
    const pengendali = new AbortController();
    const timer = setTimeout(() => pengendali.abort(), 6000);
    let res;
    try {
        res = await fetch(BASE_URL + path, {
            headers: { 'Content-Type': 'application/json' },
            ...opsi,
            signal: pengendali.signal,
        });
    } catch (e) {
        throw new Error('Tidak bisa terhubung ke server');
    } finally {
        clearTimeout(timer);
    }
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.pesan || 'Permintaan gagal');
    return data;
}

export const api = {
    daftar: () => panggil('/pengeluaran'),
    detail: (id) => panggil(`/pengeluaran/${id}`),
    kategori: () => panggil('/kategori'),
    hapus: (id) => panggil(`/pengeluaran/${id}`, { method: 'DELETE' }),
    ubah: (id, body) =>
        panggil(`/pengeluaran/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    tambah: (body) =>
        panggil('/pengeluaran', { method: 'POST', body: JSON.stringify(body) }),
};