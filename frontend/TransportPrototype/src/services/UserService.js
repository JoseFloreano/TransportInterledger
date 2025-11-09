// UserService.js
import { apiCall } from './APICall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const userService = {
  // Obtener usuario actual desde AsyncStorage
  async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const response = await apiCall(`/usuario/${userId}`, 'GET');
      return { success: true, user: response };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return { success: false, error: 'Error al obtener usuario' };
    }
  },

  // Actualizar usuario
  async updateUser(userId, updatedData) {
    try {
      const response = await apiCall(`/usuario/${userId}`, 'PUT', updatedData);
      
      // Si es el usuario actual, actualizar AsyncStorage
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user._id === userId) {
          await AsyncStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
        }
      }
      
      return { success: true, user: response };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, error: 'Error al actualizar usuario' };
    }
  },

  // Actualizar solo el rol del usuario (función específica)
  async updateUserRole(userId, newRole) {
    try {
      const response = await apiCall(`/usuario/${userId}`, 'PUT', { rol: newRole });
      console.log('Role updated:', response);
      
      // Actualizar el usuario en AsyncStorage
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        user.rol = newRole;
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      Alert.alert('Success', `Your role has been changed to ${newRole}`);
      return { success: true, data: response };
      
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role. Please try again.');
      return { success: false, error };
    }
  },

  // Eliminar usuario
  async deleteUser(userId) {
    try {
      await apiCall(`/usuario/${userId}`, 'DELETE');
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { success: false, error: 'Error al eliminar usuario' };
    }
  }
};