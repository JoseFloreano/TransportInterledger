import { Alert, Linking } from 'react-native';
import { apiCall } from './APICall';
import { getDefaultWallet } from './WalletService';
import { cartService } from './CartService';
import { getProducts } from './ProductsService';

const PAYMENT_API_URL = 'https://096a0eaaea59.ngrok-free.app'; // Cambia según tu configuración

export const paymentService = {
  // Iniciar pago (seller side)
  async startPayment(amount, receivingWalletUrl) {
    try {
      console.log('Iniciando pago...');
      console.log('Monto:', amount);
      console.log('Wallet destino:', receivingWalletUrl);

      const response = await fetch(`${PAYMENT_API_URL}/api/payment/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: amount.toString(),
          receivingWalletUrl: receivingWalletUrl
        })
      });

      const data = await response.json();
      console.log('Respuesta start payment:', data);

      return { success: true, data };

    } catch (error) {
      console.error('Error starting payment:', error);
      return { success: false, error: error.message };
    }
  },

  // Completar pago (buyer side)
  async completePayment(amount, sendingWalletUrl, receivingWalletUrl) {
    try {
      console.log('Completando pago...');
      console.log('Monto:', amount);
      console.log('Wallet origen:', sendingWalletUrl);
      console.log('Wallet destino:', receivingWalletUrl);

      const response = await fetch(`${PAYMENT_API_URL}/api/payment/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: amount.toString(),
          sendingWalletUrl: sendingWalletUrl,
          receivingWalletUrl: receivingWalletUrl
        })
      });

      const startData = await response.json();
      console.log('Respuesta complete payment:', startData);

      // Si fue exitoso sin redirect
      if (startData.success && !startData.requiresRedirect) {
        return { 
          success: true, 
          completed: true,
          data: startData 
        };
      }

      // Si requiere aprobación del usuario
      if (startData.requiresRedirect && startData.redirectUrl) {
        // Abrir el link de aprobación
        const canOpen = await Linking.canOpenURL(startData.redirectUrl);
        if (canOpen) {
          await Linking.openURL(startData.redirectUrl);
        }

        return {
          success: true,
          requiresApproval: true,
          redirectUrl: startData.redirectUrl,
          continueUri: startData.continueUri,
          continueAccessToken: startData.continueAccessToken,
          quoteId: startData.quoteId,
          sendingWalletUrl: startData.sendingWalletUrl
        };
      }

      return { success: false, error: startData.error };

    } catch (error) {
      console.error('Error completing payment:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar estado del pago
  async checkPaymentStatus(continueUri, continueAccessToken, quoteId, sendingWalletUrl) {
    try {
      const response = await fetch(`${PAYMENT_API_URL}/api/payment/check-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          continueUri,
          continueAccessToken,
          quoteId,
          sendingWalletUrl
        })
      });

      const statusData = await response.json();
      console.log('Estado del pago:', statusData);

      return statusData;

    } catch (error) {
      console.error('Error checking payment status:', error);
      return { success: false, error: error.message };
    }
  },

  // Generar datos para NFC (seller side)
  async generateNFCPaymentData() {
    try {
      // Obtener wallet por defecto del seller
      const walletResult = await getDefaultWallet();
      if (!walletResult.success || !walletResult.data) {
        Alert.alert('Error', 'No default wallet found. Please set a default wallet.');
        return { success: false };
      }

      // Calcular total del carrito
      const cart = await cartService.getCart();
      const productsResult = await getProducts();
      
      if (!productsResult.success) {
        Alert.alert('Error', 'Failed to load products.');
        return { success: false };
      }

      let total = 0;
      productsResult.data.forEach(product => {
        const amount = cart[product._id] || 0;
        total += product.precio * amount;
      });

      if (total <= 0) {
        Alert.alert('Error', 'Cart is empty or total is zero.');
        return { success: false };
      }

      // Crear objeto de pago
      const paymentData = {
        amount: total.toFixed(2),
        receivingWalletUrl: walletResult.data.url,
        timestamp: new Date().toISOString()
      };

      console.log('Datos de pago NFC generados:', paymentData);

      return { 
        success: true, 
        data: JSON.stringify(paymentData) 
      };

    } catch (error) {
      console.error('Error generating NFC payment data:', error);
      Alert.alert('Error', 'Failed to generate payment data.');
      return { success: false, error };
    }
  },

  // Procesar datos recibidos por NFC (buyer side)
  async processNFCPaymentData(nfcData) {
    try {
      console.log('Procesando datos NFC:', nfcData);

      // Parse los datos del NFC
      const paymentData = JSON.parse(nfcData);
      const { amount, receivingWalletUrl } = paymentData;

      // Obtener wallet por defecto del buyer
      const walletResult = await getDefaultWallet();
      if (!walletResult.success || !walletResult.data) {
        Alert.alert('Error', 'No default wallet found. Please set a default wallet first.');
        return { success: false };
      }

      const sendingWalletUrl = walletResult.data.url;

      // Completar el pago
      const paymentResult = await this.completePayment(
        amount,
        sendingWalletUrl,
        receivingWalletUrl
      );

      return paymentResult;

    } catch (error) {
      console.error('Error processing NFC payment:', error);
      Alert.alert('Error', 'Failed to process payment data.');
      return { success: false, error: error.message };
    }
  },

  // Polling del estado del pago
  async waitForPaymentCompletion(paymentInfo, navigation, maxAttempts = 40) {
    const { continueUri, continueAccessToken, quoteId, sendingWalletUrl } = paymentInfo;
    
    let attemptCount = 0;
    
    // Esperar 3 segundos antes del primer intento
    await new Promise(resolve => setTimeout(resolve, 3000));

    const checkStatus = async () => {
      if (attemptCount >= maxAttempts) {
        Alert.alert('Timeout', 'Payment was not completed in time.');
        return false;
      }

      attemptCount++;
      console.log(`Verificando pago... Intento ${attemptCount}/${maxAttempts}`);

      const statusData = await this.checkPaymentStatus(
        continueUri,
        continueAccessToken,
        quoteId,
        sendingWalletUrl
      );

      // Pago completado exitosamente
      if (statusData.success && statusData.completed) {
        console.log('Pago completado exitosamente');
        
        // Limpiar carrito
        await cartService.clearCart();
        
        // Navegar a confirmación
        navigation.navigate('CONFIRM_TRANSACTION', {
          success: true,
          paymentData: statusData
        });
        
        return true;
      }

      // Pago pendiente, seguir esperando
      if (statusData.pending) {
        console.log('Pago pendiente, reintentando en 3 segundos...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return checkStatus();
      }

      // Error en el pago
      if (!statusData.success) {
        console.log('Error en el pago:', statusData.error);
        Alert.alert('Payment Failed', statusData.error || 'Payment could not be completed.');
        return false;
      }

      return false;
    };

    return checkStatus();
  }
};