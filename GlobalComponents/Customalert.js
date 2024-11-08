import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomAlert = ({ visible, message, type = 'success', onClose }) => {
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    let closeTimeout;
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      closeTimeout = setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ translateY: slideAnim }] },
      type === 'error' ? styles.errorContainer : styles.successContainer
    ]}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={type === 'error' ? 'error' : 'check-circle'}
            size={24}
            color="#fff"
          />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {position: 'absolute',bottom: 20,left: 20,right: 20,backgroundColor: '#6200EE',borderRadius: 12,flexDirection: 'row',alignItems: 'center',paddingVertical: 12,paddingHorizontal: 16,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5,},

  contentContainer: { flex: 1, flexDirection: 'row', alignItems: 'center',},

  successContainer: {backgroundColor: '#4CAF50',},

  errorContainer: { backgroundColor: '#F44336'},

  iconContainer: {marginRight: 12,},

  message: { flex: 1, color: '#fff', fontFamily: 'Outfit', fontSize: 16, },
  
});

export default CustomAlert;