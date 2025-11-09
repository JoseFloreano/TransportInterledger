import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SERVICE_SELL_NFC = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.qrButton}>
          <Text style={styles.qrButtonText}>QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appName}>NOMBRE APP</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.productButton} onPress={() => navigation.navigate('PRODUCTS')}>
          <Text style={styles.productText}>product</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Please bring your{'\n'}phone closer to{'\n'}the device.</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>ME</Text>
          <Text style={styles.arrow}>←</Text>
          <Text style={styles.toggleText}>THEM</Text>
        </View>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('WALLETS')}>
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SERVICE_ACCOUNT')}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30 },
  header: { paddingTop: 60, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qrButton: { backgroundColor: '#E8E8E8', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  qrButtonText: { fontSize: 15, fontWeight: '500', color: '#2C2C2C' },
  cartButton: { padding: 10 },
  cartIcon: { fontSize: 28 },
  appName: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginTop: 20, marginBottom: 20 },
  content: { flex: 1, paddingHorizontal: 40 },
  productButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 40 },
  productText: { fontSize: 15, color: '#2C2C2C' },
  chevron: { fontSize: 20, color: '#2C2C2C' },
  messageContainer: { alignItems: 'center', marginBottom: 40 },
  message: { fontSize: 22, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 32 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  toggleText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginHorizontal: 15 },
  arrow: { fontSize: 24, color: '#2C2C2C' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default SERVICE_SELL_NFC;