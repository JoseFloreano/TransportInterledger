import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar TODOS los 23 componentes
import MAIN from './src/components/MAIN';
import SIGN_UP from './src/components/SIGN_UP';
import LOG_IN from './src/components/LOG_IN';
import FORGOT_PASSWORD from './src/components/FORGOT_PASSWORD';
import WALLETS from './src/components/WALLETS';
import COMMON_PAY_NFC from './src/components/COMMON_PAY_NFC';
import COMMON_PAY_QR from './src/components/COMMON_PAY_QR';
import COMMON_ACCOUNT from './src/components/COMMON_ACCOUNT';
import INSERT_WALET from './src/components/INSERT_WALET';
import SERVICE_SELL_NFC from './src/components/SERVICE_SELL_NFC';
import SERVICE_PAY_NFC from './src/components/SERVICE_PAY_NFC';
import SERVICE_QR_BUY from './src/components/SERVICE_QR_BUY';
import COMMON_CONFIG from './src/components/COMMON_CONFIG';
import TRANSACTION from './src/components/TRANSACTION';
import SERVICE_ACCOUNT from './src/components/SERVICE_ACCOUNT';
import PRODUCTS from './src/components/PRODUCTS';
import SERVICE_QR_PAY from './src/components/SERVICE_QR_PAY';
import SHOPPINGCART_PRODUCTS from './src/components/SHOPPINGCART_PRODUCTS';
import CONFIRM_TRANSACTION from './src/components/CONFIRM_TRANSACTION';
import WRITE_NFC from './src/components/WRITE_NFC';
import INFO_WALET from './src/components/INFO_WALET';
import VIEW_QR from './src/components/VIEW_QR';
import INSERT_PRODUCTS from './src/components/INSERT_PRODUCTS';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="MAIN"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MAIN" component={MAIN} />
        <Stack.Screen name="SIGN_UP" component={SIGN_UP} />
        <Stack.Screen name="LOG_IN" component={LOG_IN} />
        <Stack.Screen name="FORGOT_PASSWORD" component={FORGOT_PASSWORD} />
        <Stack.Screen name="WALLETS" component={WALLETS} />
        <Stack.Screen name="INSERT_WALET" component={INSERT_WALET} />
        <Stack.Screen name="INFO_WALET" component={INFO_WALET} />
        <Stack.Screen name="COMMON_PAY_NFC" component={COMMON_PAY_NFC} />
        <Stack.Screen name="COMMON_PAY_QR" component={COMMON_PAY_QR} />
        <Stack.Screen name="SERVICE_SELL_NFC" component={SERVICE_SELL_NFC} />
        <Stack.Screen name="SERVICE_PAY_NFC" component={SERVICE_PAY_NFC} />
        <Stack.Screen name="SERVICE_QR_BUY" component={SERVICE_QR_BUY} />
        <Stack.Screen name="SERVICE_QR_PAY" component={SERVICE_QR_PAY} />
        <Stack.Screen name="PRODUCTS" component={PRODUCTS} />
        <Stack.Screen name="INSERT_PRODUCTS" component={INSERT_PRODUCTS} />
        <Stack.Screen name="SHOPPINGCART_PRODUCTS" component={SHOPPINGCART_PRODUCTS} />
        <Stack.Screen name="WRITE_NFC" component={WRITE_NFC} />
        <Stack.Screen name="VIEW_QR" component={VIEW_QR} />
        <Stack.Screen name="TRANSACTION" component={TRANSACTION} />
        <Stack.Screen name="CONFIRM_TRANSACTION" component={CONFIRM_TRANSACTION} />
        <Stack.Screen name="COMMON_ACCOUNT" component={COMMON_ACCOUNT} />
        <Stack.Screen name="SERVICE_ACCOUNT" component={SERVICE_ACCOUNT} />
        <Stack.Screen name="COMMON_CONFIG" component={COMMON_CONFIG} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}