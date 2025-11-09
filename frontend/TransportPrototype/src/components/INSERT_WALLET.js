import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { insertWallet } from '../services/WalletService';

const INSERT_WALLET = ({ navigation }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);

  const tiposWallet = [
    'common',
    'seller'
  ];

  const handleInsertWallet = async () => {
    // Validación básica
    if (!name.trim() || !url.trim() || !tipo.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Intentando insertar wallet...');
      const result = await insertWallet(name.trim(), url.trim(), tipo.trim());
      console.log('Resultado:', result);
      
      if (result.success) {
        // Limpiar campos
        setName('');
        setUrl('');
        setTipo('');
        
        // Volver a la pantalla anterior
        navigation.goBack();
      } else {
        // Mostrar error específico si existe
        const errorMsg = result.error?.message || 'No se pudo insertar la wallet';
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('Error en handleInsertWallet:', error);
      Alert.alert('Error', `Ocurrió un error: ${error.message || 'desconocido'}`);
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
        
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowTipoModal(true)}
          disabled={loading}
        >
          <Text style={[styles.inputText, !tipo && styles.placeholder]}>
            {tipo || 'TIPO (Selecciona una opción)'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.insertButton, loading && styles.insertButtonDisabled]} 
          onPress={handleInsertWallet}
          disabled={loading}
        >
          <Text style={styles.insertButtonText}>
            {loading ? 'INSERTANDO...' : 'INSERTAR WALLET'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTipoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTipoModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTipoModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el tipo de wallet</Text>
            <ScrollView style={styles.optionsList}>
              {tiposWallet.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    tipo === option && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    setTipo(option);
                    setShowTipoModal(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    tipo === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowTipoModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    color: '#2C2C2C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputText: {
    fontSize: 15,
    color: '#2C2C2C',
    flex: 1
  },
  placeholder: {
    color: '#666'
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '70%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 20,
    textAlign: 'center'
  },
  optionsList: {
    maxHeight: 300
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#F5F5F5'
  },
  optionItemSelected: {
    backgroundColor: '#B8B8B8'
  },
  optionText: {
    fontSize: 16,
    color: '#2C2C2C'
  },
  optionTextSelected: {
    fontWeight: '600'
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 10
  },
  modalCloseText: {
    fontSize: 16,
    color: '#E8E8E8',
    fontWeight: '500'
  },
});

export default INSERT_WALLET;