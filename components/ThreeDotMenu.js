import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'

const ThreeDotMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log('ThreeDotMenu component rendering');
  return (
    
    <View style={styles.container}>
      <Text> ThreeDotMenu</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Entypo name="dots-three-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => alert('Option 1')}>
              <Text style={styles.menuItem}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Option 2')}>
              <Text style={styles.menuItem}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Option 3')}>
              <Text style={styles.menuItem}>Option 3</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    zIndex:10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  menu: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
  },
  menuItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
});

export default ThreeDotMenu;
