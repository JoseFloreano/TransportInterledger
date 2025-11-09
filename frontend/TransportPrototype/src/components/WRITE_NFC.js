import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WRITE_NFC = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>NOMBRE APP</Text>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Please bring your{'\n'}
            phone closer to{'\n'}
            the device.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 80 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  messageContainer: { alignItems: 'center' },
  message: { fontSize: 22, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 32 },
});

export default WRITE_NFC;