import React, { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handlePasswordReset = () => {
        const auth = getAuth();
        if (email === '') {
            Alert.alert('Please enter your email');
            return;
        }

        sendPasswordResetEmail(auth, email)
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
        <ImageBackground
            source={require('../assets/Images/Registration.jpg')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
                    style={styles.overlay}
                />
                <Text style={styles.title}>Forgot Password</Text>
                <View style={styles.container}>
                    <Text style={styles.subtitle}>
                        Enter your email address below and we'll send you a link to reset your password.
                    </Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#fff"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>Password Reset Process:</Text>
                    <Text style={styles.footerText}>1. Enter your email address</Text>
                    <Text style={styles.footerText}>2. Receive a verification link in your email</Text>
                    <Text style={styles.footerText}>3. Click the link to open a secure page</Text>
                    <Text style={styles.footerText}>4. Set your new password</Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingTop:'30%',
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: '90%',
        padding: 25,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        alignItems: "center",
        backdropFilter: "blur(10px)",
    },
    title: {
        fontSize: 36,
        fontFamily: 'Lato',
        color: "#fff",
        marginBottom: 15,
        textAlign: "center",
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    subtitle: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
        fontFamily: 'Lato',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 12,
        marginBottom: 25,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    icon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Nunito',
    },
    button: {
        backgroundColor: "#FF6F61",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: 'Lato',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
        width: '100%',
    },
    footerTitle: {
        fontSize: 18,
        fontFamily: 'Lato',
        color: "#fff",
        marginBottom: 10,
        textAlign: "center",
    },
    footerText: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 5,
        fontFamily: 'Nunito',
    },
});

export default ForgotPasswordScreen;