import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { insertProduct } from '../services/ProductsService';

const INSERT_PRODUCTS = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInsert = async () => {
    setLoading(true);
    
    // Llamar la función pasando los parámetros
    const result = await insertProduct(name, price);
    
    if (result.success) {
      Alert.alert('Éxito', result.message);
      setName('');
      setPrice('');
      
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Tap&Pay</Text>
      <View style={styles.content}>
        <TextInput 
          style={styles.input} 
          placeholder="NAME" 
          placeholderTextColor="#666" 
          value={name} 
          onChangeText={setName}
          editable={!loading}
        />
        <TextInput 
          style={styles.input} 
          placeholder="PRICE" 
          placeholderTextColor="#666" 
          value={price} 
          onChangeText={setPrice} 
          keyboardType="numeric"
          editable={!loading}
        />
        {/* CORRECCIÓN: Solo un onPress en el TouchableOpacity */}
        <TouchableOpacity 
          style={[styles.insertButton, loading && styles.buttonDisabled]} 
          onPress={handleInsert}
          disabled={loading}
        >
          <Text style={styles.insertButtonText}>
            {loading ? 'INSERTING...' : 'INSERT PRODUCT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 60 },
  content: { paddingHorizontal: 40 },
  input: { width: '100%', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20, fontSize: 15, color: '#2C2C2C' },
  insertButton: { width: '100%', backgroundColor: '#E8E8E8', paddingVertical: 18, borderRadius: 20, marginTop: 20, alignItems: 'center' },
  insertButtonText: { fontSize: 16, fontWeight: '500', color: '#2C2C2C' },
  buttonDisabled: { opacity: 0.5 },
});

export default INSERT_PRODUCTS;