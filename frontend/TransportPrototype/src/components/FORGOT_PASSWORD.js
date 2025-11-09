import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const FORGOT_PASSWORD = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    console.log('Send code');
  };

  const handleConfirm = () => {
    console.log('Confirm');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>NOMBRE APP</Text>

      <View style={styles.content}>
        <View style={styles.emailRow}>
          <TextInput
            style={styles.emailInput}
            placeholder="email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendCode}
          >
            <Text style={styles.sendButtonText}>send</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="code"
          placeholderTextColor="#666"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
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
    paddingHorizontal: 40,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 15,
    color: '#2C2C2C',
    marginRight: 10,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sendButtonText: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 40,
    fontSize: 15,
    color: '#2C2C2C',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
});

export default FORGOT_PASSWORD;