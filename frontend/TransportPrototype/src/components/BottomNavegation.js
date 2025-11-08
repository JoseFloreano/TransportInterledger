import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const BottomNavigation = ({ navigation, activeScreen }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Wallets')}
      >
        <View style={[
          styles.navIconContainer,
          activeScreen === 'Wallets' && styles.activeNavIcon
        ]}>
          <View style={styles.walletIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Payment')}
      >
        <View style={[
          styles.navIconContainer,
          activeScreen === 'Payment' && styles.activeNavIcon
        ]}>
          <View style={styles.bagIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Account')}
      >
        <View style={[
          styles.navIconContainer,
          activeScreen === 'Account' && styles.activeNavIcon
        ]}>
          <View style={styles.userIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#A0A0A0',
    backgroundColor: '#B8B8B8',
  },
  navButton: {
    padding: 10,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavIcon: {
    opacity: 1,
  },
  // Iconos simplificados - puedes reemplazarlos con iconos de una librería
  walletIcon: {
    width: 28,
    height: 22,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
  },
  bagIcon: {
    width: 24,
    height: 28,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
  },
  userIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#E8E8E8',
    borderRadius: 14,
  },
});

export default BottomNavigation;