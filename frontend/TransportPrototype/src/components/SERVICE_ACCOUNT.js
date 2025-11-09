import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SERVICE_ACCOUNT = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Tap&Pay</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('COMMON_CONFIG')}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar} />
            <Text style={styles.username}>USERNAME</Text>
          </View>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TRANSACTION')}>
          <Text style={styles.menuText}>transaction</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PRODUCTS')}>
          <Text style={styles.menuText}>products</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>help</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemLast}>
          <Text style={styles.menuText}>close session</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('WALLETS')}>
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 40 },
  content: { flex: 1, paddingHorizontal: 40 },
  profileSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20 },
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#C0C0C0', marginRight: 15 },
  username: { fontSize: 16, fontWeight: '600', color: '#2C2C2C' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 10 },
  menuItemLast: { backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15 },
  menuText: { fontSize: 15, color: '#2C2C2C' },
  chevron: { fontSize: 20, color: '#2C2C2C' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default SERVICE_ACCOUNT;