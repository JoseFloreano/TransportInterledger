import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const INFO_WALET = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>NOMBRE APP</Text>
      <View style={styles.content}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>NAME</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>ADRESS</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>DEFAULT</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 60 },
  content: { paddingHorizontal: 40 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 20 },
  fieldLabel: { fontSize: 15, color: '#2C2C2C' },
  changeText: { fontSize: 15, color: '#2C2C2C', fontWeight: '500' },
  confirmButton: { width: '100%', backgroundColor: '#E8E8E8', paddingVertical: 18, borderRadius: 20, marginTop: 40, alignItems: 'center' },
  confirmButtonText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C' },
});

export default INFO_WALET;