import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { initNFC, startReadingPayment, stopNFC } from '../services/nfcService';
import { getDefaultWallet } from '../services/WalletService';

const SERVICE_PAY_NFC = ({ navigation }) => {
  const [nfcActive, setNfcActive] = useState(false);
  const [nfcReady, setNfcReady] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    // Inicializar NFC y verificar wallet
    const initialize = async () => {
      // Inicializar NFC
      const nfcResult = await initNFC();
      if (nfcResult.success) {
        setNfcReady(true);
        console.log('NFC inicializado correctamente');
      } else {
        Alert.alert('NFC Error', 'Could not initialize NFC. Please check your device settings.');
        return;
      }

      // Verificar que el usuario tenga una wallet por defecto
      const walletResult = await getDefaultWallet();
      if (walletResult.success && walletResult.data) {
        setHasWallet(true);
        console.log('Default wallet found:', walletResult.data.url);
      } else {
        Alert.alert(
          'No Wallet Found',
          'Please set up a default wallet before making payments.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Wallets', onPress: () => navigation.navigate('WALLETS') }
          ]
        );
        return;
      }

      // Si todo está listo, activar NFC reading
      activateNFCReading();
    };

    initialize();

    // Cleanup cuando se desmonta el componente
    return () => {
      stopNFC();
      setNfcActive(false);
    };
  }, []);

  const activateNFCReading = async () => {
    if (!nfcReady || !hasWallet || nfcActive) return;

    console.log('Activando NFC Reading mode...');
    setNfcActive(true);

    try {
      // Iniciar lectura de NFC (esto esperará hasta que se detecte un tag)
      await startReadingPayment(navigation);
      
    } catch (error) {
      console.error('Error en NFC Reading:', error);
      Alert.alert('NFC Error', 'Failed to read NFC tag. Please try again.');
      
      // Reactivar para intentar de nuevo
      setTimeout(() => {
        if (nfcReady && hasWallet) {
          activateNFCReading();
        }
      }, 1000);
    } finally {
      setNfcActive(false);
      
      // Reactivar automáticamente para el siguiente tap
      setTimeout(() => {
        if (nfcReady && hasWallet) {
          activateNFCReading();
        }
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => navigation.navigate('COMMON_QR_PAY')}
        >
          <Text style={styles.qrButtonText}>QR</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appName}>Tap&Pay</Text>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          {nfcReady && hasWallet ? (
            <>
              <Text style={styles.message}>
                NFC Ready{'\n'}
                Tap your phone to{'\n'}
                the seller's device
              </Text>
              {nfcActive && (
                <View style={styles.nfcIndicator}>
                  <Text style={styles.nfcIndicatorText}>📡 Listening...</Text>
                </View>
              )}
            </>
          ) : !hasWallet ? (
            <Text style={styles.message}>
              Please set up a{'\n'}
              default wallet first
            </Text>
          ) : (
            <Text style={styles.message}>
              Initializing NFC...
            </Text>
          )}
        </View>
        
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>ME</Text>
          <Text style={styles.arrow}>→</Text>
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
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  messageContainer: { alignItems: 'center', marginBottom: 40 },
  message: { fontSize: 22, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 32 },
  nfcIndicator: { marginTop: 20, backgroundColor: '#2196F3', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15 },
  nfcIndicatorText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  toggleText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginHorizontal: 15 },
  arrow: { fontSize: 24, color: '#2C2C2C' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default SERVICE_PAY_NFC;