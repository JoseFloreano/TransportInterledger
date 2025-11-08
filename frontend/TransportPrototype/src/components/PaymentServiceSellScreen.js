import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentServiceSellScreen = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState('ME'); // 'ME' o 'THEM'

  const handleOpenCamera = () => {
    console.log('Open camera for QR/service');
    // Aquí implementarías la funcionalidad de cámara
  };

  const handleValue = () => {
    console.log('Set value');
    // Navegar a pantalla de ingresar valor
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

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleOption,
              selectedMode === 'ME' && styles.toggleOptionActive
            ]}
            onPress={() => setSelectedMode('ME')}
          >
            <Text style={[
              styles.toggleText,
              selectedMode === 'ME' && styles.toggleTextActive
            ]}>ME</Text>
          </TouchableOpacity>

          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>←</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.toggleOption,
              selectedMode === 'THEM' && styles.toggleOptionActive
            ]}
            onPress={() => setSelectedMode('THEM')}
          >
            <Text style={[
              styles.toggleText,
              selectedMode === 'THEM' && styles.toggleTextActive
            ]}>THEM</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.valueButton}
          onPress={handleValue}
        >
          <Text style={styles.valueButtonText}>value</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Wallets')}
        >
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
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
    marginBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  cameraContainer: {
    marginBottom: 40,
  },
  cameraBox: {
    width: 200,
    height: 200,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 60,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  toggleOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  toggleOptionActive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C6C6C',
  },
  toggleTextActive: {
    color: '#2C2C2C',
    fontWeight: '600',
  },
  arrowContainer: {
    marginHorizontal: 15,
  },
  arrow: {
    fontSize: 24,
    color: '#2C2C2C',
  },
  valueButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  valueButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C2C2C',
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

export default PaymentServiceSellScreen;