// FingerprintAuth.js

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FingerprintAuth = ({ onAuthenticate }) => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        CheckingPermission()
    }, []);

    const CheckingPermission = async () => {
        const Lock = await AsyncStorage.getItem("Islock")
        value = JSON.parse(Lock)
        if (value == true) {
            authenticateUser();
        }
        else {
            onAuthenticate();
        }
    }

    const authenticateUser = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
            Alert.alert('Biometric Authentication', 'Biometric authentication is not supported on this device.');
            setIsAuthenticating(false);
            return;
        }

        const hasFingerprints = await LocalAuthentication.isEnrolledAsync();
        if (!hasFingerprints) {
            Alert.alert('Biometric Authentication', 'Please set up fingerprint authentication on your device.');
            setIsAuthenticating(false);
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock with Fingerprint',
        });

        if (result.success) {
            onAuthenticate();
            
        }
        setIsAuthenticating(false);
    };

    return (
        <View style={styles.container}>
            {isAuthenticating ? (
                <>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.authText}>Authenticating...</Text>
                </>
            ) : (
                <View style={styles.messageContainer}>
                    <Text style={styles.authText}>Authentication Required</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={authenticateUser}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    authText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
    },
    retryButton: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FingerprintAuth;
