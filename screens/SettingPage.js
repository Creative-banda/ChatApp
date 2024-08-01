import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { getAuth, signOut } from 'firebase/auth';
import CustomAlert from '../components/CustomAlert';
import BackButton from '../assets/SVG/BackButton';
import SettingsItem from '../components/SettingsItem';
import { useRoute } from '@react-navigation/native';

export default function SettingPage({ navigation }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const route = useRoute();
  const {uid} = route.params;
  console.log(uid);
    const handleLogout = () => {
        setAlertVisible(true);
    };

    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.backgroundImage}>
            <SafeAreaView style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style = {styles.backbutton}>
                        <BackButton/>
                    </TouchableOpacity>
                    <Text style={styles.Header}>Settings</Text>
                    <View style={styles.settingContainer}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', marginLeft: 20,marginTop:20}}>General</Text>
                        <SettingsItem title="Profile" IconName="user" onPress={() => navigation.navigate('Profile', { uid: uid })} />
                        <SettingsItem title="Notification" IconName="notification" />
                        <SettingsItem title="Logout" IconName="logout" onPress={handleLogout} />
                        <SettingsItem title="Delete Account" IconName="delete" />

                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', marginLeft: 20,marginTop:20}}>Feedback</Text>
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