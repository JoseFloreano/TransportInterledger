// UserService.js
import { apiCall } from './APICall';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userService = {
  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const response = await apiCall(`usuario/${userId}`, 'GET');
      return { success: true, user: response };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return { success: false, error: 'Error al obtener usuario' };
    }
  },

  // Actualizar usuario
  async updateUser(userId, updatedData) {
    try {
      const response = await apiCall(`usuario/${userId}`, 'PUT', updatedData);
      
      // Si es el usuario actual, actualizar AsyncStorage
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.id === userId) {
          await AsyncStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
        }
      }
      
      return { success: true, user: response };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, error: 'Error al actualizar usuario' };
    }
  },

  // Eliminar usuario
  async deleteUser(userId) {
    try {
      await apiCall(`usuario/${userId}`, 'DELETE');
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { success: false, error: 'Error al eliminar usuario' };
    }
  }
};