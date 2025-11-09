import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import { paymentService } from './PaymentService';

// Initialize NFC
export async function initNFC() {
  try {
    await NfcManager.start();
    console.log('NFC initialized');
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize NFC:', error);
    return { success: false, error };
  }
}

// Start listening for NFC tags (BUYER SIDE)
export async function startReadingPayment(navigation) {
  try {
    Alert.alert('NFC Ready', 'Bring your phone close to the seller\'s device');
    
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    
    console.log('Tag detected:', tag);

    if (tag.ndefMessage && tag.ndefMessage.length > 0) {
      const ndefRecord = tag.ndefMessage[0];
      const paymentData = Ndef.text.decodePayload(ndefRecord.payload);
      
      console.log('Payment data received:', paymentData);

      // Procesar el pago
      const result = await paymentService.processNFCPaymentData(paymentData);

      if (result.success) {
        if (result.requiresApproval) {
          // El link ya se abrió, ahora esperar confirmación
          Alert.alert(
            'Approve Payment',
            'Please approve the payment in your browser, then return to the app.',
            [{ text: 'OK' }]
          );

          // Iniciar polling para verificar el estado
          await paymentService.waitForPaymentCompletion(result, navigation);
        } else if (result.completed) {
          // Pago completado sin aprobación
          await paymentService.cartService.clearCart();
          navigation.navigate('CONFIRM_TRANSACTION', {
            success: true,
            paymentData: result.data
          });
        }
      } else {
        Alert.alert('Payment Failed', result.error || 'Could not process payment');
      }
    }

    return { success: true };

  } catch (ex) {
    console.warn('NFC read error', ex);
    Alert.alert('NFC Error', 'Failed to read NFC tag');
    return { success: false, error: ex };
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

// Write payment data to NFC tag (SELLER SIDE)
export async function writePaymentTag() {
  try {
    Alert.alert('NFC Ready', 'Hold your phone steady while the buyer taps their device');

    // Generar datos de pago
    const paymentDataResult = await paymentService.generateNFCPaymentData();
    
    if (!paymentDataResult.success) {
      return { success: false };
    }

    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Encode el mensaje con los datos de pago
    const message = Ndef.encodeMessage([
      Ndef.textRecord(paymentDataResult.data),
    ]);

    await NfcManager.writeNdefMessage(message);
    console.log('Payment data written to NFC tag successfully!');
    
    Alert.alert('Success', 'Payment data shared via NFC. Waiting for buyer confirmation...');
    
    return { success: true };

  } catch (ex) {
    console.warn('NFC write error', ex);
    Alert.alert('NFC Error', 'Failed to write payment data to NFC tag');
    return { success: false, error: ex };
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

// Stop NFC and cleanup
export async function stopNFC() {
  try {
    await NfcManager.cancelTechnologyRequest();
    await NfcManager.stop();
    console.log('NFC stopped');
    return { success: true };
  } catch (e) {
    console.log('Error stopping NFC', e);
    return { success: false, error: e };
  }
}