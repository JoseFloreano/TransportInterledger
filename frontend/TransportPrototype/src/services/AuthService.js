import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  predefinedAccounts: [
    {
      email: 'usuario1@ejemplo.com',
      password: 'password123',
      name: 'Usuario Uno',
    },
    {
      email: 'usuario2@ejemplo.com',
      password: 'password456',
      name: 'Usuario Dos',
    }
  ],

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const account = this.predefinedAccounts.find(
      acc => acc.email === email && acc.password === password
    );
    
    if (account) {
      await AsyncStorage.setItem('user', JSON.stringify(account));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      return { success: true, user: account };
    } else {
      return { success: false, error: 'Credenciales incorrectas' };
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