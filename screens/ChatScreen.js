import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { database } from '../config';
import { ref, push, set, onValue } from 'firebase/database';
import Back from '../assets/SVG/BackButton';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const route = useRoute();
    const { chatId, name } = route.params;

    useEffect(() => {
        const chatsRef = ref(database, `chats/${name.username.trim()}`);
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            if (snapshot.exists()) {
                const chatsData = snapshot.val();
                let allChats = [];


                Object.values(chatsData).forEach(chat => {
                    if (Array.isArray(chat)) {
                        allChats.push(...chat);
                    } else {
                        allChats.push(chat);
                    }
                });

                const filteredChats = allChats.filter(chat =>
                    (chat.To?.trim() === name.username.trim() && chat.from?.trim() === chatId.name.trim()) ||
                    (chat.To?.trim() === chatId.name.trim() && chat.from?.trim() === name.username.trim())
                );

                setMessages(filteredChats.reverse());
            }
        });

        return () => unsubscribe();
    }, [name.username, chatId.name]);

    const renderMessage = ({ item }) => {
        const isMyMessage = item.from.trim().toLowerCase() === name.username.trim().toLowerCase();
        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        );
    };

    const handleSend = async () => {
        setInputText('');
        if (inputText.trim() !== '') {
            const newMessage = [{
                message: inputText,
                from: name.username,
                To: chatId.name,
            }];

            try {
                const newMessageRef = push(ref(database, `chats/${name.username.trim()}`));
                if (name.username.trim() !== chatId.name.trim()) {
                    const otherMessageRef = push(ref(database, `chats/${chatId.name.trim()}`));
                    await set(otherMessageRef, newMessage);
                }
                await set(newMessageRef, newMessage);
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#111' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Back />
                </TouchableOpacity>
                <Image source={require('../assets/icon.png')} style={styles.avatar} />
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{chatId.name}</Text>
            </View>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
                inverted
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                onEndReached={() => {
                    console.log("End reached");
                }
                }
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
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    messageContainer: {
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#000000',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#CBC3E3',
        padding: 7,
        marginVertical: 5,
        maxWidth: '75%',
        color: '#fff',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 20,
        paddingLeft: 20
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 7,
        paddingHorizontal: 20,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 20,
        marginVertical: 5,
        paddingTop: 10,
        maxWidth: '75%',
        fontSize: 16,
        paddingRight: 40
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
    alertButton: {
        backgroundColor: '#f44336',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    alertButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default ChatScreen;