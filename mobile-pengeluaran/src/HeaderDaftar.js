import { View, Text, Pressable, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';

export function HeaderAtas({ onRefresh }) {
  const pt = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48;
  return (
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
      {/* Logo + Teks Header */}
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

      {/* Ikon Refresh Kecil di Sisi Kanan Header (Khusus Frame 14) */}
      {onRefresh ? (
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => ({
            padding: 8,
            borderRadius: 8,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="refresh" size={20} color={C.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default function HeaderDaftar({ onRefresh, onTambah }) {
  return (
    <View>
      {/* Sub-Header & Tombol Muat Ulang */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
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
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: C.card,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="refresh" size={20} color={C.text} />
        </Pressable>
      </View>

      {/* Tombol Utama: Tambah Pengeluaran */}
      <Pressable
        onPress={onTambah}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.primary,
          borderRadius: 8,
          height: 48,
          shadowColor: '#005C55',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '500',
            marginLeft: 8,
          }}
        >
          Tambah Pengeluaran
        </Text>
      </Pressable>

      {/* Header Riwayat Transaksi */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: C.text }}>
          Riwayat Transaksi
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted }}>
          Terbaru
        </Text>
      </View>
    </View>
  );
}