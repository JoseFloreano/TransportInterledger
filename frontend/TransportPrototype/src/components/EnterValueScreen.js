import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const EnterValueScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handleNumberPress = (num) => {
    setAmount(prev => prev + num);
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleDelete = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (amount && parseFloat(amount) > 0) {
      console.log('Amount:', amount);
      navigation.navigate('PaymentServicePay', { amount });
    }
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
        <View style={styles.displayContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountDisplay}
            value={amount}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={false}
          />
        </View>

        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('1')}
            >
              <Text style={styles.keypadButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('2')}
            >
              <Text style={styles.keypadButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('3')}
            >
              <Text style={styles.keypadButtonText}>3</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('4')}
            >
              <Text style={styles.keypadButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('5')}
            >
              <Text style={styles.keypadButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('6')}
            >
              <Text style={styles.keypadButtonText}>6</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('7')}
            >
              <Text style={styles.keypadButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('8')}
            >
              <Text style={styles.keypadButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('9')}
            >
              <Text style={styles.keypadButtonText}>9</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={handleClear}
            >
              <Text style={styles.keypadButtonTextSmall}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={() => handleNumberPress('0')}
            >
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.keypadButton}
              onPress={handleDelete}
            >
              <Text style={styles.keypadButtonTextSmall}>←</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.confirmButton,
              (!amount || parseFloat(amount) === 0) && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={!amount || parseFloat(amount) === 0}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
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
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginRight: 10,
  },
  amountDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C2C2C',
    flex: 1,
    textAlign: 'left',
  },
  keypad: {
    flex: 1,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  keypadButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  keypadButtonTextSmall: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: '#C0C0C0',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default EnterValueScreen;