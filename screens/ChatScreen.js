import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar} from 'react-native';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
        </View>
    );

    const handleSend = () => {
        if (inputText.trim() !== '') {
            setMessages([...messages, inputText]);
            setInputText('');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Message..."
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    chatContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    messageContainer: {
        backgroundColor: '#222',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#111',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        fontSize: 16,
        color: '#fff',
    },
    sendButton: {
        backgroundColor: '#2196f3',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default ChatScreen;