import React from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const CustomAlert = ({ Title, visible, onYes, onNo }) => {
    const [fadeAnim] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onNo}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{Title}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onNo}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onYes}>
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxWidth: 400,
    },
    title: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        color: '#333',
    },
    message: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 30,
        elevation: 2,
        flex: 1,
        marginHorizontal: 10,
    },
    noButton: {
        backgroundColor: '#E74C3C',
    },
    yesButton: {
        backgroundColor: '#2ECC71',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default CustomAlert;