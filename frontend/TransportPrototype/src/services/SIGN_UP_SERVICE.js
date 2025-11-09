// AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';

export const sign_service = {

  // Registro de usuario real
  async sign_up(username, email, password) {
    try {
      const response = await apiCall('usuario', 'POST', {
        nombre: username,
        correo: email,
        contrasena: password,
        rol: 'common',
      });

      if (response.error) {
        return { success: false, error: response.error };
      }

      // Guardar sesión localmente
      const newUser = {
        correo: response.correo,
        nombre: response.nombre,
        rol: response.rol,
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('isAuthenticated', 'true');

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error al registrar:', error);
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  },

  async logout() {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isAuthenticated');
  },

  async isAuthenticated() {
    const isAuth = await AsyncStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  },

  async getCurrentUser() {
    const user = await AsyncStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
};
