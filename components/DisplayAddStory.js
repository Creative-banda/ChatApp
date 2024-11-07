import React from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native';
import BackButton from '@assets/SVG/BackButton';

const DisplayImage = ({ imageUri, setImageUri, Done, inputText, setInputText, IsUploading}) => {
    
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

                <View style={styles.InputContainer}>

                    <TextInput
                    style={{color:'#fff'}}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Add Message ..."
                        placeholderTextColor="#999"
                        multiline={true}
                    /> 

                </View>
            </View>
            {IsUploading && <View style={{position:'absolute',flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)', width:'100%',height:'100%', justifyContent: 'center',}}>
                <ActivityIndicator size='large' color={'#fff'}/>
            </View>}
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
        zIndex:20
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    InputContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        marginHorizontal: 14,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})

export default DisplayImage;
