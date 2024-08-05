import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Antdesign from 'react-native-vector-icons/FontAwesome'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../config';
import BackButton from '../assets/SVG/BackButton'

const SignupPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [IsPasswordVisible, setIsPasswordVisible] = useState(false);
  const [IsConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [IsLoading, setIsloading] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleSignUp = async () => {
    setIsloading(true);
    if (username.trim() === "" || email.trim() === "" || password.trim() === "" || gender.trim() === "" || phoneNumber.trim() === "" || confirmPassword.trim() === "") {
      Alert.alert('Input Error', 'Please fill all fields');
    }
    else if (password.trim() !== confirmPassword.trim()) {
      Alert.alert("Password Error", "Password and Confirm Password does not match")
    }
    else if (password.trim().length < 6) {
      Alert.alert("Password Error", "Password must contain 6 letter")
    }

    else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);

        await set(ref(database, ('Users/' + user.uid)), {
          id: user.uid,
          username: username,
          email: email,
          ProfilePic: "",
          PhoneNumber: phoneNumber,
          Gender: gender,
          Birthday: "",
          Status: [],
          About: "",
        });

        await set(ref(database, ('chats/' + user.uid)), [
          {
            To: "Dummy",
            from: "Dummy",
            id: "Dummy",
            message: "Dummy",
            messageType: "Dummy",

          }
        ]);

        Alert.alert('Sign Up Success', 'User account created successfully');
        navigation.navigate("Login");
      } catch (error) {
        Alert.alert('Sign Up Error', error.message);
        console.log(error.message);
      }
    }
    setIsloading(false);
  };


  return (
    <ImageBackground source={require('../assets/Images/Registration.jpg')} style={styles.BackgroundImage}>
      <TouchableOpacity style={{position:'absolute',top:40, left:30, zIndex:2}} onPress={()=>{navigation.goBack()}}>
        <BackButton />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#FFF8F2"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF8F2"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#FFF8F2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!IsPasswordVisible}
          />
          <TouchableOpacity style={{ paddingRight: 5 }} onPress={() => { setIsPasswordVisible(!IsPasswordVisible) }}>
            <Antdesign name={!IsPasswordVisible ? 'eye' : 'eye-slash'} size={28} color="#888" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#FFF8F2"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!IsConfirmPasswordVisible}
          />
          <TouchableOpacity style={{ paddingRight: 5 }} onPress={() => { setIsConfirmPasswordVisible(!IsConfirmPasswordVisible) }}>
            <Antdesign name={!IsConfirmPasswordVisible ? 'eye' : 'eye-slash'} size={28} color="#888" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#FFF8F2"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setShowGenderDropdown(!showGenderDropdown)}
        >
          <Antdesign name="male" size={26} color="#888" style={styles.icon} />
          <Text style={styles.dropdownText}>{gender || 'Select Gender'}</Text>
          <Icon name="arrow-drop-down" size={24} color="#FFF8F2" style={styles.icon} />
        </TouchableOpacity>

        {showGenderDropdown && (
          <View style={styles.dropdownOptions}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => {
                  setGender(option);
                  setShowGenderDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>

          {IsLoading ? <ActivityIndicator size="small" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  BackgroundImage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Lato',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    borderColor: '#6E6B68',
    borderWidth: 0.3
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    paddingRight: 10,
    fontFamily: 'Nunito'
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#6E6B68',
    borderWidth: 0.3
  },
  dropdownText: {
    flex: 1,
    color: '#FFF8F2',
    fontFamily: 'Nunito'
  },
  dropdownOptions: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#6E6B68',
    borderWidth: 0.3,
    borderRadius: 8,
    marginTop: -12,
    marginBottom: 16,
  },
  dropdownOption: {
    padding: 8,
  },
  dropdownOptionText: {
    color: '#fff',
    fontFamily: 'Nunito'
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito'
  },
});

export default SignupPage;