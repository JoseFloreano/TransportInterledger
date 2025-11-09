import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { initNFC, startReading, stopNFC } from '../services/nfcService';

const COMMON_PAY_NFC = ({ navigation }) => {
  useEffect(() => {
    // Initialize NFC when component mounts
    initNFC();

    // Automatically start reading when screen opens
    startReading(tag => {
      console.log('Tag detected:', tag);
      Alert.alert('NFC Tag', JSON.stringify(tag, null, 2));
    });

    // Cleanup on unmount
    return () => stopNFC();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('COMMON_PAY_QR')}>
          <Text style={styles.qrButtonText}>QR</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.appName}>NOMBRE APP</Text>

      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Please bring your{'\n'}phone closer to{'\n'}the device.
          </Text>
        </View>
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
  qrButton: { backgroundColor: '#E8E8E8', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  qrButtonText: { fontSize: 15, fontWeight: '500', color: '#2C2C2C' },
  appName: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginTop: 20, marginBottom: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  messageContainer: { alignItems: 'center' },
  message: { fontSize: 22, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 32 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default COMMON_PAY_NFC;
