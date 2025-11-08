import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ConfirmTransactionScreen = ({ navigation }) => {
  useEffect(() => {
    // Auto-navegar después de 3 segundos (opcional)
    const timer = setTimeout(() => {
      // navigation.navigate('Wallets');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    navigation.navigate('Wallets');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>NOMBRE APP</Text>

      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.message}>
            The transaction{'\n'}
            has been{'\n'}
            successful!
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleGoBack}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8B8B8',
    borderRadius: 30,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 30,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2C2C2C',
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  checkmark: {
    fontSize: 80,
    color: '#4CAF50',
    marginBottom: 30,
  },
  message: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 36,
  },
  continueButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
});

export default ConfirmTransactionScreen;