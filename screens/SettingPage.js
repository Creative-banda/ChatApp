import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Linking } from "react-native";
import { useState } from "react";
import { getAuth, signOut } from 'firebase/auth';
import CustomAlert from '../components/CustomAlert';
import CustomPrompt from '../components/CustomPrompt';
import { auth, firestore, database } from '../config';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, remove } from 'firebase/database';
import BackButton from '../assets/SVG/BackButton';
import SettingsItem from '../components/SettingsItem';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { LinearGradient } from 'expo-linear-gradient';


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


    const handleContactUs = () => {
        const recipient = 'khanahtesham0769@gmail.com';
        Linking.openURL(`mailto:${recipient}`);
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
                        <SettingsItem title="Notification" IconName="notification" onPress={()=>navigation.navigate("Notification")}/>
                        <SettingsItem title="Logout" IconName="logout" onPress={handleLogout} />
                        <SettingsItem title="Delete Account" IconName="delete" onPress={() => setPromptVisible(true)} />

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', marginLeft: 20, marginTop: 20 }}>Feedback</Text>
                        <SettingsItem title="Contact Us" IconName="mail" onPress={handleContactUs} />
                        <SettingsItem title="Rate Us" IconName="staro" onPress={() => { navigation.navigate('RateUs', { uid: uid }) }} />
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity onPress={()=>{Linking.openURL('https://www.instagram.com/ahz_khn_05/')}}>

                            <LinearGradient
                                colors={['#405DE6', '#5B51D8', '#833AB4', "#C13584", "#E1306C", "#FD1D1D", "#F56040", "#777737"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    padding: 4,
                                    borderRadius: 10,
                                }}
                            >
                                <AntDesign name="instagram" color={'#fff'} size={28} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{Linking.openURL('https://github.com/Creative-banda')}}>
                        <AntDesign name="github" color={'#fff'} size={28} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{Linking.openURL('https://www.linkedin.com/in/ahtesham-khan-808260311/')}}>
                        <AntDesign name="linkedin-square" color={'#58A7E3'} size={28} />
                        </TouchableOpacity>

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
    },
    settingContainer: {
        flex: 1,
        backgroundColor: 'rgba(22, 23, 24, 0.5)',
        padding: 20,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    }
});