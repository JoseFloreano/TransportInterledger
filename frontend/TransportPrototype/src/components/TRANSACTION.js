import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const TRANSACTION = ({ navigation }) => {
  const transactions = [
    { id: 1, origin: 'MyWalet', destiny: 'subway', value: '$$$' },
    { id: 2, origin: 'client', destiny: 'MyWalet', value: '$$$' },
    { id: 3, origin: 'MyWalet', destiny: 'bus', value: '$$$' },
    { id: 4, origin: 'MyWalet', destiny: 'Other', value: '$$$' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>NOMBRE APP</Text>
      <View style={styles.content}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>origin</Text>
            <Text style={styles.headerText}>destiny</Text>
            <Text style={styles.headerText}>value</Text>
          </View>
          <ScrollView style={styles.tableBody}>
            {transactions.map((t) => (
              <View key={t.id} style={styles.transactionRow}>
                <Text style={styles.transactionText}>{t.origin}</Text>
                <Text style={styles.transactionText}>{t.destiny}</Text>
                <Text style={styles.transactionText}>{t.value}</Text>
              </View>
            ))}
          </ScrollView>
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
  content: { flex: 1, paddingHorizontal: 30 },
  tableContainer: { backgroundColor: '#E8E8E8', borderRadius: 20, padding: 20, maxHeight: 400 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#B8B8B8' },
  headerText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2C2C2C', textAlign: 'center' },
  tableBody: { marginTop: 10 },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#D0D0D0' },
  transactionText: { flex: 1, fontSize: 13, color: '#2C2C2C', textAlign: 'center' },
});

export default TRANSACTION;