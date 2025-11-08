import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>NOMBRE APP</Text>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>SING UP</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          {/* Aquí puedes agregar tu logo/imagen */}
          <View style={styles.logoPlaceholder} />
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
    paddingTop: 80,
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 40,
  },
  content: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  logoContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D0D0D0',
  },
});

export default MainScreen;