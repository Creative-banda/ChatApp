import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Platform, ActivityIndicator, ImageBackground } from 'react-native';
import CustomAlert from '../GlobalComponents/Customalert';

const ForgetPassword = ({ navigation }) => {
    const [mail, setMail] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const handleForgetPassword = () => {
        const auth = getAuth()
        if (mail === '') {
            setMessage("Please enter your mail address")
            setVisible(true);
            return;
        }
        setLoading(true);
        sendPasswordResetEmail(auth, mail)
            .then(() => {
                setMail('');
                navigation.navigate('OpenMail')
                setLoading(false);
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setMessage("Invalid email address")
                        break;
                    case 'auth/user-not-found':
                        setMessage('User Not Found')
                        break;
                    default:
                        setMessage("An error occurred")
                        break;
                }
                setVisible(true);
                setLoading(false);
            });
    }

    return (
        <ImageBackground source={require('../assets/Images/Registration.jpg')} style={{flex : 1,
            justifyContent: 'center',
            backgroundColor: '#1e1e1e',}}>

            <View style={styles.container}>
                <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#E0E0E0" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Image source={require('../assets/Images/forgetpasswordImage.png')} style={styles.illustration} />

                <Text style={styles.header}>Forgot Password</Text>
                <Text style={styles.subHeader}>Enter your registered email address below to reset your password.</Text>

                {/* Input Field */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#E0E0E0" />
                    <TextInput
                        placeholder="Email"
                        value={mail}
                        onChangeText={setMail}
                        style={styles.input}
                        placeholderTextColor="#a1a1a1"
                        keyboardType="email-address"
                    />
                </View>

                {/* Helper text */}
                <Text style={styles.helperText}>
                    We will send a password reset link to your registered email address.
                </Text>

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleForgetPassword}>
                    {loading ? <ActivityIndicator size='small' color={'#121212'} /> : <Text style={styles.buttonText}>Reset Password</Text>}
                </TouchableOpacity>

                <CustomAlert visible={visible} message={message} type='error' onClose={() => setVisible(false)} />

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    illustration: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    headerContainer: {
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backText: {
        fontSize: 18,
        fontFamily: 'Lato',
        marginLeft: 10,
        color: '#E0E0E0',
    },
    header: {
        fontSize: 28,
        fontFamily: 'Lato',
        marginBottom: 8,
        color: '#E0E0E0',
    },
    subHeader: {
        fontSize: 16,
        fontFamily: 'Lato',
        color: '#E0E0E0',
        lineHeight: 22,
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255,0.5)',
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Lato',
        marginLeft: 10,
        color: '#E0E0E0',
        placeholderTextColor: '#9E9E9E',
    },
    helperText: {
        fontSize: 14,
        color: '#E0E0E0',
        fontFamily: 'Lato',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#1E90FF', // Accent color
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff', // Dark color for contrast on button
        fontSize: 18,
        fontFamily: 'Lato',
    },
});


export default ForgetPassword;
