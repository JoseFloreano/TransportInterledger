import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';
import { authService } from './AuthService';

export const insertWallet = async (name, url, tipo) => {
  if (!name || !url || !tipo) {
    Alert.alert('Error', 'Please enter name, url and tipo.');
    return { success: false };
  }

  try {
    const usuario = await authService.getCurrentUser();
    
    if (!usuario || !usuario._id) {
      Alert.alert('Error', 'User not authenticated.');
      return { success: false };
    }

    const wallet = {
      id_usuario: usuario._id,
      nombre: name,
      url: url,
      tipo: tipo
    };

    console.log('Enviando wallet:', wallet);
    console.log('Ruta: /wallet'); // Verifica que esta sea tu ruta correcta
    
    const response = await apiCall('wallet', 'POST', wallet);
    console.log('Respuesta del servidor:', response);
    
    Alert.alert('Success', 'Wallet inserted successfully!');
    return { success: true, data: response };
    
  } catch (error) {
    console.error('Error inserting wallet:', error);
    
    // Mejor manejo del error
    let errorMessage = 'Failed to insert wallet. Please try again.';
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage);
    return { success: false, error };
  }
};

export const getWallets = async () => {
  try {
    const usuario = await authService.getCurrentUser();
    
    if (!usuario || !usuario._id) {
      Alert.alert('Error', 'User not authenticated.');
      return { success: false, data: [] };
    }

    console.log('Obteniendo wallets...');
    const response = await apiCall('wallet', 'GET');
    console.log('Wallets obtenidas:', response);
    
    // Filtrar wallets del usuario actual
    const userWallets = response.filter(wallet => wallet.id_usuario === usuario._id);
    
    console.log('Wallets del usuario:', userWallets);
    return { success: true, data: userWallets };
    
  } catch (error) {
    console.error('Error fetching wallets:', error);
    Alert.alert('Error', 'Failed to load wallets. Please try again.');
    return { success: false, error, data: [] };
  }
};

export const getDefaultWallet = async () => {
  try {
    const usuario = await authService.getCurrentUser();
    
    if (!usuario || !usuario._id) {
      console.log('Usuario no autenticado');
      return { success: false, data: null };
    }

    console.log('Obteniendo wallet por defecto...');
    const response = await apiCall('wallet', 'GET');
    console.log('Todas las wallets:', response);
    
    // Buscar la wallet del usuario que tenga default = true
    const defaultWallet = response.find(
      wallet => wallet.id_usuario === usuario._id && wallet.default === true
    );
    
    if (defaultWallet) {
      console.log('Wallet por defecto encontrada:', defaultWallet);
      return { success: true, data: defaultWallet };
    } else {
      console.log('No se encontró wallet por defecto');
      return { success: false, data: null, message: 'No default wallet found' };
    }
    
  } catch (error) {
    console.error('Error fetching default wallet:', error);
    return { success: false, error, data: null };
  }
};

export const updateWallet = async (id, updates) => {
  try {
    const response = await apiCall(`wallet/${id}`, 'PUT', updates);
    Alert.alert('Success', 'Wallet updated successfully!');
    return { success: true, data: response };
  } catch (error) {
    console.error('Error updating wallet:', error);
    Alert.alert('Error', 'Failed to update wallet.');
    return { success: false, error };
  }
};

export const deleteWallet = async (id) => {
  try {
    const response = await apiCall(`wallet/${id}`, 'DELETE');
    Alert.alert('Success', 'Wallet deleted successfully!');
    return { success: true, data: response };
  } catch (error) {
    console.error('Error deleting wallet:', error);
    Alert.alert('Error', 'Failed to delete wallet.');
    return { success: false, error };
  }
};