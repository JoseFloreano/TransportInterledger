import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COMMON_PAY_QR = ({ navigation }) => {
  const handleOpenCamera = () => {
    console.log('Open camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.nfcButton} onPress={() => navigation.navigate('COMMON_PAY_NFC')}>
          <Text style={styles.nfcButtonText}>NFC</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.appName}>Tap&Pay</Text>

      <View style={styles.content}>
        <TouchableOpacity style={styles.cameraContainer} onPress={handleOpenCamera}>
          <View style={styles.cameraBox}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('WALLETS')}>
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('COMMON_ACCOUNT')}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30 },
  header: { paddingTop: 60, paddingHorizontal: 30, alignItems: 'center' },
  nfcButton: { backgroundColor: '#E8E8E8', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  nfcButtonText: { fontSize: 15, fontWeight: '500', color: '#2C2C2C' },
  appName: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginTop: 20, marginBottom: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  cameraContainer: { marginBottom: 30 },
  cameraBox: { width: 250, height: 250, backgroundColor: '#E8E8E8', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 80 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default COMMON_PAY_QR;