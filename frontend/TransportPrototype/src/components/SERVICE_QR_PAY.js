import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { cartService } from '../services/CartService';
import { getProducts } from '../services/ProductsService';
import { qrService } from '../services/qrService';

const SERVICE_QR_PAY = ({ navigation }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [qrData, setQrData] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Cargar el total cuando la pantalla gana foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadCartData = async () => {
    const cart = await cartService.getCart();
    const result = await getProducts();
    
    if (result.success && result.data) {
      let total = 0;
      const items = [];
      
      result.data.forEach(product => {
        const amount = cart[product._id] || 0;
        if (amount > 0) {
          total += product.precio * amount;
          items.push({
            id: product._id,
            name: product.nombre,
            price: product.precio,
            quantity: amount
          });
        }
      });
      
      setCartTotal(total);
      setCartItems(items);
      
      // Generar datos del QR con la información del carrito
      const qrContent = qrService.generateCartQR({
        items: items,
        total: total,
        timestamp: Date.now()
      });
      
      setQrData(qrContent);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.nfcButton} 
          onPress={() => navigation.navigate('SERVICE_SELL_NFC')}
        >
          <Text style={styles.nfcButtonText}>NFC</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cartButton} 
          onPress={() => navigation.navigate('SHOPPINGCART_PRODUCTS')}
        >
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.appName}>Tap&Pay</Text>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.productButton} 
          onPress={() => navigation.navigate('PRODUCTS')}
        >
          <Text style={styles.productText}>product</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>

        <View style={styles.qrContainer}>
          {qrData ? (
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrData}
                size={200}
                backgroundColor="#E8E8E8"
                color="#2C2C2C"
              />
            </View>
          ) : (
            <View style={styles.qrCode}>
              <View style={styles.qrTopLeft} />
              <View style={styles.qrTopRight} />
              <View style={styles.qrBottomLeft} />
              <View style={styles.qrCenter} />
            </View>
          )}
        </View>
        
        {/* Mostrar total solo si es mayor a 0 */}
        {cartTotal > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalText}>${cartTotal.toFixed(2)}</Text>
          </View>
        )}
        
        {cartTotal === 0 && (
          <View style={styles.emptyCartMessage}>
            <Text style={styles.emptyCartText}>
              El carrito está vacío
            </Text>
          </View>
        )}
        
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>ME</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SERVICE_QR_BUY')}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.toggleText}>THEM</Text>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('WALLETS')}
        >
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('SERVICE_ACCOUNT')}
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
    borderRadius: 30 
  },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  nfcButton: { 
    backgroundColor: '#E8E8E8', 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 20 
  },
  nfcButtonText: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: '#2C2C2C' 
  },
  cartButton: { 
    padding: 10 
  },
  cartIcon: { 
    fontSize: 28 
  },
  appName: { 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2C2C2C', 
    marginTop: 20, 
    marginBottom: 20 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 40 
  },
  productButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#E8E8E8', 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    marginBottom: 30 
  },
  productText: { 
    fontSize: 15, 
    color: '#2C2C2C' 
  },
  chevron: { 
    fontSize: 20, 
    color: '#2C2C2C' 
  },
  qrContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  qrCodeWrapper: {
    backgroundColor: '#E8E8E8',
    padding: 20,
    borderRadius: 20,
  },
  qrCode: { 
    width: 200, 
    height: 200, 
    backgroundColor: '#E8E8E8', 
    borderRadius: 20, 
    padding: 30, 
    position: 'relative' 
  },
  qrTopLeft: { 
    position: 'absolute', 
    top: 35, 
    left: 35, 
    width: 40, 
    height: 40, 
    backgroundColor: '#2C2C2C' 
  },
  qrTopRight: { 
    position: 'absolute', 
    top: 35, 
    right: 35, 
    width: 40, 
    height: 40, 
    backgroundColor: '#2C2C2C' 
  },
  qrBottomLeft: { 
    position: 'absolute', 
    bottom: 35, 
    left: 35, 
    width: 40, 
    height: 40, 
    backgroundColor: '#2C2C2C' 
  },
  qrCenter: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    marginTop: -15, 
    marginLeft: -15, 
    width: 30, 
    height: 30, 
    backgroundColor: '#2C2C2C' 
  },
  totalBadge: { 
    backgroundColor: '#E8E8E8', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 20, 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  totalText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#2C2C2C' 
  },
  emptyCartMessage: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  toggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  toggleText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2C2C2C', 
    marginHorizontal: 15 
  },
  arrow: { 
    fontSize: 24, 
    color: '#2C2C2C',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 30, 
    borderTopWidth: 1, 
    borderTopColor: '#A0A0A0' 
  },
  navButton: { 
    padding: 10 
  },
  navButtonActive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15
  },
  navIcon: { 
    fontSize: 28 
  },
});

export default SERVICE_QR_PAY;