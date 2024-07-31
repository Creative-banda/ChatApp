import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../config';
import SimpleAlert from '../components/SimpleAlert';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [disable, setdisable] = useState(false);
  const [AlertMessage, SetAlertMessage] = useState("");
  const [AlertTitle, SetAlertTitle] = useState("");
  const [AlertVisible, SetAlertVisible] = useState(false);


  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      SetAlertMessage('Please enter your Login credentials');
      SetAlertTitle('Input Error');
      SetAlertVisible(true);
    } else {
      setLoading(true);
      setdisable(true);
      try {
        console.log("Attempting to login");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(firestore, "Users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Username: ", userData.username);
          navigation.navigate("Home");
        } else {
          console.log("No such document!");
          SetAlertMessage("No user data found")
          SetAlertTitle("Login Error")
          SetAlertVisible(true)
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        SetAlertMessage(error.message)
        SetAlertTitle("Login Error")
        SetAlertVisible(true)
      } finally {
        setLoading(false);
        setdisable(false);
      }
    }
  };


  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.gradient}
    >
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
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#a0a0a0"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#a0a0a0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={disable}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Login</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("SignUp") }}>
          <Text style={styles.forgotPassword}>Click Here If You Are New User</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
        <SimpleAlert
          Title={AlertTitle}
          visible={AlertVisible}
          Message={AlertMessage}
          onClose={() => SetAlertVisible(false)}
        />
    </LinearGradient>
  );

};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#a0a0a0',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginPage;