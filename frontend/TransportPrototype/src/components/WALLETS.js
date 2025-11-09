import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const WalletCard = ({ title, defaultTransport, onPress, backgroundColor }) => {
  return (
    <TouchableOpacity 
      style={[styles.walletCard, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>{title}</Text>
        <Text style={styles.chevron}>{'>'}</Text>
      </View>
      <Text style={styles.walletDefault}>DEFAULT: {defaultTransport}</Text>
    </TouchableOpacity>
  );
};

const WALLETS = ({ navigation }) => {
  const wallets = [
    { id: 1, title: 'WALET 1', defaultTransport: 'SUBWAY', color: '#F5DEB3' },
    { id: 2, title: 'WALET 2', defaultTransport: 'BUS', color: '#B0D4E3' },
    { id: 3, title: 'WALET 3', defaultTransport: 'NONE', color: '#D0D0D0' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NOMBRE APP</Text>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            title={wallet.title}
            defaultTransport={wallet.defaultTransport}
            backgroundColor={wallet.color}
            onPress={() => navigation.navigate('INFO_WALET', { wallet })}
          />
        ))}

        <TouchableOpacity 
          style={styles.insertButton}
          onPress={() => navigation.navigate('INSERT_WALET')}
        >
          <Text style={styles.insertButtonText}>INSERT WALLET</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('COMMON_PAY_QR')}
        >
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('COMMON_ACCOUNT')}
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
    paddingHorizontal: 30,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  walletCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  chevron: {
    fontSize: 20,
    color: '#2C2C2C',
  },
  walletDefault: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  insertButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  insertButtonText: {
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

export default WALLETS;