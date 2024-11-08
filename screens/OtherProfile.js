import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { database } from '@config';
import { ref as databaseRef, get } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import InputBox from '@components/InputBox';
import DisplayImage from '@components/DisplayImage';
import handleNotification from '@functions/Send_Notification';

export default function Profile({ navigation }) {
    const route = useRoute();
    const { userUid, IsNotification } = route.params;
    const [userInfo, setUserInfo] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [About, setAbout] = useState('');
    const [Gender, setGender] = useState('');
    const [Dpurl, setDpurl] = useState('');
    console.log(userUid);
    

    useEffect(() => {
        fetchUserData();
    }, [userUid]);

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username || '');
            setEmail(userInfo.email || '');
            setPhoneNumber(userInfo.PhoneNumber || '');
            setAbout(userInfo.About || '');
            setGender(userInfo.Gender || '');
        }
    }, [userInfo]);

    const fetchUserData = async () => {
        try {
            const userRef = databaseRef(database, `Users/${userUid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setUserInfo(snapshot.val());
                if (!IsNotification){
                    handleNotification("SomeOne visited your profile",snapshot.val().token, userUid, "profile_viewed");
                }
                
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };



    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.BackgroundImage}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>

                        <Text style={styles.title}>{username} Profile</Text>
                        <View style={styles.body}>
                            <TouchableOpacity onPress={()=>{setDpurl(userInfo.ProfilePic)}}>
                            <Image source={userInfo?.ProfilePic ? { uri: userInfo.ProfilePic } : require('../assets/icon.png')} style={styles.profile} />
                            </TouchableOpacity>

                        </View>
                        <InputBox placeholder={email} editable={false} value={email} onChangeText={setEmail} />
                        <InputBox placeholder={username} editable={false} value={username} onChangeText={setUsername} />
                        <InputBox placeholder={PhoneNumber} editable={false} value={PhoneNumber} onChangeText={setPhoneNumber} />
                        <InputBox placeholder={About} editable={false} value={About} onChangeText={setAbout} />
                        <InputBox placeholder={Gender} editable={false} value={Gender} onChangeText={setGender} />


                        <TouchableOpacity style={styles.EditButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.EditText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {Dpurl && userInfo?.ProfilePic && <DisplayImage imageUri={Dpurl} setImageUri={setDpurl} />}
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    BackgroundImage: {
        flex: 1,
    },
    header: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        gap: 10,
    },
    title: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'Lato',
        marginVertical: 40,
        marginLeft: 20,
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    profile: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 5,
        width: 35,
        height: 35,
        backgroundColor: "#52B35E",
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    EditButton: {
        backgroundColor: '#52B35E',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
    },
    EditText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Lato',
    },
    icon: {
        marginHorizontal: 10,
    },
    dropdownOptions: {
        borderRadius: 5,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)'
    }
});
