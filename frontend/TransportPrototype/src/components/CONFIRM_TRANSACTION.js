import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CONFIRM_TRANSACTION = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Tap&Pay</Text>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.message}>
            The transaction{'\n'}
            has been{'\n'}
            successful!
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
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 60 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  messageContainer: { alignItems: 'center' },
  checkmark: { fontSize: 80, color: '#4CAF50', marginBottom: 30 },
  message: { fontSize: 24, fontWeight: '500', color: '#2C2C2C', textAlign: 'center', lineHeight: 36 },
});

export default CONFIRM_TRANSACTION;