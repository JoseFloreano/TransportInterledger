import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getProducts } from '../services/ProductsService';

const PRODUCTS = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar productos cuando el componente se monta
  useEffect(() => {
    loadProducts();
  }, []);

  // Recargar productos cuando vuelves a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    
    if (result.success) {
      setProducts(result.data);
    }
    
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C2C2C" />
        <Text style={styles.loadingText}>Loading products...</Text>
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
            <Text style={[styles.headerText, { flex: 2 }]}>name</Text>
            <Text style={styles.headerText}>price</Text>
            <Text style={styles.headerText}>NFC</Text>
            <Text style={styles.headerText}>QR</Text>
          </View>
          <ScrollView 
            style={styles.tableBody}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#2C2C2C']}
              />
            }
          >
            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products yet</Text>
                <Text style={styles.emptySubText}>Add your first product below</Text>
              </View>
            ) : (
              products.map((p) => (
                <View key={p.id} style={styles.productRow}>
                  <Text style={[styles.productText, { flex: 2 }]}>{p.nombre}</Text>
                  <Text style={styles.productText}>${p.precio}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('WRITE_NFC', { product: p })}>
                    <Text style={styles.actionLink}>write</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('VIEW_QR', { product: p })}>
                    <Text style={styles.actionLink}>view</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.insertButton} onPress={() => navigation.navigate('INSERT_PRODUCTS')}>
          <Text style={styles.insertButtonText}>INSERT PRODUCT</Text>
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
  tableContainer: { backgroundColor: '#E8E8E8', borderRadius: 20, padding: 20, flex: 1, maxHeight: 500 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#B8B8B8' },
  headerText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2C2C2C', textAlign: 'center' },
  tableBody: { marginTop: 10 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#D0D0D0' },
  productText: { flex: 1, fontSize: 14, color: '#2C2C2C', textAlign: 'center' },
  actionLink: { flex: 1, fontSize: 13, color: '#2C2C2C', textDecorationLine: 'underline', textAlign: 'center' },
  insertButton: { backgroundColor: '#E8E8E8', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  insertButtonText: { fontSize: 15, fontWeight: '500', color: '#2C2C2C' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#2C2C2C', fontWeight: '500' },
  emptySubText: { fontSize: 13, color: '#666', marginTop: 5 },
});

export default PRODUCTS;