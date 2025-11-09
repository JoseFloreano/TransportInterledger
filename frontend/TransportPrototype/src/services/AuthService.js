import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';

export const authService = {
  predefinedAccounts: [
    {
      correo: 'usuario1@ejemplo.com',
      contrasena: 'password123',
      name: 'Usuario Uno',
      rol: 'common'
    },
    {
      correo: 'usuario2@ejemplo.com',
      contrasena: 'password456',
      name: 'Usuario Dos',
      rol: 'buyer'
    }
  ],

  async login(identifier, contrasena) {
    try {
      // 1. Buscar primero en cuentas predefinidas
      const localAccount = this.predefinedAccounts.find(
        acc => (acc.correo === identifier || acc.nombre === identifier) && acc.contrasena === contrasena
      );
      
      if (localAccount) {
        await AsyncStorage.setItem('user', JSON.stringify(localAccount));
        await AsyncStorage.setItem('isAuthenticated', 'true');
        return { success: true, user: localAccount };
      }
      
      // 2. Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. Intentar buscar por email
      const response = await apiCall(`usuario/email/${identifier}`, 'GET');
      
      // Verificar si hay error en la respuesta
      if (response && response.error) {
        return { success: false, error: response.error };
      }
      
      if (response && response.contrasena === contrasena) {
        const dbUser = {
          correo: response.correo,
          nombre: response.nombre,
          rol: response.rol || 'common',
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(dbUser));
        await AsyncStorage.setItem('isAuthenticated', 'true');
        return { success: true, user: dbUser };
      }
      
      // 4. Si no es email, intentar buscar por nombre
      const responseByName = await apiCall(`usuario/nombre/${identifier}`, 'GET');
      
      // Verificar si hay error en la respuesta
      if (responseByName && responseByName.error) {
        return { success: false, error: responseByName.error };
      }
      
      if (responseByName && responseByName.contrasena === contrasena) {
        const dbUser = {
          correo: responseByName.correo,  // ✅ Corregido
          nombre: responseByName.nombre,   // ✅ Corregido
          rol: responseByName.rol || 'common', // ✅ Corregido
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(dbUser));
        await AsyncStorage.setItem('isAuthenticated', 'true');
        return { success: true, user: dbUser };
      }
      
      return { success: false, error: 'Credenciales incorrectas' };
      
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
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
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};