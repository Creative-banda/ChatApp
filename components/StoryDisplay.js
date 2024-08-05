import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function StoryDisplay({ image, modalVisible, onClose, Name,Message }) {
    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    onClose()
                }}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.nameText}>{Name}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: image }} style={styles.storyImage} />
                    </View>
                    <View>
                    </View>
                    <Text style={{color:'#fff', fontSize:15}}>{Message}</Text>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    nameText: {
        position: 'absolute',
        top: 30,
        left: 30,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    storyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        zIndex:10,
        top: 50,
        right: 35,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
