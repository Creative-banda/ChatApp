import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo'
import { StyleSheet, View, Modal, Image, Text, TouchableOpacity } from 'react-native';

const ThankYouMessage = ({ visible, handleGoHome, handleClose }) => {
    return (
        <Modal transparent={true} visible={visible} animationType='slide'>
            <View style={styles.holder}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.cross} onPress={handleClose}>
                    <Entypo name='cross' size={34} color='#5DC5DB' />
                    </TouchableOpacity>
                    <Image style={styles.image} source={require('../assets/Images/feedback_Image.png')} />
                    <Text style={styles.text}>Thank you !</Text>
                    <Text style={styles.subText}>By sharing your feedback, you help us improve Chit Chat.</Text>
                    <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                        <Text style={styles.buttonText}>GO BACK HOME</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    holder: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        width: '85%',
        justifyContent : 'center',
        alignItems: 'center'
    },
    image: {
        width: 250,
        height: 250,
        marginTop : 30,
    },
    text: {
        fontSize: 28,
        fontFamily: 'Lato',
        marginBottom: 8,
        marginTop: 15,
    },
    subText : {
        fontSize: 18,
        marginBottom: 10,
        fontFamily : 'Nunito',
        textAlign : 'center',
    },
    button : {
        borderBottomWidth: 2,
        borderColor: '#5DC5DB',
        marginTop : 20
    },
    buttonText: {
        fontSize: 16,
        color: '#5DC5DB',
        fontFamily: 'Lato',
        paddingVertical: 2,
        textAlign: 'center'
    },
    cross : {
        position: 'absolute',
        top: 20,
        left: 20,
    }
});

export default ThankYouMessage;
