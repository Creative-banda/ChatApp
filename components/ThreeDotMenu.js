import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const ThreeDotMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
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
          activeOpacity={1} // Prevents accidental closing
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => alert('Option 1')} style={styles.menuItem}>
              <Text style={styles.menuText}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Option 2')} style={styles.menuItem}>
              <Text style={styles.menuText}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Option 3')} style={styles.menuItem}>
              <Text style={styles.menuText}>Option 3</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    right: 10,
    top: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalOverlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    right: 10,
    top: 50,
    width: 150,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ThreeDotMenu;
