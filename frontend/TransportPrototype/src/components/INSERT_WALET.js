import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { insertWallet } from '../services/WalletService';

const INSERT_WALLET = ({ navigation }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInsertWallet = async () => {
    // Validación básica
    if (!name.trim() || !url.trim() || !tipo.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const result = await insertWallet(name.trim(), url.trim(), tipo.trim());
      
      if (result.success) {
        // Limpiar campos
        setName('');
        setUrl('');
        setTipo('');
        
        // Volver a la pantalla anterior
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error en handleInsertWallet:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.header}>AGREGAR WALLET</Text>
      
      <View style={styles.content}>
        <TextInput 
          style={styles.input} 
          placeholder="NOMBRE" 
          placeholderTextColor="#666" 
          value={name} 
          onChangeText={setName}
          editable={!loading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="URL O DIRECCIÓN" 
          placeholderTextColor="#666" 
          value={url} 
          onChangeText={setUrl}
          editable={!loading}
          autoCapitalize="none"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="TIPO (ej: Bitcoin, Ethereum)" 
          placeholderTextColor="#666" 
          value={tipo} 
          onChangeText={setTipo}
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={[styles.insertButton, loading && styles.insertButtonDisabled]} 
          onPress={handleInsertWallet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2C2C2C" />
          ) : (
            <Text style={styles.insertButtonText}>INSERTAR WALLET</Text>
          )}
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
    paddingTop: 60 
  },
  backButton: { 
    position: 'absolute', 
    top: 70, 
    left: 30, 
    zIndex: 10 
  },
  backButtonText: { 
    fontSize: 24, 
    color: '#2C2C2C' 
  },
  header: { 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2C2C2C', 
    marginBottom: 60 
  },
  content: { 
    paddingHorizontal: 40 
  },
  input: { 
    width: '100%', 
    backgroundColor: '#E8E8E8', 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    fontSize: 15, 
    color: '#2C2C2C' 
  },
  insertButton: { 
    width: '100%', 
    backgroundColor: '#E8E8E8', 
    paddingVertical: 18, 
    borderRadius: 20, 
    marginTop: 20, 
    alignItems: 'center' 
  },
  insertButtonDisabled: {
    opacity: 0.6
  },
  insertButtonText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2C2C2C' 
  },
});

export default INSERT_WALLET;