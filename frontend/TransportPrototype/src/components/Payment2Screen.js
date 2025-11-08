import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Payment2Screen = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState('ME'); // 'ME' o 'THEY'

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NOMBRE APP</Text>

      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              selectedMode === 'ME' && styles.toggleButtonActive
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
              styles.toggleButton,
              selectedMode === 'THEY' && styles.toggleButtonActive
            ]}
            onPress={() => setSelectedMode('THEY')}
          >
            <Text style={[
              styles.toggleText,
              selectedMode === 'THEY' && styles.toggleTextActive
            ]}>THEY</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mainText}>
          Telephonum{'\n'}
          prope terminalem{'\n'}
          adfer
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
    paddingTop: 60,
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  toggleButtonActive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C6C6C',
  },
  toggleTextActive: {
    color: '#2C2C2C',
  },
  arrowContainer: {
    marginHorizontal: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#2C2C2C',
  },
  mainText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 40,
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

export default Payment2Screen;