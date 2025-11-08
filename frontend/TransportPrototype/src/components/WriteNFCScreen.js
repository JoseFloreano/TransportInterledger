import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const WriteNFCScreen = ({ navigation }) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animación de pulso continua
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNFCDetected = () => {
    // Cuando se detecte el NFC, navegar a confirmación
    console.log('NFC detected');
    navigation.navigate('ConfirmTransaction');
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
        <Animated.View 
          style={[
            styles.nfcIndicator,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.nfcIcon}>📱</Text>
        </Animated.View>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Please bring your{'\n'}
            phone closer to{'\n'}
            the device.
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Searching for NFC device...</Text>
        </View>
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
    marginBottom: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  nfcIndicator: {
    width: 150,
    height: 150,
    backgroundColor: '#E8E8E8',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nfcIcon: {
    fontSize: 60,
  },
  messageContainer: {
    marginBottom: 40,
  },
  message: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default WriteNFCScreen;