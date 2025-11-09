import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera'; // Importación correcta, ahora incluye CameraType
import { qrService } from '../services/qrService'; // Se asume que esta ruta es correcta

const COMMON_PAY_QR = ({ navigation }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (showCamera) {
      // Usamos requestCameraPermissionsAsync directamente de expo-camera
      requestCameraPermission(); 
    }
  }, [showCamera]);

  const requestCameraPermission = async () => {
    // Solicitamos permiso para la CÁMARA. 
    // La detección de códigos de barras está incluida en el permiso de la cámara en este SDK.
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
    setScanned(false);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setScanned(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    // Si ya se escaneó y estamos esperando el procesamiento, salimos
    if (scanned) return; 
    
    setScanned(true); // Bloquear nuevos escaneos inmediatamente
    
    try {
      // Validar QR
      if (!qrService.isValidQR(data)) {
        Alert.alert('QR Inválido', 'El código QR no contiene información válida del producto');
        setScanned(false); // Permitir escanear de nuevo
        return;
      }

      // Parsear datos del producto
      const productData = qrService.parseQRData(data);

      // Verificar stock
      if (productData.stock <= 0) {
        Alert.alert('Sin stock', 'Este producto no está disponible');
        handleCloseCamera(); // Cerrar cámara
        return;
      }

      // Cerrar cámara y mostrar información del producto
      handleCloseCamera();
      
      Alert.alert(
        'Producto escaneado',
        `${productData.name}\nPrecio: $${productData.price.toFixed(2)}\nStock disponible: ${productData.stock}`,
        [
          {
            text: 'Escanear otro',
            // Al presionar, se reabre la cámara y se resetea el estado `scanned`
            onPress: handleOpenCamera 
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error processing QR:', error);
      Alert.alert('Error', 'No se pudo procesar el código QR');
      setScanned(false); // Permitir escanear de nuevo
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.nfcButton} 
          onPress={() => navigation.navigate('COMMON_PAY_NFC')}
        >
          <Text style={styles.nfcButtonText}>NFC</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.appName}>Tap&Pay</Text>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.cameraContainer} 
          onPress={handleOpenCamera}
        >
          <View style={styles.cameraBox}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.scanText}>Tocar para escanear QR</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('WALLETS')}
        >
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonActive]}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('COMMON_ACCOUNT')}
        >
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Cámara */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={handleCloseCamera}
      >
        <View style={styles.modalContainer}>
          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Solicitando permisos de cámara...</Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Sin acceso a la cámara</Text>
              <Text style={styles.permissionSubtext}>
                Por favor permite el acceso a la cámara en la configuración
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseCamera}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Camera
              style={styles.camera}
              type={CameraType.back} // Usamos CameraType.back, eliminando .Constants
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              // ELIMINAMOS barCodeScannerSettings porque la detección de QR es la configuración por defecto
              // al usar onBarCodeScanned en Camera en el SDK 54.
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.topOverlay}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleCloseCamera}
                  >
                    <Text style={styles.backButtonText}>✕ Cerrar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.middleOverlay}>
                  <View style={styles.scanArea}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                </View>

                <View style={styles.bottomOverlay}>
                  <Text style={styles.instructionText}>
                    Apúntale al código QR del producto
                  </Text>
                  {scanned && (
                    <Text style={styles.processingText}>Procesando...</Text>
                  )}
                </View>
              </View>
            </Camera>
          )}
        </View>
      </Modal>
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
  appName: { 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2C2C2C', 
    marginTop: 20, 
    marginBottom: 40 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  cameraContainer: { 
    marginBottom: 30 
  },
  cameraBox: { 
    width: 250, 
    height: 250, 
    backgroundColor: '#E8E8E8', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cameraIcon: { 
    fontSize: 80,
    marginBottom: 10
  },
  scanText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20
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
  
  // Estilos del Modal de Cámara
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionSubtext: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  closeButtonText: {
    color: '#2C2C2C',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  middleOverlay: {
    flexDirection: 'row',
    flex: 2,
  },
  scanArea: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  processingText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default COMMON_PAY_QR;