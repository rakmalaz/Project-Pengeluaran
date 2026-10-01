import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from './api';
import { C } from './theme';
import { tglLengkap } from './format';
import { KotakIkon } from './kategori';

export default function FormUbah({ item, onBatal, onSelesai }) {
  const [judul, setJudul] = useState(item.judul || '');
  const [nominal, setNominal] = useState(String(item.nominal || ''));
  const [errJ, setErrJ] = useState('');
  const [errN, setErrN] = useState('');
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  async function simpan() {
    const j = judul.trim();
    const n = parseInt(nominal, 10) || 0;
    const eJ = j ? '' : 'Judul wajib diisi';
    const eN = n > 0 ? '' : 'Nominal harus lebih dari 0';

    setErrJ(eJ);
    setErrN(eN);

    if (eJ || eN) {
      setGalat('Mohon periksa kembali formulir di bawah.');
      return;
    }

    setGalat('');
    setMenyimpan(true);

    try {
      await api.ubah(item.id, {
        judul: j,
        nominal: n,
      });
      onSelesai(item.id);
    } catch (e) {
      setGalat(e.message || 'Gagal menyimpan perubahan');
      setMenyimpan(false);
    }
  }

  const pt = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48;
  const hasError = Boolean(galat || errJ || errN);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header Atas */}
      <View
        style={{
          paddingTop: pt,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: C.card,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Pressable onPress={onBatal} disabled={menyimpan} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '600', color: C.text, letterSpacing: -0.5 }}>
          Ubah Pengeluaran
        </Text>
        <Pressable onPress={onBatal} disabled={menyimpan} style={{ padding: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: menyimpan ? '#94A3B8' : C.muted }}>
            Batal
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Kotak Info di Atas (Ubah Data Pengeluaran) */}
        <View
          style={{
            backgroundColor: '#EFF4FF',
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#CCE5FF',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="create-outline" size={20} color={C.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, lineHeight: 20 }}>
              Ubah Data Pengeluaran
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted, lineHeight: 16, marginTop: 2 }}>
              Hanya judul dan nominal yang dapat diperbarui pada transaksi ini.
            </Text>
          </View>
        </View>

        {/* Alert Error Banner */}
        {hasError ? (
          <View
            style={{
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#B91C1C',
              borderRadius: 8,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Ionicons name="alert-circle" size={22} color="#B91C1C" style={{ marginRight: 10, marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#B91C1C', lineHeight: 20 }}>
                Perubahan gagal disimpan
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#B91C1C', lineHeight: 19, marginTop: 2 }}>
                {galat || 'Mohon periksa kembali formulir di bawah.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Kolom 1 (Dapat Diubah): Judul Pengeluaran */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Judul Pengeluaran</Text>
            </View>
            <View style={{ backgroundColor: '#DCFCE7', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#166534' }}>Dapat Diubah</Text>
            </View>
          </View>

          <TextInput
            value={judul}
            onChangeText={(t) => {
              setJudul(t);
              setErrJ('');
              setGalat('');
            }}
            placeholder="Contoh: Makan siang"
            placeholderTextColor="#6E7977"
            maxLength={100}
            editable={!menyimpan}
            style={{
              height: 48,
              backgroundColor: errJ ? '#FEF2F2' : C.card,
              borderRadius: 8,
              borderWidth: errJ ? 2 : 1,
              borderColor: errJ ? '#B91C1C' : '#E2E8F0',
              paddingHorizontal: 16,
              fontSize: 16,
              color: errJ ? '#B91C1C' : C.text,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />

          {errJ ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Ionicons name="alert-circle-outline" size={16} color="#B91C1C" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#B91C1C' }}>{errJ}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>Nama atau tujuan belanja</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>{judul.length}/100</Text>
          </View>
        </View>

        {/* Kolom 2 (Dapat Diubah): Nominal */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Nominal</Text>
            </View>
            <View style={{ backgroundColor: '#DCFCE7', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#166534' }}>Dapat Diubah</Text>
            </View>
          </View>

          <TextInput
            value={nominal}
            onChangeText={(t) => {
              setNominal(t.replace(/\D/g, ''));
              setErrN('');
              setGalat('');
            }}
            keyboardType="numeric"
            placeholder="Contoh: 20000"
            placeholderTextColor="#6E7977"
            editable={!menyimpan}
            style={{
              height: 48,
              backgroundColor: errN ? '#FEF2F2' : C.card,
              borderRadius: 8,
              borderWidth: errN ? 2 : 1,
              borderColor: errN ? '#B91C1C' : '#E2E8F0',
              paddingHorizontal: 16,
              fontSize: 16,
              color: errN ? '#B91C1C' : C.text,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />

          {errN ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Ionicons name="alert-circle-outline" size={16} color="#B91C1C" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#B91C1C' }}>{errN}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Ionicons name="information-circle-outline" size={14} color={C.muted} style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>Masukkan angka saja tanpa titik/koma</Text>
          </View>
        </View>

        {/* Kolom 3 (Terkunci): Kategori */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Kategori</Text>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="lock-closed" size={10} color="#6E7977" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#6E7977' }}>Terkunci</Text>
            </View>
          </View>

          <View
            style={{
              height: 52,
              backgroundColor: '#F8F9FF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <KotakIkon nama={item.kategori} ukuran={32} radius={8} />
              <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: '500', color: C.text }}>
                {item.kategori || 'Tanpa Kategori'}
              </Text>
            </View>
            <Ionicons name="lock-closed" size={16} color="#94A3B8" />
          </View>

          <Text style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
            Kategori dikunci dan tidak dapat diubah setelah dibuat
          </Text>
        </View>

        {/* Kolom 4 (Terkunci): Tanggal Transaksi */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Tanggal Transaksi</Text>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="lock-closed" size={10} color="#6E7977" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#6E7977' }}>Terkunci</Text>
            </View>
          </View>

          <View
            style={{
              height: 48,
              backgroundColor: '#F8F9FF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar-outline" size={18} color={C.muted} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>
                {tglLengkap(item.tanggal)}
              </Text>
            </View>
            <Ionicons name="lock-closed" size={16} color="#94A3B8" />
          </View>

          <Text style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
            Tanggal transaksi ditetapkan oleh server saat pembuatan
          </Text>
        </View>

        {/* Kotak Info Berikon Perisai di Atas Tombol Simpan */}
        <View
          style={{
            backgroundColor: '#EFF4FF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#DCE9FF',
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color={C.primaryDark} style={{ marginRight: 10 }} />
          <Text style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 18, fontWeight: '500' }}>
            Perubahan data transaksi akan tersimpan secara aman di sistem.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 4 }}>
          {/* Tombol Simpan Perubahan */}
          <Pressable
            onPress={simpan}
            disabled={menyimpan}
            style={({ pressed }) => ({
              height: 48,
              borderRadius: 8,
              backgroundColor: C.primary,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#005C55',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
              opacity: menyimpan ? 0.7 : (pressed ? 0.9 : 1),
            })}
          >
            {menyimpan ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            )}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
              {menyimpan ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Text>
          </Pressable>

          {/* Tombol Batal dan Kembali ke Detail */}
          <Pressable
            onPress={onBatal}
            disabled={menyimpan}
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
            <Ionicons name="arrow-back-outline" size={18} color={C.primaryDark} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.primaryDark }}>
              Batal dan Kembali ke Detail
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}