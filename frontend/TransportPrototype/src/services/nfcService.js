import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Alert, Platform } from 'react-native'; // Importamos Platform para manejar las diferencias entre sistemas operativos
import { paymentService } from './PaymentService';

/**
 * Verifica si el dispositivo soporta y tiene habilitado el NFC.
 */
export async function checkNfcStatus() {
  try {
    const isSupported = await NfcManager.isSupported();
    if (!isSupported) {
      Alert.alert('NFC no soportado', 'Este dispositivo no soporta la tecnología NFC.');
      return { success: false, error: 'NFC_UNSUPPORTED' };
    }

    const isEnabled = await NfcManager.isEnabled();
    if (!isEnabled) {
      Alert.alert(
        'Habilitar NFC',
        'Por favor, habilita el NFC en la configuración de tu teléfono para continuar.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Ir a Configuración',
            onPress: () => {
              // go toNfcSetting solo funciona en Android. En iOS es manual.
              if (Platform.OS === 'android') {
                NfcManager.goToNfcSetting();
              } else {
                Alert.alert('Configuración Manual', 'Por favor, ve a la configuración de iOS para activar el NFC.');
              }
            },
          },
        ]
      );
      return { success: false, error: 'NFC_DISABLED' };
    }
    
    return { success: true };

  } catch (error) {
    console.error('Error checking NFC status:', error);
    return { success: false, error };
  }
}

// Initialize NFC
export async function initNFC() {
  try {
    // 1. Verificar estado antes de iniciar
    const status = await checkNfcStatus();
    if (!status.success) {
        return status;
    }
    
    // 2. Iniciar NFC Manager
    await NfcManager.start();
    console.log('NFC initialized');
    return { success: true };
  } catch (error) {
    console.log('Failed to initialize NFC:', error);
    return { success: false, error };
  }
}

// Start listening for NFC tags (BUYER SIDE)
export async function startReadingPayment(navigation) {
  try {
    // Verificar estado antes de cualquier operación de NFC
    const status = await checkNfcStatus();
    if (!status.success) {
        return status;
    }

    Alert.alert('NFC Listo', 'Acerca tu teléfono al dispositivo del vendedor para leer la información.');
    
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
          Alert.alert(
            'Aprobar Pago',
            'Por favor, aprueba el pago en tu navegador y luego regresa a la aplicación.',
            [{ text: 'OK' }]
          );
          await paymentService.waitForPaymentCompletion(result, navigation);
        } else if (result.completed) {
          await paymentService.cartService.clearCart();
          navigation.navigate('CONFIRM_TRANSACTION', {
            success: true,
            paymentData: result.data
          });
        }
      } else {
        Alert.alert('Pago Fallido', result.error || 'No se pudo procesar el pago');
      }
    }

    return { success: true };

  } catch (ex) {
    console.warn('NFC read error', ex);
    Alert.alert('Error de NFC', 'Fallo al leer la etiqueta NFC o la operación fue cancelada.');
    return { success: false, error: ex };
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

// Write payment data to NFC tag (SELLER SIDE)
export async function writePaymentTag() {
  try {
    // Verificar estado antes de cualquier operación de NFC
    const status = await checkNfcStatus();
    if (!status.success) {
        return status;
    }

    Alert.alert('NFC Listo', 'Mantén tu teléfono estable mientras el comprador acerca su dispositivo.');

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
    
    Alert.alert('Éxito', 'Datos de pago compartidos vía NFC. Esperando confirmación del comprador...');
    
    return { success: true };

  } catch (ex) {
    console.warn('NFC write error', ex);
    Alert.alert('Error de NFC', 'Fallo al escribir los datos de pago en la etiqueta NFC.');
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