import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, Image, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { database } from '../config';
import { ref, push, set, onValue } from 'firebase/database';
import Back from '../assets/SVG/BackButton';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
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

    const toggleSelected = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.from.trim().toLowerCase() === name.username.trim().toLowerCase();
        const isSelected = selectedItems.includes(item.id);

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                    isSelected && styles.selectedMessage, isSelected && styles.selectedTextView
                ]}
            >
                {isMyMessage ? 
                <TouchableOpacity onLongPress={() => toggleSelected(item.id)}>
                    <Text style={[styles.messageText, isSelected && styles.selectedMessageText]}>{item.message}</Text>
                </TouchableOpacity> : 
                <Text style={styles.messageText}>{item.message}</Text>}
            </View>
        );
    };

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }

    const handleSend = async () => {
        const Id = generateRandomId();

        setInputText('');
        if (inputText.trim() !== '') {
            const newMessage = [{
                id: Id,
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
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.container}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderBottomColor: '#4C4A48', borderBottomWidth: 2 }}>
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
                    contentContainerStyle={styles.chatContainer}
                    inverted
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    extraData={selectedItems}
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
        </ImageBackground>
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
        fontSize: 17,
        color: '#000000',
        fontFamily: 'Nunito',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#CBC3E3',
        padding: 7,
        marginVertical: 5,
        maxWidth: '75%',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 20,
        paddingLeft: 20,
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
        paddingRight: 40,
    },
    selectedMessage: {
        backgroundColor: '#FFFFF',
    },
    selectedMessageText: {
        color: '#000',
        fontFamily: 'Lato',
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
    selectedTextView:{
        backgroundColor: '#E09D90',
    }

});

export default ChatScreen;
