import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../config'

const VerifyEmailModal = ({ visible, onRequestClose, username, email, phoneNumber, gender, otp, password, navigation }) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [enteredOtp, setEnteredOtp] = useState('');
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const [Loading, SetLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  }, [visible]);

  const handleVerify = async () => {
    try {
      if (enteredOtp !== otp) {
        Alert.alert('Verification Error', 'Incorrect OTP. Please try again.');
        return;
      }
      SetLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);

      await set(ref(database, 'Users/' + user.uid), {
        id: user.uid,
        username: username,
        email: email,
        ProfilePic: "",
        PhoneNumber: phoneNumber,
        Gender: gender,
        Birthday: "",
        Status: {time : '', url : ''},
        About: "Hey I am Using ChitChat",
      });

      await set(ref(database, 'chats/' + user.uid), [
        {
          To: "Dummy",
          from: "Dummy",
          id: "Dummy",
          message: "Dummy",
          messageType: "Dummy",
        }
      ]);
      
      navigation.navigate('Login')
      Alert.alert('Sign Up Success', 'User account created successfully');
      onRequestClose();
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
      console.log(error.message);
    }
    finally {
      SetLoading(false);
    }
  };

  const handleRequestClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onRequestClose();
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleRequestClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Verify Your OTP</Text>
          <Text style={styles.message}>
            Please enter the OTP sent to your email address to complete the registration process.
          </Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            keyboardType="numeric"
            placeholderTextColor={"rgba(255,255,255,0.5)"}
            value={enteredOtp}
            onChangeText={setEnteredOtp}
          />
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>

            {Loading ? <ActivityIndicator size='small' /> : <Text style={styles.verifyButtonText}>Verify OTP</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={handleRequestClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 50,
    maxHeight: '50%',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato'
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Nunito'
  },
  otpInput: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#FFFFFF',
    fontFamily: 'Nunito'
  },
  verifyButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Lato'
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 7,
    borderRadius: 10,
    fontFamily: 'Lato'
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Lato'
  },
});

export default VerifyEmailModal;
