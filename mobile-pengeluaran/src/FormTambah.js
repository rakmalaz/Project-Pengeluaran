import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from './api';
import { C } from './theme';
import { KotakIkon } from './kategori';
import PilihKategori from './PilihKategori';

export default function FormTambah({ daftarKategori, onBatal, onSelesai }) {
  const [judul, setJudul] = useState('');
  const [nominal, setNominal] = useState('');
  const [kat, setKat] = useState(null); // null = belum dipilih, atau { id, nama }
  const [errJ, setErrJ] = useState('');
  const [errN, setErrN] = useState('');
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [memilih, setMemilih] = useState(false);

  // Jika sedang memilih kategori, alihkan tampilan ke layar Pilih Kategori (Frame 03)
  if (memilih) {
    return (
      <PilihKategori
        daftar={daftarKategori}
        terpilih={kat}
        onBatal={() => setMemilih(false)}
        onPilih={(k) => {
          setKat(k);
          setMemilih(false);
        }}
      />
    );
  }

  async function simpan() {
    const j = judul.trim();
    const n = parseInt(nominal, 10) || 0;
    const eJ = j ? '' : 'Judul wajib diisi';
    const eN = n > 0 ? '' : 'Nominal harus lebih dari 0';

    setErrJ(eJ);
    setErrN(eN);

    // Jika ada kolom yang tidak valid, tampilkan pesan galat (Frame 05)
    if (eJ || eN) {
      setGalat('Mohon periksa kembali formulir di bawah.');
      return;
    }

    setGalat('');
    setMenyimpan(true); // Masuk ke kondisi Frame 06_Menyimpan

    try {
      const res = await api.tambah({
        judul: j,
        nominal: n,
        id_kategori: kat && kat.id ? kat.id : null,
      });
      onSelesai(res && res.id ? res.id : null);
    } catch (e) {
      setGalat(e.message || 'Gagal menyimpan data ke server');
      setMenyimpan(false);
    }
  }

  const pt = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48;
  const isTerisi = judul.trim().length > 0 && Boolean(nominal);
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
          Tambah Pengeluaran
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
        {/* Micro Delight / Gentle Helper Greeting (Frame 02, 04, 05, 06) */}
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
            <Ionicons name="receipt-outline" size={20} color={C.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, lineHeight: 20 }}>
              Catat Pengeluaran Baru
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted, lineHeight: 16, marginTop: 2 }}>
              Lengkapi data untuk memudahkan analisa keuanganmu
            </Text>
          </View>
        </View>

        {/* Alert Error Banner (Khusus Frame 05_Form_Error) */}
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
                Pengeluaran gagal disimpan
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#B91C1C', lineHeight: 19, marginTop: 2 }}>
                {galat || 'Mohon periksa kembali formulir di bawah.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Field: Judul Pengeluaran (Wajib) */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Judul Pengeluaran</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#A50710', marginLeft: 2 }}>*</Text>
            </View>
            <View style={{ backgroundColor: '#FFDAD6', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#93000A' }}>Wajib</Text>
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

        {/* Field: Nominal (Wajib) */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Nominal</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#A50710', marginLeft: 2 }}>*</Text>
            </View>
            <View style={{ backgroundColor: '#FFDAD6', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#93000A' }}>Wajib</Text>
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

        {/* Field: Kategori (Opsional - Interactive Selector) */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Kategori</Text>
            <View style={{ backgroundColor: '#DCE9FF', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>Opsional</Text>
            </View>
          </View>

          <Pressable
            onPress={() => !menyimpan && setMemilih(true)}
            style={({ pressed }) => ({
              height: 56,
              backgroundColor: C.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {kat && kat.id ? (
                <KotakIkon nama={kat.nama} ukuran={32} radius={12} />
              ) : (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 12,
                    backgroundColor: '#E5EEFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="apps-outline" size={18} color={C.primaryDark} />
                </View>
              )}
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  color: (kat && kat.id) ? C.text : '#6E7977',
                }}
              >
                {(kat && kat.id) ? kat.nama : 'Pilih kategori (opsional)'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
            <Ionicons name="information-circle-outline" size={14} color={C.muted} style={{ marginRight: 4, marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 12, fontWeight: '500', color: C.muted, lineHeight: 16 }}>
              Kategori hanya dapat dipilih saat pembuatan dan terkunci setelahnya
            </Text>
          </View>
        </View>

        {/* Info Server Timestamp / Menyimpan Banner */}
        {menyimpan ? (
          /* Kondisi Frame 06_Menyimpan */
          <View
            style={{
              backgroundColor: '#CCE5FF',
              borderRadius: 8,
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
            <Ionicons name="cloud-upload-outline" size={20} color="#006398" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 14, color: '#006398', lineHeight: 19.25 }}>
              Sedang mengirim dan menyimpan data ke server...
            </Text>
          </View>
        ) : (
          /* Kondisi Frame 02, 04, 05 */
          <View
            style={{
              backgroundColor: '#DCE9FF',
              borderRadius: 8,
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
            <Ionicons name="time-outline" size={20} color={C.muted} style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 14, color: C.muted, lineHeight: 19.25 }}>
              Tanggal transaksi akan dibuat otomatis oleh server saat disimpan.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ marginTop: 4 }}>
          {/* Tombol Simpan */}
          {(() => {
            const isKosong = !isTerisi && !menyimpan;
            const btnBg = isKosong ? '#E5EEFF' : C.primary;
            const textColor = isKosong ? '#6E7977' : '#FFFFFF';
            const iconColor = isKosong ? '#6E7977' : '#FFFFFF';

            return (
              <Pressable
                onPress={simpan}
                disabled={menyimpan}
                style={({ pressed }) => ({
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: btnBg,
                  opacity: menyimpan ? 0.7 : (pressed ? 0.9 : 1),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: isKosong ? 'transparent' : '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: isKosong ? 0 : 3,
                })}
              >
                {menyimpan ? (
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="checkmark-circle-outline" size={20} color={iconColor} style={{ marginRight: 8 }} />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: textColor,
                  }}
                >
                  {menyimpan ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </Pressable>
            );
          })()}

          {/* Tombol Batal */}
          <Pressable
            onPress={onBatal}
            disabled={menyimpan}
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              marginTop: 8,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 16, color: menyimpan ? '#94A3B8' : C.muted }}>
              Batal
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}