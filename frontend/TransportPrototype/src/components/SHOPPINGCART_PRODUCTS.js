import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getProducts } from '../services/ProductsService';
import { cartService } from '../services/CartService';

const SHOPPINGCART_PRODUCTS = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductsWithCart();
  }, []);

  const loadProductsWithCart = async () => {
    setLoading(true);
    
    const result = await getProducts();
    
    if (result.success && result.data) {
      const cart = await cartService.getCart();
      
      const productsWithAmounts = result.data.map(product => ({
        ...product,
        amount: cart[product._id] || 0
      }));
      
      setProducts(productsWithAmounts);
    }
    
    setLoading(false);
  };

  const updateAmount = async (productId, delta) => {
    const updatedProducts = products.map(p => {
      if (p._id === productId) {
        const newAmount = Math.max(0, p.amount + delta);
        return { ...p, amount: newAmount };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    
    const product = updatedProducts.find(p => p._id === productId);
    await cartService.updateProductAmount(productId, product.amount);
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.precio * product.amount);
    }, 0).toFixed(2);
  };

  const handleConfirm = () => {
    // Guardar el total y regresar a la pantalla anterior
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C2C2C" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>NOMBRE APP</Text>
      <View style={styles.content}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>name</Text>
            <Text style={styles.headerText}>price</Text>
            <Text style={styles.headerText}>amount</Text>
          </View>
          <ScrollView style={styles.tableBody}>
            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products available</Text>
              </View>
            ) : (
              products.map((p) => (
                <View key={p._id} style={styles.productRow}>
                  <Text style={styles.productText}>{p.nombre}</Text>
                  <Text style={styles.productText}>${p.precio}</Text>
                  <View style={styles.amountControl}>
                    <TouchableOpacity onPress={() => updateAmount(p._id, -1)}>
                      <Text style={styles.controlButton}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.amountText}>{p.amount}</Text>
                    <TouchableOpacity onPress={() => updateAmount(p._id, 1)}>
                      <Text style={styles.controlButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#2C2C2C' },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 40 },
  content: { flex: 1, paddingHorizontal: 30 },
  tableContainer: { backgroundColor: '#E8E8E8', borderRadius: 20, padding: 20, flex: 1, maxHeight: 400 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#B8B8B8' },
  headerText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2C2C2C', textAlign: 'center' },
  tableBody: { marginTop: 10 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#D0D0D0' },
  productText: { flex: 1, fontSize: 14, color: '#2C2C2C', textAlign: 'center' },
  amountControl: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  controlButton: { fontSize: 20, color: '#2C2C2C', paddingHorizontal: 10 },
  amountText: { fontSize: 16, color: '#2C2C2C', marginHorizontal: 10 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#2C2C2C', fontWeight: '500' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 20 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#2C2C2C' },
  totalValue: { fontSize: 16, fontWeight: '600', color: '#2C2C2C' },
  confirmButton: { backgroundColor: '#E8E8E8', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  confirmButtonText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C' },
});

export default SHOPPINGCART_PRODUCTS;