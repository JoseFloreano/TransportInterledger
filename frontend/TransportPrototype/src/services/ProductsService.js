import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';
import { authService } from './AuthService';

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
    const response = await apiCall('producto', 'POST', producto);
    console.log(response);
    
    Alert.alert('Success', 'Product inserted successfully!');
    return { success: true, data: response };
    
  } catch (error) {
    console.error('Error inserting product:', error);
    Alert.alert('Error', 'Failed to insert product. Please try again.');
    return { success: false, error };
  }
};

export const getProducts = async () => {
  try {
    const response = await apiCall('/producto', 'GET');
    console.log('Products fetched:', response);
    return { success: true, data: response };
    
  } catch (error) {
    console.error('Error fetching products:', error);
    Alert.alert('Error', 'Failed to load products. Please try again.');
    return { success: false, error, data: [] };
  }
};