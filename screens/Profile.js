import { View, Text, Image, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import BackButton from '../assets/SVG/BackButton'
import Icon from 'react-native-vector-icons/AntDesign';
import InputBox from '../components/InputBox';

export default function Profile() {
    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.BackgroundImage}>
            <View style={styles.header}>
                <TouchableOpacity style={{ alignSelf: 'flex-start' }}>
                    <BackButton />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Profile</Text>
                <View style={styles.body}>
                    <View style={styles.profileContainer}>
                        <Image source={require('../assets/icon.png')} style={styles.profile} />
                        <TouchableOpacity style={styles.cameraIcon}>
                            <Icon name="camera" size={23} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            <InputBox placeholder={"Username"} Label={"Ahtesham Khan"}/>
            <InputBox placeholder={"Email"} Label={"ahteshamkhan@gmail.com"}/>
            <InputBox placeholder={"Phone Number"} Label={"+923000000000"}/>
            <InputBox placeholder={"Gender"} Label={"Male"}/>
            </View>
        </ImageBackground>
    )
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
})