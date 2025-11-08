import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentCommonQRScreen = ({ navigation }) => {
  const handleOpenCamera = () => {
    console.log('Open camera for common QR');
    // Aquí implementarías expo-camera o react-native-camera
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.nfcButton}>
          <Text style={styles.nfcButtonText}>NFC</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.appName}>NOMBRE APP</Text>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.cameraContainer}
          onPress={handleOpenCamera}
        >
          <View style={styles.cameraBox}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Scan QR code to pay
        </Text>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Wallets')}
        >
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8B8B8',
    borderRadius: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  nfcButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  nfcButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  appName: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginTop: 20,
    marginBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cameraContainer: {
    marginBottom: 30,
  },
  cameraBox: {
    width: 250,
    height: 250,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 80,
  },
  instructionText: {
    fontSize: 16,
    color: '#2C2C2C',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#A0A0A0',
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    fontSize: 28,
  },
});

export default PaymentCommonQRScreen;