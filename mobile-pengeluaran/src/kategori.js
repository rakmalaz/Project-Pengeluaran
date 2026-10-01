import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GAYA = {
  'Tanpa Kategori': { ikon: 'remove-circle-outline', warna: '#005C55', bg: '#DCE9FF' },
  Makanan:    { ikon: 'restaurant',            warna: '#005C55', bg: '#DCE9FF' },
  Transport:  { ikon: 'car',                   warna: '#005C55', bg: '#CCE5FF' },
  Pendidikan: { ikon: 'school',                warna: '#005C55', bg: '#D3E4FE' },
  Hiburan:    { ikon: 'film',                  warna: '#B42318', bg: '#FFDAD6' },
};
const LAIN = { ikon: 'receipt-outline', warna: '#005C55', bg: '#E5EEFF' };

export function KotakIkon({ nama, ukuran = 40, radius = 8 }) {
  const g = GAYA[nama] || LAIN;
  return (
    <View
      style={{
        width: ukuran,
        height: ukuran,
        borderRadius: radius,
        backgroundColor: g.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={g.ikon} size={ukuran * 0.5} color={g.warna} />
    </View>
  );
}