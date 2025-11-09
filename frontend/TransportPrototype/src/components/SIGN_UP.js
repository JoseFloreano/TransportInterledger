import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { sign_service } from '../services/SIGN_UP_SERVICE';

const SIGN_UP = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleSignUp = async () => {
    console.log('Sign up');
    if((!username || !email || !password) && (password === confirmPassword)){
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña y deben coincidir');
            return;
    }
    
      setLoading(true);
        
        try {
          const result = await sign_service.sign_up(username,email,password);
          
          if (result.success) {
            Alert.alert('Éxito', `Registrado ${result.user.nombre}`);
    
            // Navegar a la pantalla principal
            navigation.replace('WALLETS');
            console.log("SIGN UP")
          } else {
            Alert.alert('Error', result.error);
          }
        } catch (error) {
          Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
        } finally {
          setLoading(false);
        }
  };

  const handleSelectPhoto = () => {
    console.log('Select photo');
  };


  // import mongoose from "mongoose";
  
  // // Schema de Usuario
  // const usuarioSchema = new mongoose.Schema({
  //   nombre: {
  //     type: String,
  //     required: true
  //   },
  //   correo: {
  //     type: String,
  //     required: true,
  //     unique: true
  //   },
  //   contrasena: {
  //     type: String,
  //     required: true
  //   },
  //   rol: {
  //     type: String,
  //     required: true
  //   }
  // }, {
  //   timestamps: true
  // });
  
  
  
  
  // // Exportar modelos
  // export const Usuario = mongoose.model('Usuario', usuarioSchema);
  

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
        <TouchableOpacity 
          style={styles.photoContainer}
          onPress={handleSelectPhoto}
        >
          <View style={styles.photoCircle}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="confirm password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
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
    marginBottom: 40,
  },
  content: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  photoContainer: {
    marginBottom: 30,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D8D8D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    fontSize: 15,
    color: '#2C2C2C',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
});

export default SIGN_UP;