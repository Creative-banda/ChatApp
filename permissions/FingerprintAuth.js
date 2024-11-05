// FingerprintAuth.js

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const FingerprintAuth = ({ onAuthenticate }) => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
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
                onAuthenticate(); // Trigger the callback on successful authentication
            } else {
                Alert.alert('Authentication Failed', 'Please try again.');
            }
            setIsAuthenticating(false);
        };

        authenticateUser();
    }, []);

    return (
        <View style={styles.container}>
            {isAuthenticating ? (
                <>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.authText}>Authenticating...</Text>
                </>
            ) : (
                <Text style={styles.authText}>Authentication Required</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
    },
});

export default FingerprintAuth;
