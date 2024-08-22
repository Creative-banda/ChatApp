import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Linking } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const ThreeDotMenu = ({ UserNumber, ViewProfile }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const makePhoneCall = (phoneNumber) => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          console.log('Phone number is not available');
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.log(err));
  };

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
          activeOpacity={1}
        >
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={ViewProfile}>
              <Text style={styles.menuText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => makePhoneCall(UserNumber)} style={styles.menuItem}>
              <Text style={styles.menuText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Block')} style={styles.menuItem}>
              <Text style={styles.menuText}>Block</Text>
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
