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

    const response = await apiCall('wallets', 'POST', wallet);
    console.log('Wallet inserted:', response);
    
    Alert.alert('Success', 'Wallet inserted successfully!');
    return { success: true, data: response };
    
  } catch (error) {
    console.error('Error inserting wallet:', error);
    Alert.alert('Error', 'Failed to insert wallet. Please try again.');
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

    
    const response = await apiCall('wallets/user/${usuario._id}', 'GET');
    
    // Filtrar wallets del usuario actual
    const userWallets = response.filter(wallet => wallet.id_usuario === usuario._id);
    
    console.log('Wallets fetched:', userWallets);
    return { success: true, data: userWallets };
    
  } catch (error) {
    console.error('Error fetching wallets:', error);
    Alert.alert('Error', 'Failed to load wallets. Please try again.');
    return { success: false, error, data: [] };
  }
};

export const updateWallet = async (id, updates) => {
  try {
    const response = await apiCall(`wallets/${id}`, 'PUT', updates);
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
    const response = await apiCall(`/wallets/${id}`, 'DELETE');
    Alert.alert('Success', 'Wallet deleted successfully!');
    return { success: true, data: response };
  } catch (error) {
    console.error('Error deleting wallet:', error);
    Alert.alert('Error', 'Failed to delete wallet.');
    return { success: false, error };
  }
};