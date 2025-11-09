import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { userService } from '../services/UserService';

const COMMON_CONFIG = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await userService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const changeUserType = async () => {
    if (!user || !user._id) {
      Alert.alert('Error', 'User information not found');
      return;
    }

    // Determinar el nuevo rol basado en el rol actual
    let newRole;
    let targetScreen;
    
    if (user.rol === 'common') {
      newRole = 'seller';
      targetScreen = 'SELLER_CONFIG';
    } else if (user.rol === 'seller') {
      newRole = 'buyer';
      targetScreen = 'BUYER_CONFIG';
    } else if (user.rol === 'buyer') {
      newRole = 'common';
      targetScreen = 'COMMON_CONFIG';
    }

    // Confirmar el cambio
    Alert.alert(
      'Confirm Change',
      `Do you want to change your role from ${user.rol} to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(true);
            const result = await userService.updateUserRole(user._id, newRole);
            
            if (result.success) {
              // Actualizar el estado local
              setUser({ ...user, rol: newRole });
              
              // Navegar a la pantalla correspondiente
              navigation.replace(targetScreen);
            }
            
            setUpdating(false);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C2C2C" />
        <Text style={styles.loadingText}>Loading...</Text>
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
        <TouchableOpacity style={styles.photoContainer}>
          <View style={styles.photoCircle}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{user?.nombre || 'username'}</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{user?.correo || 'email'}</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>password</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{user?.rol || 'common'}</Text>
          <TouchableOpacity onPress={changeUserType} disabled={updating}>
            <Text style={[styles.changeText, updating && styles.disabledText]}>
              {updating ? 'updating...' : 'change'}
            </Text>
          </TouchableOpacity>
        </View>
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
  content: { paddingHorizontal: 40, alignItems: 'center' },
  photoContainer: { marginBottom: 40 },
  photoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 40 },
  fieldRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 15 },
  fieldLabel: { fontSize: 15, color: '#2C2C2C' },
  changeText: { fontSize: 15, color: '#2C2C2C', fontWeight: '500' },
  disabledText: { opacity: 0.5 },
});

export default COMMON_CONFIG;