import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Antdesign from 'react-native-vector-icons/FontAwesome';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config';
import SimpleAlert from '../components/SimpleAlert';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setAlertMessage('Please enter your Login credentials');
      setAlertTitle('Input Error');
      setAlertVisible(true);
    } else {
      setLoading(true);
      setDisable(true);
      try {
        console.log("Attempting to login");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        navigation.navigate("Home", { uid: user.uid });
      } catch (error) {
        setLoading(false);
        setDisable(false);
        handleAuthError(error);
      }
    }
  };

  const handleAuthError = (error) => {
    let message = "";
    let title = "Login Error";
  
    switch (error.code) {
      case 'auth/invalid-credential':
        message = 'The credential provided is invalid. Please try again.';
        title = 'Invalid Credential';
        break;
      default:
        message = `An unexpected error occurred: ${error.message}`;
        break;
    }
  
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertVisible(true);
  };
    

  return (
    <ImageBackground source={require('../assets/Images/Registration.jpg')} style={styles.BackgroundImage}>
      <View style={styles.gradient}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="email" size={24} color="#a0a0a0" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#a0a0a0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={24} color="#a0a0a0" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Antdesign name={!isPasswordVisible ? 'eye' : 'eye-slash'} size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={disable}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.newUserText}>Click Here If You Are New User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")} style={{paddingVertical:15}}>
            <Text style={styles.newUserText}>ForgetPassword ?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <SimpleAlert
          Title={alertTitle}
          visible={alertVisible}
          Message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
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
  gradient: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Lato',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 16,
    paddingRight: 10,
    fontSize: 16,
    fontFamily: 'Nunito',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newUserText: {
    color: '#a0a0a0',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lato',
  },
});

export default LoginPage;
