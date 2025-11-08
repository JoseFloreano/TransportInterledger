import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ViewQRScreen = ({ navigation, route }) => {
  const { product } = route.params || {};

  const handleSave = () => {
    console.log('Save QR');
    // Aquí puedes implementar lógica para guardar el QR en galería
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>NOMBRE APP</Text>

      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <View style={styles.qrCode}>
            {/* QR Code placeholder - reemplaza con librería de QR real */}
            <View style={styles.qrTopLeft} />
            <View style={styles.qrTopRight} />
            <View style={styles.qrBottomLeft} />
            <View style={styles.qrCenter} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE</Text>
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
  backButton: {
    position: 'absolute',
    top: 70,
    left: 30,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2C2C2C',
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  qrContainer: {
    marginBottom: 60,
  },
  qrCode: {
    width: 250,
    height: 250,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 40,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  qrTopLeft: {
    position: 'absolute',
    top: 45,
    left: 45,
    width: 50,
    height: 50,
    backgroundColor: '#2C2C2C',
    borderWidth: 3,
    borderColor: '#2C2C2C',
  },
  qrTopRight: {
    position: 'absolute',
    top: 45,
    right: 45,
    width: 50,
    height: 50,
    backgroundColor: '#2C2C2C',
    borderWidth: 3,
    borderColor: '#2C2C2C',
  },
  qrBottomLeft: {
    position: 'absolute',
    bottom: 45,
    left: 45,
    width: 50,
    height: 50,
    backgroundColor: '#2C2C2C',
    borderWidth: 3,
    borderColor: '#2C2C2C',
  },
  qrCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    backgroundColor: '#2C2C2C',
  },
  saveButton: {
    width: '80%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
});

export default ViewQRScreen;