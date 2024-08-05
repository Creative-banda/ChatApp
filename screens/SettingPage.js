import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { getAuth, signOut } from 'firebase/auth';
import CustomAlert from '../components/CustomAlert';
import CustomPrompt from '../components/CustomPrompt'; // Import the custom prompt
import { auth, firestore, database } from '../config';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, remove } from 'firebase/database';
import BackButton from '../assets/SVG/BackButton';
import SettingsItem from '../components/SettingsItem';
import { useRoute } from '@react-navigation/native';

export default function SettingPage({ navigation }) {
    const [alertVisible, setAlertVisible] = useState(false);
    const [promptVisible, setPromptVisible] = useState(false);
    const route = useRoute();
    const { uid } = route.params;

    const handleLogout = () => {
        setAlertVisible(true);
    };

    const deleteAccount = async (password) => {
        const user = auth.currentUser;
        console.log("Deleting");

        if (!user) {
            Alert.alert('Error', 'No user is currently signed in.');
            return;
        }

        try {
            const email = auth.currentUser.email;
            const credential = EmailAuthProvider.credential(email, password);
            console.log('Re-authenticating user...');
            await reauthenticateWithCredential(user, credential);

            console.log('Deleting user data from Firestore...');
            await deleteDoc(doc(firestore, "Users", user.uid));

            console.log('Deleting user data from Realtime Database...');
            await remove(ref(database, 'Users/' + user.displayName));
            await remove(ref(database, 'chats/' + user.displayName));

            console.log('Deleting user account...');
            await deleteUser(user);

            console.log('Account deleted successfully.');
            Alert.alert('Success', 'Your account has been deleted.');
            navigation.navigate("Login");
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Error', 'Failed to delete account. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.backgroundImage}>
            <SafeAreaView style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbutton}>
                        <BackButton />
                    </TouchableOpacity>
                    <Text style={styles.Header}>Settings</Text>
                    <View style={styles.settingContainer}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', marginLeft: 20, marginTop: 20 }}>General</Text>
                        <SettingsItem title="Profile" IconName="user" onPress={() => navigation.navigate('Profile', { uid: uid })} />
                        <SettingsItem title="Notification" IconName="notification" />
                        <SettingsItem title="Logout" IconName="logout" onPress={handleLogout} />
                        <SettingsItem title="Delete Account" IconName="delete" onPress={() => setPromptVisible(true)}/>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', marginLeft: 20, marginTop: 20 }}>Feedback</Text>
                        <SettingsItem title="Contact Us" IconName="mail" />
                        <SettingsItem title="Rate Us" IconName="staro" />
                    </View>
                </View>
            </SafeAreaView>
            <CustomAlert
                Title="Do you really want to logout?"
                visible={alertVisible}
                onRequestClose={() => setAlertVisible(false)}
                onYes={() => {
                    const auth = getAuth();
                    signOut(auth)
                        .then(() => {
                            setAlertVisible(false);
                            navigation.navigate('Login');
                        })
                }}
                onNo={() => setAlertVisible(false)}
            />
            <CustomPrompt
                visible={promptVisible}
                title="Re-authenticate"
                message="Please enter your password to continue"
                onCancel={() => setPromptVisible(false)}
                onSubmit={(password) => {
                    setPromptVisible(false);
                    deleteAccount(password);
                }}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        flex: 1,
    },
    Header: {
        fontSize: 32,
        fontFamily: 'Lato',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: '20%',
        marginLeft: '10%',
        marginBottom: '10%',
    },
    backbutton: {
        position: 'absolute',
        top: 30,
        left: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 30,
        marginLeft: 30,
        marginBottom: 20,
    },
    settingContainer: {
        flex: 1,
        backgroundColor: 'rgba(22, 23, 24, 0.5)',
        padding: 20,
    },
});