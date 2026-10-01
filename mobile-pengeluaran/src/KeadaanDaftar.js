import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';

// Frame 13_Daftar_Kosong
export function DaftarKosong({ onTambah }) {
  return (
    <View
      style={{
        backgroundColor: C.card,
        borderRadius: 8,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 8,
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
        <Ionicons name="receipt-outline" size={32} color={C.primaryDark} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginTop: 16 }}>
        Belum Ada Pengeluaran
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
        Catatan pengeluaran Anda masih kosong. Mulai catat pengeluaran harian Anda agar arus kas tetap terkontrol.
      </Text>
      <Pressable
        onPress={onTambah}
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
        <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
          Tambah Pengeluaran
        </Text>
      </Pressable>
    </View>
  );
}

// Frame 14_Gagal_Memuat
export function GagalMemuat({ onUlang }) {
  return (
    <View
      style={{
        backgroundColor: C.card,
        borderRadius: 8,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 8,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: '#FEE2E2',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="cloud-offline-outline" size={32} color="#B91C1C" />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginTop: 16 }}>
        Gagal Memuat Data
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
        Gagal memuat data transaksi. Periksa koneksi internet Anda dan coba beberapa saat lagi.
      </Text>
      <Pressable
        onPress={onUlang}
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
        <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
          Coba Lagi
        </Text>
      </Pressable>
    </View>
  );
}