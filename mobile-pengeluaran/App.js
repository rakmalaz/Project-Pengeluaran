import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { api } from './src/api';
import { C } from './src/theme';
import { rupiah, tglPendek } from './src/format';
import { KotakIkon } from './src/kategori';
import Detail from './src/Detail';
import FormUbah from './src/FormUbah';
import FormTambah from './src/FormTambah';
import HeaderDaftar, { HeaderAtas } from './src/HeaderDaftar';
import { DaftarKosong, GagalMemuat } from './src/KeadaanDaftar';

// Kartu Transaksi dengan dukungan label "Baru" (Frame 07) & "Diperbarui" (Frame 10)
function Kartu({ item, onBuka, isBaru, isDiubah }) {
  return (
    <Pressable
      onPress={onBuka}
      style={({ pressed }) => ({
        backgroundColor: C.card,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isBaru ? '#BFDBFE' : (isDiubah ? '#FDE68A' : '#F1F5F9'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1.5,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      {/* Baris Atas: Ikon Kategori + Judul/Tanggal (dengan Badge Baru/Diperbarui) + Nominal */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <KotakIkon nama={item.kategori} ukuran={40} radius={8} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text }} numberOfLines={1}>
              {item.judul}
            </Text>
            {/* Label "Baru" pada kartu yang baru ditambahkan (Frame 07_Daftar_Baru) */}
            {isBaru ? (
              <View
                style={{
                  backgroundColor: '#DCE9FF',
                  borderRadius: 2,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  marginLeft: 6,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: C.primaryDark }}>
                  Baru
                </Text>
              </View>
            ) : isDiubah ? (
              /* Label "Diperbarui" pada kartu yang baru diubah (Frame 10_Daftar_Diubah) */
              <View
                style={{
                  backgroundColor: '#FEF3C7',
                  borderRadius: 2,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  marginLeft: 6,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#92400E' }}>
                  Diperbarui
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted, marginTop: 2 }}>
            {tglPendek(item.tanggal)}
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>
          {rupiah(item.nominal)}
        </Text>
      </View>

      {/* Baris Bawah: Tag Kategori + Aksi "Lihat detail" */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <View style={{ backgroundColor: C.chip, borderRadius: 2, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>
            {item.kategori || 'Tanpa Kategori'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.primaryDark, marginRight: 2 }}>
            Lihat detail
          </Text>
          <Ionicons name="chevron-forward" size={14} color={C.primaryDark} />
        </View>
      </View>
    </Pressable>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [galat, setGalat] = useState('');
  const [idDetail, setIdDetail] = useState(null);
  const [itemUbah, setItemUbah] = useState(null);
  const [tambahBaru, setTambahBaru] = useState(false);
  const [daftarKategori, setDaftarKategori] = useState([]);
  const [selesaiMuat, setSelesaiMuat] = useState(false);

  // State untuk melacak status kartu & banner (Frame 07, 10, 12)
  const [idBaru, setIdBaru] = useState(null);
  const [idDiubah, setIdDiubah] = useState(null);
  const [bannerDihapus, setBannerDihapus] = useState(null); // { judul, nominal }

  function muat() {
    api.daftar()
      .then(data => {
        setItems(data);
        setGalat('');
        setSelesaiMuat(true);
      })
      .catch(e => {
        setGalat('Gagal mengambil data: ' + e.message);
        setItems([]);
        setSelesaiMuat(true);
      });
  }

  useEffect(() => {
    muat();
    api.kategori().then(setDaftarKategori).catch(() => { });
  }, []);

  if (tambahBaru) {
    return (
      <FormTambah
        daftarKategori={daftarKategori}
        onBatal={() => setTambahBaru(false)}
        onSelesai={(id) => {
          setTambahBaru(false);
          setIdBaru(id);
          setIdDiubah(null);
          setBannerDihapus(null);
          muat();
        }}
      />
    );
  }

  if (itemUbah) {
    return (
      <FormUbah
        item={itemUbah}
        onBatal={() => setItemUbah(null)}
        onSelesai={(id) => {
          setItemUbah(null);
          setIdDetail(null);
          setIdDiubah(id);
          setIdBaru(null);
          setBannerDihapus(null);
          muat();
        }}
      />
    );
  }

  if (idDetail) {
    return (
      <Detail
        id={idDetail}
        onKembali={() => setIdDetail(null)}
        onDihapus={(itemDihapus) => {
          setIdDetail(null);
          setIdBaru(null);
          setIdDiubah(null);
          if (itemDihapus) {
            setBannerDihapus({ judul: itemDihapus.judul, nominal: itemDihapus.nominal });
          }
          muat();
        }}
        onUbah={(d) => setItemUbah(d)}
      />
    );
  }

  // Layar Khusus 14_Gagal_Memuat (Saat refresh/muat awal gagal)
  if (galat && selesaiMuat) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar style="dark" />
        <HeaderAtas onRefresh={muat} />
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
          {/* Judul & Subjudul Catatan Pengeluaran (tanpa tombol refresh besar di sampingnya) */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: C.text,
                lineHeight: 30,
                letterSpacing: -0.5,
              }}
            >
              Catatan Pengeluaran
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: C.muted,
                marginTop: 4,
                lineHeight: 16,
              }}
            >
              Pantau arus kas harian secara presisi
            </Text>
          </View>

          {/* Kartu Gagal Memuat di Tengah Area Layar */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 }}>
            <GagalMemuat onUlang={muat} />
          </View>
        </View>
      </View>
    );
  }

  // Layar Daftar Normal (Saat data berhasil dimuat)
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="dark" />
      <HeaderAtas />
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Kartu
            item={item}
            onBuka={() => setIdDetail(item.id)}
            isBaru={item.id === idBaru}
            isDiubah={item.id === idDiubah}
          />
        )}
        ListHeaderComponent={
          <View>
            <HeaderDaftar onRefresh={muat} onTambah={() => setTambahBaru(true)} />

            {/* Banner Sukses Hapus (Frame 12_Daftar_Dihapus) */}
            {bannerDihapus ? (
              <View
                style={{
                  backgroundColor: '#EFF6FF',
                  borderWidth: 1,
                  borderColor: '#BFDBFE',
                  borderRadius: 8,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color={C.primaryDark} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>
                    Pengeluaran Berhasil Dihapus
                  </Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    "{bannerDihapus.judul}" sebesar {rupiah(bannerDihapus.nominal)} telah dihapus dari catatan.
                  </Text>
                </View>
                <Pressable onPress={() => setBannerDihapus(null)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={18} color={C.muted} />
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !selesaiMuat ? null : <DaftarKosong onTambah={() => setTambahBaru(true)} />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}