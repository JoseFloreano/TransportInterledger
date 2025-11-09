import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';
import { authService } from './AuthService';
import { Usuario } from '../../../../backend/bd/models/Usuario';

export const insertProduct = async (name, price) => {
  if (!name || !price) {
    Alert.alert('Error', 'Please enter both name and price.');
    return { success: false };
  }

  usuario = await authService.getCurrentUser();

  const producto = {
    id_usuario: usuario._id,
    nombre: name,
    precio: parseFloat(price)
  };

  try {
    const response = await apiCall('/producto', 'POST', producto);
    console.log(response);
    
    Alert.alert('Success', 'Product inserted successfully!');
    return { success: true, data: response };
    
  } catch (error) {
    console.error('Error inserting product:', error);
    Alert.alert('Error', 'Failed to insert product. Please try again.');
    return { success: false, error };
  }
};