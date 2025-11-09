import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { cartService } from '../services/CartService';
import { getProducts } from '../services/ProductsService';
import { initNFC, writePaymentTag, stopNFC } from '../services/nfcService';

const SERVICE_SELL_NFC = ({ navigation }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [nfcActive, setNfcActive] = useState(false);
  const [nfcReady, setNfcReady] = useState(false);

  useEffect(() => {
    // Inicializar NFC cuando el componente se monta
    initNFC().then(result => {
      if (result.success) {
        setNfcReady(true);
        console.log('NFC inicializado correctamente');
      } else {
        Alert.alert('NFC Error', 'Could not initialize NFC. Please check your device settings.');
      }
    });

    // Cargar el carrito cuando la pantalla gana foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartTotal();
    });

    // Cleanup cuando se desmonta el componente
    return () => {
      unsubscribe();
      stopNFC();
      setNfcActive(false);
    };
  }, [navigation]);

  // Cuando cambia el total o el estado de NFC, activar/desactivar write
  useEffect(() => {
    if (cartTotal > 0 && nfcReady && !nfcActive) {
      activateNFCWrite();
    } else if (cartTotal <= 0 && nfcActive) {
      deactivateNFCWrite();
    }
  }, [cartTotal, nfcReady]);

  const loadCartTotal = async () => {
    const cart = await cartService.getCart();
    const result = await getProducts();
    
    if (result.success && result.data) {
      let total = 0;
      result.data.forEach(product => {
        const amount = cart[product._id] || 0;
        total += product.precio * amount;
      });
      setCartTotal(total);
    }
  };

  const activateNFCWrite = async () => {
    if (nfcActive) return;

    console.log('Activando NFC Write mode...');
    setNfcActive(true);

    try {
      // Escribir datos de pago en modo de espera
      const result = await writePaymentTag();
      
      if (result.success) {
        console.log('NFC Write completado exitosamente');
        Alert.alert(
          'Payment Shared',
          'Payment data has been sent via NFC!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Opcional: limpiar carrito o navegar
                // navigation.navigate('CONFIRM_TRANSACTION', { success: true });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error en NFC Write:', error);
    } finally {
      setNfcActive(false);
      // Reactivar para el siguiente tap
      setTimeout(() => {
        if (cartTotal > 0) {
          activateNFCWrite();
        }
      }, 1000);
    }
  };

  const deactivateNFCWrite = async () => {
    console.log('Desactivando NFC Write mode...');
    await stopNFC();
    setNfcActive(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('SERVICE_QR_PAY')}>
          <Text style={styles.qrButtonText}>QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('SHOPPINGCART_PRODUCTS')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appName}>Tap&Pay</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.productButton} onPress={() => navigation.navigate('PRODUCTS')}>
          <Text style={styles.productText}>product</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
        
        <View style={styles.messageContainer}>
          {cartTotal > 0 ? (
            <>
              <Text style={styles.message}>
                NFC Ready{'\n'}
                Waiting for buyer's device...
              </Text>
              {nfcActive && (
                <View style={styles.nfcIndicator}>
                  <Text style={styles.nfcIndicatorText}>📡 Active</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.message}>
              Please add products{'\n'}
              to cart first
            </Text>
          )}
        </View>
        
        {/* Mostrar total solo si es mayor a 0 */}
        {cartTotal > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalText}>${cartTotal.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>ME</Text>
          <Text style={styles.arrow}>←</Text>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SERVICE_ACCOUNT')}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30 },
  header: { paddingTop: 60, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qrButton: { backgroundColor: '#E8E8E8', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  qrButtonText: { fontSize: 15, fontWeight: '500', color: '#2C2C2C' },
  cartButton: { padding: 10 },
  cartIcon: { fontSize: 28 },
  appName: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginTop: 20, marginBottom: 20 },
  content: { flex: 1, paddingHorizontal: 40 },
  productButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 40 },
  productText: { fontSize: 15, color: '#2C2C2C' },
  chevron: { fontSize: 20, color: '#2C2C2C' },
  messageContainer: { alignItems: 'center', marginBottom: 30 },
  message: { fontSize: 22, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 32 },
  nfcIndicator: { marginTop: 20, backgroundColor: '#4CAF50', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15 },
  nfcIndicatorText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  totalBadge: { backgroundColor: '#E8E8E8', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20, alignSelf: 'center', marginBottom: 20 },
  totalText: { fontSize: 18, fontWeight: '600', color: '#2C2C2C' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  toggleText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginHorizontal: 15 },
  arrow: { fontSize: 24, color: '#2C2C2C' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: '#A0A0A0' },
  navButton: { padding: 10 },
  navIcon: { fontSize: 28 },
});

export default SERVICE_SELL_NFC;