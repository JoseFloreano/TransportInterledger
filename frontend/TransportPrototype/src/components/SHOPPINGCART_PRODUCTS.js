import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const SHOPPINGCART_PRODUCTS = ({ navigation }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'prod1', price: '$$$', amount: 1 },
    { id: 2, name: 'prod2', price: '$$$', amount: 3 },
    { id: 3, name: 'prod3', price: '$$$', amount: 5 },
  ]);

  const updateAmount = (id, delta) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, amount: Math.max(0, p.amount + delta) } : p
    ));
  };

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
            <Text style={styles.headerText}>ammount</Text>
          </View>
          <ScrollView style={styles.tableBody}>
            {products.map((p) => (
              <View key={p.id} style={styles.productRow}>
                <Text style={styles.productText}>{p.name}</Text>
                <Text style={styles.productText}>{p.price}</Text>
                <View style={styles.amountControl}>
                  <TouchableOpacity onPress={() => updateAmount(p.id, -1)}>
                    <Text style={styles.controlButton}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.amountText}>{p.amount}</Text>
                  <TouchableOpacity onPress={() => updateAmount(p.id, 1)}>
                    <Text style={styles.controlButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreButton}>
              <Text style={styles.addMoreText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$$$</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('CONFIRM_TRANSACTION')}>
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
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
  addMoreButton: { alignItems: 'center', paddingVertical: 15 },
  addMoreText: { fontSize: 24, color: '#2C2C2C' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 20 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#2C2C2C' },
  totalValue: { fontSize: 16, fontWeight: '600', color: '#2C2C2C' },
  confirmButton: { backgroundColor: '#E8E8E8', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  confirmButtonText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C' },
});

export default SHOPPINGCART_PRODUCTS;