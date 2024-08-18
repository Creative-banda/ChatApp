import React, { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { getAuth,sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handlePasswordReset = () => {
        const auth = getAuth()
        if (email === '') {
            Alert.alert('Please enter your email');
            return;
        }

        sendPasswordResetEmail(auth,email) 
            .then(() => {
                Alert.alert('Password Reset Email Sent!', 'Please check your email.');
                navigation.goBack();
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        Alert.alert('Invalid Email', 'Please enter a valid email address.');
                        break;
                    case 'auth/user-not-found':
                        Alert.alert('User Not Found', 'There is no user corresponding to this email.');
                        break;
                    default:
                        Alert.alert('Error', error.message);
                        break;
                }
            });
    };

    return (
        <ImageBackground source={require('../assets/Images/Registration.jpg')} style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address below and we'll send you a link to reset your password.
                </Text>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#fff"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    title: {
        fontSize: 32,
        fontFamily: 'Lato',
        color: "#fff",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
        fontFamily: 'Nunito'
    },
    input: {
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        fontFamily: 'Nunito',
        color:'#fff'
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ForgotPasswordScreen;
