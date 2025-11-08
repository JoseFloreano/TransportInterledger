import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Autenticación
import MainScreen from './src/components/MainScreen';
import SignUpScreen from './src/components/SignUpScreen';
import LoginScreen from './src/components/LoginScreen';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';

// Wallets
import WalletsScreen from './src/components/WalletsScreen';
import WalletInfoScreen from './src/components/WalletInfoScreen';
import InsertWalletScreen from './src/components/InsertWalletScreen';

// Pagos
import PaymentScreen from './src/components/PaymentScreen';
import Payment2Screen from './src/components/Payment2Screen';
import PaymentServiceSellScreen from '/src./components/PaymentServiceSellScreen';
import PaymentServicePayScreen from '/src./components/PaymentServicePayScreen';
import PaymentCommonQRScreen from '/src./components/PaymentCommonQRScreen';
import EnterValueScreen from '/src./components/EnterValueScreen';
import ConfirmTransactionScreen from '/src./components/ConfirmTransactionScreen';

// NFC/QR
import WriteNFCScreen from '/src./components/WriteNFCScreen';
import ViewQRScreen from '/src./components/ViewQRScreen';

// Productos
import ProductsScreen from '/src./components/ProductsScreen';
import InsertProductScreen from '/src./components/InsertProductScreen';

// Usuario
import AccountScreen from '/src./components/AccountScreen';
import AccountServiceScreen from '/src./components/AccountServiceScreen';
import ConfigScreen from '/src./components/ConfigScreen';
import TransactionScreen from '/src./components/TransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        {/* Autenticación */}
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* Wallets */}
        <Stack.Screen name="Wallets" component={WalletsScreen} />
        <Stack.Screen name="WalletInfo" component={WalletInfoScreen} />
        <Stack.Screen name="InsertWallet" component={InsertWalletScreen} />
        
        {/* Pagos */}
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Payment2" component={Payment2Screen} />
        <Stack.Screen name="PaymentServiceSell" component={PaymentServiceSellScreen} />
        <Stack.Screen name="PaymentServicePay" component={PaymentServicePayScreen} />
        <Stack.Screen name="PaymentCommonQR" component={PaymentCommonQRScreen} />
        <Stack.Screen name="EnterValue" component={EnterValueScreen} />
        <Stack.Screen name="ConfirmTransaction" component={ConfirmTransactionScreen} />
        
        {/* NFC/QR */}
        <Stack.Screen name="WriteNFC" component={WriteNFCScreen} />
        <Stack.Screen name="ViewQR" component={ViewQRScreen} />
        
        {/* Productos */}
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="InsertProduct" component={InsertProductScreen} />
        
        {/* Usuario */}
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="AccountService" component={AccountServiceScreen} />
        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name="Transaction" component={TransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}