import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { KotakIkon } from './kategori';

const KET = {
  'Tanpa Kategori': 'Tidak dimasukkan ke kelompok manapun',
  Pendidikan: 'Kursus, buku, SPP, & modul belajar',
  Makanan: 'Makan siang, camilan, & groceries',
  Transport: 'Bensin, tarif ojek, parkir, & tol',
  Hiburan: 'Bioskop, streaming film, game, & rekreasi',
};
const TANPA = { id: null, nama: 'Tanpa Kategori' };

export default function PilihKategori({ daftar, terpilih, onPilih, onBatal }) {
  const [cari, setCari] = useState('');
  const [pilih, setPilih] = useState(terpilih || TANPA);
  const pt = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48;

  // Gabungkan pilihan Tanpa Kategori dengan kategori dari backend
  const semua = [TANPA, ...(daftar || [])];
  const tampil = semua.filter((k) =>
    (k.nama || '').toLowerCase().includes(cari.trim().toLowerCase())
  );

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
        <Pressable onPress={onBatal} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '600', color: C.text, letterSpacing: -0.5 }}>
          Pilih Kategori
        </Text>
        <Pressable onPress={onBatal} style={{ padding: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: C.muted }}>
            Batal
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section Banner */}
        <View
          style={{
            backgroundColor: '#EFF4FF',
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
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              backgroundColor: '#9CF2E8',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              marginTop: 2,
            }}
          >
            <Ionicons name="pricetag" size={16} color={C.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: C.text, lineHeight: 28 }}>
              Kategori Pengeluaran
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: C.muted, lineHeight: 19.5, marginTop: 4 }}>
              Pilih salah satu kategori untuk mengelompokkan pengeluaranmu. Kategori hanya bisa ditentukan saat buat transaksi baru.
            </Text>
          </View>
        </View>

        {/* Search or Quick Filter */}
        <View
          style={{
            height: 44,
            backgroundColor: C.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Ionicons name="search-outline" size={20} color="#6E7977" style={{ marginRight: 10 }} />
          <TextInput
            value={cari}
            onChangeText={setCari}
            placeholder="Cari nama kategori..."
            placeholderTextColor="#6E7977"
            style={{ flex: 1, fontSize: 14, color: C.text }}
          />
        </View>

        {/* Radiogroup - Pilihan Kategori */}
        <View>
          {tampil.map((k) => {
            const aktif = (pilih && pilih.id === k.id) || (!pilih && k.id === null);
            return (
              <Pressable
                key={String(k.id)}
                onPress={() => setPilih(k)}
                style={({ pressed }) => ({
                  height: 76,
                  backgroundColor: C.card,
                  borderRadius: 8,
                  borderWidth: aktif ? 1.5 : 1,
                  borderColor: aktif ? C.primaryDark : '#E2E8F0',
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                  opacity: pressed ? 0.92 : 1,
                })}
              >
                {/* Kotak Ikon Kategori */}
                <KotakIkon
                  nama={k.nama}
                  ukuran={44}
                  radius={12}
                />

                {/* Info Teks Kategori */}
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: C.text }}>
                      {k.nama}
                    </Text>
                    {aktif ? (
                      <View
                        style={{
                          backgroundColor: '#9CF2E8',
                          borderRadius: 2,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          marginLeft: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '700',
                            color: '#00201D',
                            letterSpacing: 0.5,
                          }}
                        >
                          AKTIF
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: C.muted,
                      marginTop: 2,
                      lineHeight: 16,
                    }}
                    numberOfLines={1}
                  >
                    {KET[k.nama] || 'Kategori transaksi pengeluaran'}
                  </Text>
                </View>

                {/* Radio Circle */}
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: aktif ? C.primaryDark : 'transparent',
                    borderWidth: aktif ? 0 : 2,
                    borderColor: '#E2E8F0',
                  }}
                >
                  {aktif ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Action CTA Buttons */}
        <View style={{ marginTop: 16 }}>
          <Pressable
            onPress={() => onPilih(pilih)}
            style={({ pressed }) => ({
              height: 48,
              borderRadius: 8,
              backgroundColor: C.primaryDark,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
              Simpan Pilihan
            </Text>
          </Pressable>

          <Pressable
            onPress={onBatal}
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              marginTop: 8,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.muted }}>
              Kembali tanpa mengubah
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}