import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, Image, ImageBackground, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { database, storage } from '../config';
import { ref, push, set, onValue, update, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Back from '../assets/SVG/BackButton';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomAlert from '../components/CustomAlert';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [IsMessage, setIsMessage] = useState(false)
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const route = useRoute();
    const { chatId, name } = route.params;

    useEffect(() => {
        const chatsRef = ref(database, `chats/${name.id}`);
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
                    (chat.To?.trim() === name.username.trim() && chat.from?.trim() === chatId.username.trim()) ||
                    (chat.To?.trim() === chatId.username.trim() && chat.from?.trim() === name.username.trim())
                );

                if (filteredChats.length === 0) {
                    setIsMessage(true)
                }
                else{
                    setIsMessage(false)
                }
                setMessages(filteredChats.reverse());
            }
        });

        return () => unsubscribe();
    }, [name, chatId]);


    const toggleSelectionMode = (id) => {
        setIsSelectionMode(true);
        toggleItemSelection(id);
    };

    const toggleItemSelection = (id) => {
        setSelectedItems(prevSelectedItems => {
            if (prevSelectedItems.includes(id)) {
                const updatedSelectedItems = prevSelectedItems.filter(item => item !== id);
                setIsSelectionMode(updatedSelectedItems.length > 0);
                return updatedSelectedItems;
            } else {
                const updatedSelectedItems = [...prevSelectedItems, id];
                setIsSelectionMode(true);
                return updatedSelectedItems;
            }
        });
    };

    const handleDeselect = () => {
        setSelectedItems([]);
        setIsSelectionMode(false);
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            Alert.alert('No messages selected', 'Please select at least one message to delete.');
            return;
        }

        setAlertVisible(true);
    };

    const deleteMessages = async (user, otherUser, messageIds) => {
        const userChatsRef = ref(database, `chats/${user.trim()}`);
        const otherUserChatsRef = ref(database, `chats/${otherUser.trim()}`);

        try {
            await deleteFromChat(userChatsRef, messageIds);
            await deleteFromChat(otherUserChatsRef, messageIds);
            console.log('Messages deleted successfully from both users');
            setSelectedItems([]);
            setIsSelectionMode(false);
            setAlertVisible(false);
        } catch (error) {
            console.error('Error deleting messages from both users:', error);
        }
    };

    const deleteFromChat = async (chatRef, messageIds) => {
        const snapshot = await get(chatRef);
        if (snapshot.exists()) {
            const chatsData = snapshot.val();
            const updates = {};

            Object.keys(chatsData).forEach(key => {
                const messages = chatsData[key];
                if (Array.isArray(messages)) {
                    const updatedMessages = messages.filter(message => !messageIds.includes(message.id));
                    if (updatedMessages.length > 0) {
                        updates[`${key}`] = updatedMessages;
                    } else {
                        updates[`${key}`] = null;
                    }
                }
            });

            if (Object.keys(updates).length > 0) {
                await update(chatRef, updates);
            }
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.from.trim().toLowerCase() === name.username.trim().toLowerCase();
        const isSelected = selectedItems.includes(item.id);

        return (
            <View
                style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage, isSelected && styles.selectedMessage]}
            >
                {isMyMessage ? (
                    <TouchableOpacity onLongPress={() => toggleSelectionMode(item.id)} onPress={() => { if (isSelectionMode) { toggleItemSelection(item.id); } }}>
                        {item.messageType === "text" ? (
                            <Text style={[styles.messageText, isSelected && styles.selectedMessageText]}>{item.message}</Text>
                        ) : (
                            <Image source={{ uri: item.message }} style={styles.image} />
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onLongPress={() => toggleSelectionMode(item.id)} onPress={() => { if (isSelectionMode) { toggleItemSelection(item.id); } }}>
                        {item.messageType === "text" ? (
                            <Text style={[styles.messageText, isSelected && styles.selectedMessageText]}>{item.message}</Text>
                        ) : (
                            <Image source={{ uri: item.message }} style={styles.image} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const handleEmojiSelect = (emoji) => {
        setInputText(inputText + emoji);
        setIsPickerVisible(false);
    };

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }

    const handleSend = async (inputText, messageType) => {
        const Id = generateRandomId();

        setInputText('');
        if (inputText.trim() !== '') {
            const newMessage = [{
                id: Id,
                message: inputText,
                from: name.username,
                To: chatId.username,
                messageType: messageType,
                time: new Date().toISOString()
            }];

            try {
                const newMessageRef = push(ref(database, `chats/${name.id.trim()}`));
                if (name.username.trim() !== chatId.username.trim()) {
                    const otherMessageRef = push(ref(database, `chats/${chatId.name.trim()}`));
                    await set(otherMessageRef, newMessage);
                }
                await set(newMessageRef, newMessage);
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    const HandleFileAdd = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
            );
            handleSendImage(manipulatedImage.uri);
        }
    };

    const handleSendImage = async (url) => {
        try {
            if (!url) {
                console.error("No image URI found");
                return;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }

            const blob = await response.blob();
            const filename = url.substring(url.lastIndexOf('/') + 1);
            const storageReference = storageRef(storage, `images/${filename}`);

            await uploadBytes(storageReference, blob);
            const downloadUrl = await getDownloadURL(storageReference);

            handleSend(downloadUrl, "image");
        } catch (error) {
            console.error("Error sending image: ", error);
        }
    };

    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>

                <View style={styles.header}>
                    {isSelectionMode ? (
                        <View style={styles.selectionModeContainer}>
                            <TouchableOpacity onPress={handleDeselect} style={styles.selectionModeButton}>
                                <Icon name="back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={{ paddingVertical: 10 }}>
                                <Icon name="delete" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 5, marginRight: 10 }}>
                                <Back />
                            </TouchableOpacity>
                            <Image source={chatId.image ? { uri: chatId.image } : require('../assets/icon.png')} style={styles.avatar} />
                            <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Lato' }}>{chatId.username}</Text>
                        </View>
                    )}
                </View>

                {IsMessage && (
                    <View style={styles.InfoContainer}>
                        <Image source={chatId.image ? { uri: chatId.image } : require('../assets/icon.png')} style={styles.avatar} />

                        <Text style={styles.InfoHeader}>{chatId.username}</Text>
                        <Text style={styles.InfoText}>Say Hii To {chatId.username}</Text>
                    </View>
                )}

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
                    <TouchableOpacity onPress={() => setIsPickerVisible(true)}>
                        <Icon name="smileo" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 8 }}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message..."
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={3}
                        />
                        <TouchableOpacity onPress={() => HandleFileAdd()} >
                            <Icon name="pluscircle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(inputText, "text")}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CustomAlert
                Title="Do you really want to delete?"
                visible={alertVisible}
                onRequestClose={() => setAlertVisible(false)}
                onYes={() => deleteMessages(name.username, chatId.name, selectedItems)}
                onNo={() => setAlertVisible(false)}
            />
            <Modal
                transparent
                visible={isPickerVisible}
                onRequestClose={() => setIsPickerVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <EmojiSelector onEmojiSelected={handleEmojiSelect} />
                </View>
            </Modal>
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
    header: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomColor: '#4C4A48',
        borderBottomWidth: 2,
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
    InfoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: '30%'
    },
    InfoHeader: {
        color: '#FFFFFF',
        marginTop: 10,
        fontSize: 22,
        fontFamily: 'Lato',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode:'cover'
        
    },
    InfoText: {
        color: '#FFFFFF',
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Nunito',
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
    selectionModeButton: {
        paddingVertical: 10,
        position: 'absolute',
        left: 10,
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
    selectionModeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 50,
        paddingHorizontal: 30,
    },
    selectedMessage: {
        backgroundColor: '#E09D90',
    },
    selectedMessageText: {
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 5,
        backgroundColor: '#111',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Nunito',
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
    selectedTextView: {
        backgroundColor: '#E09D90',
    },
    modalContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },


});

export default ChatScreen;