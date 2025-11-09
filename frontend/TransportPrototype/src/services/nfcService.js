import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialize NFC
export async function initNFC() {
  try {
    await NfcManager.start();
    console.log('NFC initialized');
  } catch (error) {
    console.error('Failed to initialize NFC:', error);
  }
}

// Start listening for NFC tags
export async function startReading(onTagDiscovered) {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    if (onTagDiscovered) onTagDiscovered(tag);
  } catch (ex) {
    console.warn('NFC read error', ex);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

// Write data to an NFC tag
export async function writeTag(data) {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Encode the message (you can change to text, URI, or custom record)
    const message = Ndef.encodeMessage([
      Ndef.textRecord(data),
    ]);

    await NfcManager.writeNdefMessage(message);
    console.log('Tag written successfully!');
  } catch (ex) {
    console.warn('NFC write error', ex);
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
  } catch (e) {
    console.log('Error stopping NFC', e);
  }
}
