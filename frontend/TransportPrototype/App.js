import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar todas las pantallas
import MainScreen from './src/components/MainScreen';
import SignUpScreen from './src/components/SignUpScreen';
import LoginScreen from './src/components/LoginScreen';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';
import WalletsScreen from './src/components/WalletsScreen';
import WalletInfoScreen from './src/components/WalletInfoScreen';
import InsertWalletScreen from './src/components/InsertWalletScreen';
import PaymentScreen from './src/components/PaymentScreen';
import Payment2Screen from './src/components/Payment2Screen';
import AccountScreen from './src/components/AccountScreen';
import ConfigScreen from './src/components/ConfigScreen';
import TransactionScreen from './src/components/TransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F5F5' }
        }}
      >
        {/* Pantallas de autenticación */}
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ title: 'Recuperar Contraseña' }}
        />

        {/* Pantallas principales */}
        <Stack.Screen 
          name="Wallets" 
          component={WalletsScreen}
          options={{ title: 'Mis Wallets' }}
        />
        <Stack.Screen 
          name="WalletInfo" 
          component={WalletInfoScreen}
          options={{ title: 'Información de Wallet' }}
        />
        <Stack.Screen 
          name="InsertWallet" 
          component={InsertWalletScreen}
          options={{ title: 'Agregar Wallet' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Pago' }}
        />
        <Stack.Screen 
          name="Payment2" 
          component={Payment2Screen}
          options={{ title: 'Modo de Pago' }}
        />
        <Stack.Screen 
          name="Account" 
          component={AccountScreen}
          options={{ title: 'Mi Cuenta' }}
        />
        <Stack.Screen 
          name="Config" 
          component={ConfigScreen}
          options={{ title: 'Configuración' }}
        />
        <Stack.Screen 
          name="Transaction" 
          component={TransactionScreen}
          options={{ title: 'Transacciones' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}