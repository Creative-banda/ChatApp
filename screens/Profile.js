import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import BackButton from '../assets/SVG/BackButton';
import Antdesign from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker';
import { storage, database } from '../config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DisplayImage from '../components/DisplayImage';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref as databaseRef, update, get } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import InputBox from '../components/InputBox';

export default function Profile({ navigation }) {
    const route = useRoute();
    const { uid } = route.params;

    const [userInfo, setUserInfo] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [edit, setEdit] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [About, setAbout] = useState('');
    const [Gender, setGender] = useState('');
    const [Isloading, SetLoading] = useState(false);
    const [Dpurl, setDpurl] = useState('');


    useEffect(() => {
        fetchUserData();
    }, [uid]);

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
            const userRef = databaseRef(database, `Users/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setUserInfo(snapshot.val());
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };

    const EditProfile = () => {
        setEdit(true);
    };

    const handleSave = () => {
        if (username && email && PhoneNumber && About) {
            setEdit(false);
            const userRef = databaseRef(database, `Users/${uid}`);
            update(userRef, {
                username,
                email,
                PhoneNumber,
                About,
            });
            fetchUserData();
            console.log("Updated");
        } else {
            alert("Please fill all fields before saving.");
        }
    };

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            const manipulatedImage = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], { compress: 0.5 });
            setImageUri(manipulatedImage.uri);
        }
    };

    const uploadImage = async () => {
        SetLoading(true);
        if (!imageUri) return;

        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            alert('Image uploaded successfully!');
            await updateProfilePic(url);
            fetchUserData();
            setImageUri(null);
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
        finally{
            SetLoading(false);
        }
    };

    const updateProfilePic = async (url) => {
        try {
            const userRef = databaseRef(database, `Users/${uid}`);
            await update(userRef, { ProfilePic: url });
        } catch (error) {
            console.error("Error updating database: ", error);
        }
    };

    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.BackgroundImage}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                            <BackButton />
                        </TouchableOpacity>
                        <Text style={styles.title}>Edit Profile</Text>
                        <View style={styles.body}>
                            <View style={styles.profileContainer}>
                                <TouchableOpacity onPress={()=>{setDpurl(userInfo.ProfilePic)}}>
                                <Image source={userInfo?.ProfilePic ? { uri: userInfo.ProfilePic } : require('../assets/icon.png')} style={styles.profile} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cameraIcon} onPress={selectImage}>
                                    <Antdesign name="camera" size={22} color='white' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <InputBox placeholder={email} editable={false} value={email} onChangeText={setEmail} />
                        <InputBox placeholder={username} editable={edit} value={username} onChangeText={setUsername} />
                        <InputBox placeholder={PhoneNumber} editable={edit} value={PhoneNumber} onChangeText={setPhoneNumber} />
                        <InputBox placeholder={About} editable={edit} value={About} onChangeText={setAbout} />
                        <InputBox placeholder={Gender} editable={false} value={Gender} onChangeText={setGender} />


                        <TouchableOpacity style={styles.EditButton} onPress={edit ? handleSave : EditProfile}>
                            <Text style={styles.EditText}>{edit ? "Save" : "Edit Profile"}</Text>
                        </TouchableOpacity>
                    </View>
                    {imageUri && <DisplayImage imageUri={imageUri} setImageUri={setImageUri} Done={uploadImage} Isloading={Isloading} />}
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
    profileContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
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
