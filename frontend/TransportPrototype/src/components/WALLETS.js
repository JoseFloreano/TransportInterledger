import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWallets, deleteWallet } from '../services/WalletService';

const WalletCard = ({ wallet, onPress, onLongPress }) => {
  // Asignar colores basados en el tipo o usar colores aleatorios
  const getColorByType = (tipo) => {
    const colors = {
      'common': '#F7931A',
      'seller': '#627EEA',
      'default': '#E8E8E8'
    };
    return colors[tipo] || colors.default;
  };

  return (
    <TouchableOpacity 
      style={[styles.walletCard, { backgroundColor: getColorByType(wallet.tipo) }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>{wallet.nombre}</Text>
        <Text style={styles.chevron}>{'>'}</Text>
      </View>
      <Text style={styles.walletType}>TIPO: {wallet.tipo}</Text>
      <Text style={styles.walletUrl} numberOfLines={1} ellipsizeMode="middle">
        {wallet.url}
      </Text>
    </TouchableOpacity>
  );
};

const WALLETS = ({ navigation }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const result = await getWallets();
      
      if (result.success) {
        setWallets(result.data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las wallets');
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar las wallets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWallets();
    setRefreshing(false);
  };

  const handleDeleteWallet = (wallet) => {
    Alert.alert(
      'Eliminar Wallet',
      `¿Estás seguro de eliminar "${wallet.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteWallet(wallet._id);
            if (result.success) {
              loadWallets(); // Recargar la lista
            }
          },
        },
      ]
    );
  };

  // Cargar wallets cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadWallets();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MIS WALLETS</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando wallets...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2C2C2C"
            />
          }
        >
          {wallets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes wallets registradas</Text>
              <Text style={styles.emptySubtext}>Presiona "INSERTAR WALLET" para agregar una</Text>
            </View>
          ) : (
            wallets.map((wallet) => (
              <WalletCard
                key={wallet._id}
                wallet={wallet}
                onPress={() => navigation.navigate('INFO_WALLET', { wallet })}
                onLongPress={() => handleDeleteWallet(wallet)}
              />
            ))
          )}

          <TouchableOpacity 
            style={styles.insertButton}
            onPress={() => navigation.navigate('INSERT_WALLET')}
          >
            <Text style={styles.insertButtonText}>+ INSERTAR WALLET</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navButton, styles.navButtonActive]}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2C2C2C',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
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
    marginBottom: 15,
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
  walletType: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
    marginBottom: 8,
  },
  walletUrl: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
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
  navButtonActive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
  },
  navIcon: {
    fontSize: 28,
  },
});

export default WALLETS;