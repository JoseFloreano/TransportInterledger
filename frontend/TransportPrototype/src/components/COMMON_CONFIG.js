import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COMMON_CONFIG = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>NOMBRE APP</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.photoContainer}>
          <View style={styles.photoCircle}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>username</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>email</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>password</Text>
          <TouchableOpacity><Text style={styles.changeText}>change</Text></TouchableOpacity>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>common</Text>
          <TouchableOpacity><Text style={styles.changeText} >change</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8B8B8', borderRadius: 30, paddingTop: 60 },
  backButton: { position: 'absolute', top: 70, left: 30, zIndex: 10 },
  backButtonText: { fontSize: 24, color: '#2C2C2C' },
  header: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#2C2C2C', marginBottom: 40 },
  content: { paddingHorizontal: 40, alignItems: 'center' },
  photoContainer: { marginBottom: 40 },
  photoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 40 },
  fieldRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8E8E8', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 15 },
  fieldLabel: { fontSize: 15, color: '#2C2C2C' },
  changeText: { fontSize: 15, color: '#2C2C2C', fontWeight: '500' },
});

export default COMMON_CONFIG;