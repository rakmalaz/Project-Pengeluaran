import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Modal, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from './api';
import { C } from './theme';
import { rupiah, tglLengkap } from './format';
import { KotakIkon } from './kategori';

export default function Detail({ id, onKembali, onDihapus, onUbah }) {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState('');
  const [memuat, setMemuat] = useState(true);
  const [modalHapus, setModalHapus] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  useEffect(() => {
    setMemuat(true);
    api.detail(id)
      .then((res) => {
        setData(res);
        setMemuat(false);
      })
      .catch((e) => {
        setGalat(e.message || 'Gagal memuat detail pengeluaran');
        setMemuat(false);
      });
  }, [id]);

  async function prosesHapus() {
    setMenghapus(true);
    try {
      await api.hapus(id);
      setModalHapus(false);
      setMenghapus(false);
      onDihapus(data);
    } catch (e) {
      setGalat(e.message || 'Gagal menghapus data');
      setMenghapus(false);
      setModalHapus(false);
    }
  }

  const pt = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48;
  const isDataTidakAda = !memuat && (galat.includes('Data tidak ditemukan') || (!data && galat));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* 1. Bar Aplikasi di Atas (Logo Dompet, Dompet Saya, Dashboard Transaksi) */}
      <View
        style={{
          paddingTop: pt,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: C.card,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: C.primaryDark,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="wallet" size={18} color="#FFFFFF" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted, lineHeight: 14 }}>
              Dompet Saya
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: C.text,
                lineHeight: 25,
                letterSpacing: -0.5,
              }}
            >
              Dashboard Transaksi
            </Text>
          </View>
        </View>
      </View>

      {/* Indikator Memuat Data */}
      {memuat ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.primaryDark} />
          <Text style={{ fontSize: 14, color: C.muted, marginTop: 12 }}>
            Memuat data transaksi...
          </Text>
        </View>
      ) : null}

      {/* Kondisi Frame 15_Data_Tidak_Ada */}
      {isDataTidakAda ? (
        <View style={{ padding: 16, marginTop: 16 }}>
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 12,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: '#EFF4FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="search-outline" size={32} color="#6E7977" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginTop: 16 }}>
              Data Tidak Ditemukan
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: C.muted,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 18,
              }}
            >
              Data pengeluaran yang Anda cari tidak tersedia atau mungkin sudah dihapus.
            </Text>
            <Pressable
              onPress={onKembali}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: C.primary,
                borderRadius: 8,
                height: 48,
                paddingHorizontal: 20,
                marginTop: 20,
                alignSelf: 'stretch',
                shadowColor: '#005C55',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Kembali ke Daftar
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Konten Utama Detail (08_Detail) */}
      {!memuat && data && !isDataTidakAda ? (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Sub-header Navigasi: Tombol "‹ Kembali" di kiri */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Pressable
              onPress={onKembali}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#EFF6FF',
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#DCE9FF',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="arrow-back" size={16} color={C.primaryDark} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primaryDark, marginLeft: 6 }}>
                Kembali
              </Text>
            </Pressable>
          </View>

          {/* Kartu Utama: Rata Tengah sesuai Figma 08_Detail */}
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 12,
              padding: 24,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {/* Kotak Ikon Kategori di Tengah Atas */}
            <KotakIkon nama={data.kategori} ukuran={52} radius={14} />

            {/* Badge "↗ Pengeluaran" */}
            <View
              style={{
                backgroundColor: '#FFECE8',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 3,
                marginTop: 14,
                marginBottom: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="arrow-up"
                size={12}
                color="#B91C1C"
                style={{ transform: [{ rotate: '45deg' }], marginRight: 4 }}
              />
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#B91C1C' }}>
                Pengeluaran
              </Text>
            </View>

            {/* Judul Transaksi di Tengah */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: C.text,
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              {data.judul}
            </Text>

            {/* Nominal Besar di Tengah */}
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: C.text,
                textAlign: 'center',
                marginTop: 6,
                letterSpacing: -0.5,
              }}
            >
              {rupiah(data.nominal)}
            </Text>
          </View>

          {/* Kartu Informasi Lengkap (Hanya Tanggal Transaksi & Kategori Pengeluaran) */}
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 }}>
              Informasi Lengkap
            </Text>

            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 6 }} />

            {/* Baris 1: Tanggal Transaksi (nama bulan lengkap, tanpa jam) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: '#EFF4FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={C.primaryDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: C.muted }}>Tanggal Transaksi</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginTop: 2 }}>
                  {tglLengkap(data.tanggal)}
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />

            {/* Baris 2: Kategori Pengeluaran (tampilkan nama kategori) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: '#EFF4FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="pricetag-outline" size={18} color={C.primaryDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: C.muted }}>Kategori Pengeluaran</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginTop: 2 }}>
                  {data.kategori || 'Tanpa Kategori'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tombol Aksi Sesuai Figma 08_Detail */}
          <View style={{ marginTop: 20 }}>
            {/* Baris 1: Tombol "Ubah Data" dan "Hapus" Berdampingan (50% - 50%) */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => onUbah(data)}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: C.primaryDark,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 6,
                  shadowColor: '#005C55',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>
                  Ubah Data
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setModalHapus(true)}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: '#FEE2E2',
                  borderWidth: 1,
                  borderColor: '#FECACA',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 6,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Ionicons name="trash-outline" size={18} color="#B91C1C" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#B91C1C' }}>
                  Hapus
                </Text>
              </Pressable>
            </View>

            {/* Baris 2: Tombol "Kembali ke Riwayat Transaksi" di Bawahnya */}
            <Pressable
              onPress={onKembali}
              style={({ pressed }) => ({
                height: 48,
                borderRadius: 8,
                backgroundColor: '#EFF4FF',
                borderWidth: 1,
                borderColor: '#DCE9FF',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="receipt-outline" size={18} color={C.text} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>
                Kembali ke Riwayat Transaksi
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}

      {/* Modal Dialog Konfirmasi Hapus (Tetap Berfungsi) */}
      <Modal
        visible={modalHapus}
        transparent
        animationType="fade"
        onRequestClose={() => !menghapus && setModalHapus(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(11, 28, 48, 0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 360,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Ikon Peringatan Tempat Sampah */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="trash" size={26} color="#B91C1C" />
            </View>

            {/* Judul & Teks Konfirmasi */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: C.text,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Hapus Pengeluaran?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: C.muted,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              Apakah Anda yakin ingin menghapus "{data ? data.judul : ''}" sebesar{' '}
              <Text style={{ fontWeight: '700', color: C.text }}>
                {data ? rupiah(data.nominal) : ''}
              </Text>
              ? Tindakan ini tidak dapat dibatalkan.
            </Text>

            {/* Tombol Hapus */}
            <Pressable
              onPress={prosesHapus}
              disabled={menghapus}
              style={({ pressed }) => ({
                height: 48,
                borderRadius: 8,
                backgroundColor: '#B91C1C',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'stretch',
                shadowColor: '#B91C1C',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
                opacity: menghapus ? 0.7 : (pressed ? 0.9 : 1),
              })}
            >
              {menghapus ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              )}
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {menghapus ? 'Menghapus...' : 'Hapus Pengeluaran'}
              </Text>
            </Pressable>

            {/* Tombol Batal */}
            <Pressable
              onPress={() => setModalHapus(false)}
              disabled={menghapus}
              style={({ pressed }) => ({
                height: 48,
                borderRadius: 8,
                backgroundColor: '#F8F9FF',
                borderWidth: 1,
                borderColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'stretch',
                marginTop: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: C.muted }}>
                Batal
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}