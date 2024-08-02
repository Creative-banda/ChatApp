import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import BackButton from '../assets/SVG/BackButton';
import Icon from 'react-native-vector-icons/AntDesign';
import InputBox from '../components/InputBox';
import * as ImagePicker from 'expo-image-picker';
import { storage, firestore, database } from '../config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DisplayImage from '../components/DisplayImage';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref as databaseRef, update } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc,deleteObject } from 'firebase/firestore';

export default function Profile({ navigation }) {
    const route = useRoute();
    const { uid } = route.params;
    const [userInfo, setuserInfo] = useState(null);
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        fetchUsername();
    }, [uid]);

    const fetchUsername = async () => {
        try {
            const userDoc = doc(firestore, 'Users', uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setuserInfo(docSnap.data());
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error("Error fetching username: ", error);
        }
    };

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri);

            setImageUri(manipulatedImage.uri);
        }
    };

    const UpdatingDatabase = async (url) => {
        try {
            let rolesRef = databaseRef(database, `Users/${userInfo.username.trim()}`);
            await update(rolesRef, { ProfilePic: url });
        } catch (error) {
            console.error("Error updating database: ", error);
        }
    };
    const deleteImage = async (filename) => {
        try {
            const fileRef = ref(storage, filename);
            
            await deleteObject(fileRef);
            
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file: ", error);
        }
    };

    const UpdatingFirestore = async (url) => {
        try {
            const userRef = doc(firestore, 'Users', uid);
            
            await updateDoc(userRef, { ProfilePic: url });
            
            console.log("Firestore updated successfully!");
        } catch (error) {
            console.error("Error updating Firestore: ", error);
        }
    };

    const uploadImage = async () => {
        if (!imageUri) return;

        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            alert('Image uploaded successfully!');
            await UpdatingDatabase(url);
            await UpdatingFirestore(url);
            fetchUsername();
            setImageUri(null);
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    };

    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.BackgroundImage}>
            <View style={styles.header}>
                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                    <BackButton />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Profile</Text>
                <View style={styles.body}>
                    <View style={styles.profileContainer}>
                        <Image source={userInfo?.ProfilePic ? { uri: userInfo.ProfilePic } : require('../assets/icon.png')} style={styles.profile} />
                        <TouchableOpacity style={styles.cameraIcon} onPress={selectImage}>
                            <Icon name="camera" size={23} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
                <InputBox placeholder={"Username"} Label={userInfo?.username || 'Loading...'} />
                <InputBox placeholder={"Email"} Label={userInfo?.email || 'Loading...'} />
                <InputBox placeholder={"Phone Number"} Label={"9876543210"} />
                <InputBox placeholder={"Gender"} Label={"Male"} />
            </View>
            {imageUri && <DisplayImage imageUri={imageUri} setImageUri={setImageUri} Done={uploadImage} />}
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
    }
});
