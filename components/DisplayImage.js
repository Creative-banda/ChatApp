import React from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity, Text, Platform, KeyboardAvoidingView } from 'react-native';
import BackButton from '../assets/SVG/BackButton';

const DisplayImage = ({ imageUri, setImageUri, Done }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={imageUri !== null}
            onRequestClose={() => setImageUri(null)}
        >

                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setImageUri(null)}>
                        <BackButton />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.doneButton} onPress={() => { Done() }}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>

                    <Image source={{ uri: imageUri }} style={styles.image} />

                </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
    },
    doneButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
    doneText: {
        color: 'white',
        zIndex: 10,
        fontSize: 20,
        fontWeight: 'bold',
    }

})

export default DisplayImage;
