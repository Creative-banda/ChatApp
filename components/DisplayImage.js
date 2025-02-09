import React from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import BackButton from '@assets/SVG/BackButton';

const DisplayImage = ({ imageUri, setImageUri, Done, Isloading }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={imageUri !== ''}
            onRequestClose={() => setImageUri('')}
        >


            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => setImageUri('')}>
                    <BackButton />
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneButton} onPress={() => { Done() }}>
                    {Done && <Text style={styles.doneText}>Done</Text>}
                </TouchableOpacity>

                <Image source={{ uri: imageUri }} style={styles.image} />
                {Isloading && <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)',width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
                    <ActivityIndicator size='large' color='#fff'/>
                </View>}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems : 'center',
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
        height: '90%',
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
