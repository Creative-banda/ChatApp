import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handlePasswordReset = () => {
        const auth = getAuth();
        if (email === '') {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
                navigation.goBack();
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        Alert.alert('Invalid Email', 'Please enter a valid email address.');
                        break;
                    case 'auth/user-not-found':
                        Alert.alert('User Not Found', 'No user found with this email address.');
                        break;
                    default:
                        Alert.alert('Error', 'An error occurred. Please try again later.');
                        break;
                }
            });
    };

    return (
        <ImageBackground
            source={require('../assets/Images/Registration.jpg')}
            style={styles.backgroundImage}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <LinearGradient
                        colors={['rgba(18, 18, 18, 0.8)', 'rgba(18, 18, 18, 0.6)']}
                        style={styles.overlay}
                    />
                    <View style={styles.container}>
                        <Text style={styles.title}>Password Reset</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address to receive password reset instructions.
                        </Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#b3b3b3" style={styles.icon} />
                            <TextInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#888"
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {!isKeyboardVisible && (
                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>Password Reset Process:</Text>
                        <Text style={styles.footerText}>1. Enter your registered email address</Text>
                        <Text style={styles.footerText}>2. Check your inbox for the reset link</Text>
                        <Text style={styles.footerText}>3. Follow the link to set a new password</Text>
                        <Text style={styles.footerText}>4. Log in with your new credentials</Text>
                    </View>
                )}
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    keyboardContainer: {
        flex: 1,
    },
    container: {
        width: '90%',
        padding: 30,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "#ffffff",
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#b3b3b3",
        marginBottom: 30,
        textAlign: "center",
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 5,
        padding: 10,
        marginBottom: 25,
        width: '100%',
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#ffffff',
    },
    button: {
        backgroundColor: "#4a90e2",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: "center",
        width: '100%',
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#ffffff",
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: "#b3b3b3",
        marginBottom: 5,
        lineHeight: 20,
    },
});

export default ForgotPasswordScreen;