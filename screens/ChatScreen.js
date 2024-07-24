import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { database } from '../config';
import { ref, get } from 'firebase/database';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const route = useRoute();
    const { chatId, name } = route.params;

    // console.log("Name",name.username);
    useEffect(() => {
        initializingChats();
    }, []);

    const renderMessage = ({ item }) => {
        const isMyMessage = item.To.trim().toLowerCase() === name.username.trim().toLowerCase();
        console.log(item.To, name.username);
        return(
            <View
            style={[
              styles.messageContainer,
              isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
    );}

    const handleSend = () => {
        if (inputText.trim() !== '') {
            setMessages([...messages, inputText]);
            setInputText('');
        }
    };

    const initializingChats = async () =>{
        // console.log(chatId.id);
        try{
            let chatsRef = ref(database, `chats/${chatId.name}`);
          const snapshot = await get(chatsRef);
          if (snapshot.exists()) {
            const chatsData = snapshot.val();
            setMessages(chatsData);
          }
        } catch (error) {
          console.error("Error fetching chats: ", error);
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
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0095f6', 
        padding: 7,
        marginVertical: 5,
        maxWidth: '75%',
        color: '#fff',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 20,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#CBC3E3',
        padding: 7,
        paddingHorizontal: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginVertical: 5,
        maxWidth: '75%',
        fontSize: 16,
        color: '#000'
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