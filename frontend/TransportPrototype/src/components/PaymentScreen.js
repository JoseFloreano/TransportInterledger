import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>NOMBRE APP</Text>

      <View style={styles.content}>
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
    paddingTop: 60,
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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

export default PaymentScreen;