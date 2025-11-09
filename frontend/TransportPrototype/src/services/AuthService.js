import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './APICall';

export const authService = {
  predefinedAccounts: [
    {
      correo: 'usuario1@ejemplo.com',
      contrasena: 'password123',
      nombre: 'Usuario Uno',
      rol: 'common'
    },
    {
      correo: 'usuario2@ejemplo.com',
      contrasena: 'password456',
      nombre: 'Usuario Dos',
      rol: 'buyer'
    }
  ],

  async login(identifier, password) {
    try {
      console.log('🔐 Iniciando login con:', identifier);
      
      // 1. Buscar primero en cuentas predefinidas
      const localAccount = this.predefinedAccounts.find(
        acc => (acc.correo === identifier || acc.nombre === identifier) && acc.contrasena === password
      );
      
      if (localAccount) {
        console.log('✅ Usuario encontrado en cuentas predefinidas');
        await AsyncStorage.setItem('user', JSON.stringify(localAccount));
        await AsyncStorage.setItem('isAuthenticated', 'true');
        return { success: true, user: localAccount };
      }
      
      console.log('🌐 No está en predefinidas, buscando en BD...');
      
      // 2. Intentar buscar por email (sin propagación de error)
      let response = null;
      try {
        console.log('📧 Buscando por email:', identifier);
        response = await apiCall(`usuario/email/${identifier}`, 'GET');
        console.log('📦 Respuesta de email:', response);
        
        if (response && !response.error && response.contrasena === password) {
          console.log('✅ Usuario encontrado por email y contraseña correcta');
          const dbUser = {
            _id: response._id,
            correo: response.correo,
            nombre: response.nombre,
            rol: response.rol || 'common',
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(dbUser));
          await AsyncStorage.setItem('isAuthenticated', 'true');
          return { success: true, user: dbUser };
        } else if (response && response.contrasena !== password) {
          console.log('❌ Contraseña incorrecta');
          return { success: false, error: 'Credenciales incorrectas' };
        }
      } catch (emailError) {
        console.log('⚠️ No encontrado por email (404 o error), intentando por nombre...');
        // No hacer nada, continuar con la búsqueda por nombre
      }
      
      // 3. Intentar buscar por nombre (sin propagación de error)
      try {
        console.log('👤 Buscando por nombre:', identifier);
        const responseByName = await apiCall(`usuario/nombre/${identifier}`, 'GET');
        console.log('📦 Respuesta de nombre:', responseByName);
        
        if (responseByName && !responseByName.error && responseByName.contrasena === password) {
          console.log('✅ Usuario encontrado por nombre y contraseña correcta');
          const dbUser = {
            _id: responseByName._id,
            correo: responseByName.correo,
            nombre: responseByName.nombre,
            rol: responseByName.rol || 'common',
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(dbUser));
          await AsyncStorage.setItem('isAuthenticated', 'true');
          return { success: true, user: dbUser };
        } else if (responseByName && responseByName.contrasena !== password) {
          console.log('❌ Contraseña incorrecta');
          return { success: false, error: 'Credenciales incorrectas' };
        }
      } catch (nameError) {
        console.log('⚠️ No encontrado por nombre tampoco');
        // Continuar al final
      }
      
      // 4. Si llegamos aquí, el usuario no existe
      console.log('❌ Usuario no encontrado en ninguna búsqueda');
      return { success: false, error: 'Usuario no encontrado' };
      
    } catch (error) {
      console.error('❌ Error general en login:', error);
      console.error('❌ Mensaje:', error.message);
      return { success: false, error: 'Error al consultar la base de datos' };
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
  },

  async getCurrentUserId() {
    const user = await this.getCurrentUser();
    return user ? user._id : null;
  }
};