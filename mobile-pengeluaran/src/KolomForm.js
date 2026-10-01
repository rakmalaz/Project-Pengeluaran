import { View, Text, TextInput } from 'react-native';
import { C } from './theme';

export default function KolomForm({ label, wajib, nilai, onChange, placeholder, petunjuk, error, maks, keyboardType }) {
  const warnaGaris = error ? '#C62828' : '#E5E7EB';
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.text }}>
          {label}{wajib ? <Text style={{ color: '#C62828' }}> *</Text> : null}
        </Text>
        <View style={{ backgroundColor: wajib ? '#FDECEC' : '#E8EEFB', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: wajib ? '#C62828' : C.muted }}>{wajib ? 'Wajib' : 'Opsional'}</Text>
        </View>
      </View>

      <TextInput
        value={nilai}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        maxLength={maks}
        style={{ backgroundColor: error ? '#FFF5F5' : C.card, borderWidth: error ? 2 : 1, borderColor: warnaGaris, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text }}
      />

      {error ? <Text style={{ fontSize: 12, fontWeight: '700', color: '#C62828', marginTop: 4 }}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ fontSize: 11, color: C.muted, flex: 1 }}>{petunjuk}</Text>
        {maks ? <Text style={{ fontSize: 11, color: C.muted }}>{(nilai || '').length}/{maks}</Text> : null}
      </View>
    </View>
  );
}