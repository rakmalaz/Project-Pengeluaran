export function rupiah(n) {
    return 'Rp ' + String(Number(n) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export function tglPendek(teks) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(teks || '');
    if (!m) return '-';
    return `${Number(m[3])} ${BULAN[Number(m[2]) - 1]} ${m[1]}`;
}

const BULAN_LENGKAP = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
export function tglLengkap(teks) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(teks || '');
    if (!m) return '-';
    return `${Number(m[3])} ${BULAN_LENGKAP[Number(m[2]) - 1]} ${m[1]}`;
}