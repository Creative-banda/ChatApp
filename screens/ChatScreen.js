// React and React Native core imports
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  Modal
} from 'react-native';

// Navigation
import { useRoute } from '@react-navigation/native';

// Firebase imports
import { database, storage } from '@config';
import { ref, set, onValue, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Components
import CustomAlert from '@components/CustomAlert';
import DisplayImage from '@components/DisplayImage';
import ThreeDotMenu from '@components/ThreeDotMenu';

// SVG and Icons
import Back from '@assets/SVG/BackButton';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Expo packages
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Functions
import handleNotification from '@functions/Send_Notification';
import RenderMessage from '@functions/RenderMessage';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [IsMessage, setIsMessage] = useState(false)
    const [displayImage, setDisplayImage] = useState('');
    const [isActive, setisActive] = useState(false);
    const [ChatRoom, setChatroom] = useState('');
    const [IsotherTyping, SetotherTyping] = useState(false);
    const [IsEditing, SetEditing] = useState(false);
    const [EditText, setEditText] = useState('');
    const [editTextList, setEditList] = useState([]);
    const typingTimeoutRef = useRef(null);
    const statusTimeoutRef = useRef(null);
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

                // Sort chats by time
                allChats.sort((a, b) => new Date(a.time) - new Date(b.time));

                const filteredChats = allChats.filter(chat =>
                    (chat.To?.trim() === name.id.trim() && chat.from?.trim() === chatId.name.trim()) ||
                    (chat.To?.trim() === chatId.name.trim() && chat.from?.trim() === name.id.trim())
                );

                if (filteredChats.length === 0) {
                    setIsMessage(true)
                }
                else {
                    setIsMessage(false)
                }
                setMessages(filteredChats.reverse());
            }
        });

        return () => unsubscribe();
    }, [name, chatId]);

    useEffect(() => {
        const userRef = ref(database, `Users/${chatId.name}`);

        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }

        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const userdata = snapshot.val();
                const currentTime = Date.now();
                const timeDifference = currentTime - userdata.LastSeen;

                if (timeDifference < 7000) {
                    setisActive(true);
                } else {
                    setisActive(false);
                }
            } else {
                setisActive(false);
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setisActive(false);
                console.log("Set to False due to inactivity");
            }, 12000);
        });

        // Cleanup on component unmount
        return () => {
            unsubscribe();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }
        };
    }, [chatId.name]);

    useEffect(() => {
        createChatId(chatId.name, name.id)
    }, [])

    useEffect(() => {
        if (typeof ChatRoom !== 'string' || typeof chatId.name !== 'string') {
            console.error('ChatRoom or name.id is not a string', { ChatRoom, userId: chatId.name });
            return;
        }
        const removeListener = setupTypingStatusListener(ChatRoom, chatId.name);
        return removeListener;
    }, [ChatRoom, chatId.name]);


    const toggleSelectionMode = (id, Text, MessageType) => {
        setIsSelectionMode(true);
        toggleItemSelection(id);
        if (MessageType === 'text') {
            setEditList(prevList => [...prevList, Text]);
        }
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
        setEditList([]);
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            Alert.alert('No messages selected', 'Please select at least one message to delete.');
            return;
        }

        setAlertVisible(true);
    };

    const deleteMessages = async (user, otherUser, messageIds) => {
        console.log(selectedItems);

        const userChatsPath = `chats/${user.trim()}`;
        const otherUserChatsPath = `chats/${otherUser.trim()}`;
        setAlertVisible(false);

        try {
            await deleteFromChat(userChatsPath, messageIds);
            await deleteFromChat(otherUserChatsPath, messageIds);
            setSelectedItems([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error('Error deleting messages from both users:', error);
        }
    };

    const deleteFromChat = async (chatPath, messageIds) => {
        try {
            for (const messageId of messageIds) {
                // Create a reference to the specific message you want to delete
                const messageRef = ref(database, `${chatPath}/${messageId}`);

                // Delete the message
                await remove(messageRef);
            }
        } catch (error) {
            console.error("Error deleting messages:", error);
        }
    };

    const handleSingleClick = (item) => {
        if (isSelectionMode && item.from === name.id) {
            toggleItemSelection(item.id);
            return false;
        }
        if (item.messageType === 'image' && !isSelectionMode) {
            setDisplayImage(item.message)
        }
    }

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }

    const handleSend = async (inputText, messageType) => {
        const Id = generateRandomId();

        setInputText('');
        if (inputText.trim() !== '') {
            const newMessage = {
                id: Id,
                message: inputText,
                from: name.id,
                To: chatId.name,
                messageType: messageType,
                time: new Date().toISOString()
            };

            try {
                const newMessageRef = ref(database, `chats/${name.id.trim()}/${Id}`);
                const otherMessageRef = ref(database, `chats/${chatId.name.trim()}/${Id}`);
                await set(otherMessageRef, newMessage);
                await set(newMessageRef, newMessage);
                let message = "You Receive a New Message From " + name.username;
                handleNotification(message, chatId.token, chatId.name, "message")
                handleTypingStatus(ChatRoom, name.id, false);

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
            const storageReference = storageRef(storage, `/${filename}`);

            await uploadBytes(storageReference, blob);
            const downloadUrl = await getDownloadURL(storageReference);

            handleSend(downloadUrl, "image");
        } catch (error) {
            console.error("Error sending image: ", error);
        }
    };

    const setupTypingStatusListener = (chatRoom, userId) => {
        const typingStatusRef = ref(database, `TypingStatus/${chatRoom}/${userId}`);

        const listener = onValue(typingStatusRef, (snapshot) => {
            const Typing = snapshot.val();
            SetotherTyping(Typing)
        });

        return () => listener();
    };

    const createChatId = (userId1, userId2) => {
        let chatId;
        if (userId1 < userId2) {
            chatId = `${userId1}_${userId2}`;
        } else {
            chatId = `${userId2}_${userId1}`;
        }
        setChatroom(chatId);
        handleTypingStatus(chatId, name.id, false);
    };

    const handleTextChange = (newText) => {
        lasttype = Date.now()
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setInputText(newText);
        if (!newText) {
            handleTypingStatus(ChatRoom, name.id, false);
        }
        else {
            handleTypingStatus(ChatRoom, name.id, true);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleTypingStatus(ChatRoom, name.id, false);
        }, 1000);
    };

    const handleTypingStatus = async (chatRoom, userId, isTyping) => {
        try {
            const typingStatusRef = ref(database, `TypingStatus/${chatRoom}/${userId}`);
            await set(typingStatusRef, isTyping);
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    };

    const handleEdit = async () => {
        const userRef = ref(database, `chats/${name.id}/${selectedItems[0]}`);
        await update(userRef, { message: EditText });
        SetEditing(false);
        const Otherref = ref(database, `chats/${chatId.name}/${selectedItems[0]}`);
        await update(Otherref, { message: EditText });
        handleDeselect()

    }


    return (
        <ImageBackground source={require('../assets/Images/background.jpg')} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>


                <View style={styles.header}>
                    {isSelectionMode ? (
                        <View style={styles.selectionModeContainer}>
                            <TouchableOpacity onPress={handleDeselect} style={styles.selectionModeButton}>
                                <Icon name="back" size={24} color="#fff" />
                            </TouchableOpacity>
                            {selectedItems.length == 1 && editTextList.length != 0 && <TouchableOpacity onPress={() => {
                                SetEditing(true); setEditText(editTextList[0]); console.log(editTextList);
                            }} style={{ paddingVertical: 10 }}>
                                <Icon name="edit" size={24} color="#fff" />
                            </TouchableOpacity>}
                            <TouchableOpacity onPress={handleDelete} style={{ paddingVertical: 10 }}>
                                <Icon name="delete" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 5, marginRight: 10 }}>
                                <Back />
                            </TouchableOpacity>
                            <Image source={chatId.image ? { uri: chatId.image } : require('../assets/icon.png')} style={styles.avatar} />

                            <TouchableOpacity onPress={() => { navigation.navigate('OtherProfile', { uid: chatId.name }) }}>
                                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Lato' }}>{chatId.username}</Text>
                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                    {isActive ? (
                                        <>
                                            <FontAwesome name='dot-circle-o' size={16} color='green' />
                                            <Text style={{ color: '#fff' }}>Online</Text>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesome name='dot-circle-o' size={16} color='red' />
                                            <Text style={{ color: '#fff' }}>Offline</Text>
                                        </>
                                    )}
                                    {IsotherTyping && <Text style={{ color: '#fff' }}>Typing...</Text>}
                                </View>
                            </TouchableOpacity>

                            <ThreeDotMenu ViewProfile={() => { navigation.navigate('OtherProfile', { uid: chatId.name }) }} CurrentUser={name} OtherUser={chatId} />
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
                    renderItem={({ item }) => (
                        <RenderMessage
                            item={item}
                            handleSingleClick={handleSingleClick}
                            toggleSelectionMode={toggleSelectionMode}
                            selectedItems={selectedItems}
                            name={name}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatContainer}
                    inverted
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    extraData={selectedItems}
                />


                <View style={styles.inputContainer}>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 8 }}>
                        <TextInput
                            style={styles.input}
                            value={inputText}

                            onChangeText={handleTextChange}
                            placeholder="Message..."
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={3}
                        />
                        <TouchableOpacity onPress={() => HandleFileAdd()} >
                            <Entypo name='attachment' size={22} color='#fff' />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(inputText, "text")}>
                        <Feather name='send' color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <CustomAlert
                Title="Do you really want to delete?"
                visible={alertVisible}
                onRequestClose={() => setAlertVisible(false)}
                onYes={() => deleteMessages(name.id, chatId.name, selectedItems)}
                onNo={() => setAlertVisible(false)}
            />
            {/* This is for Editing Mode */}
            {IsEditing && <View style={styles.EditContainer}>
                <TouchableOpacity onPress={() => { SetEditing(false); }} style={{ left: 20, top: 30 }}>
                    <Icon name="back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.EditMain}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 8 }}>
                        <TextInput
                            style={styles.input}
                            value={EditText}

                            onChangeText={setEditText}
                            placeholder="Message..."
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={3}
                        />

                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={() => handleEdit()}>
                        <Icon name='edit' color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </View>}
            {displayImage !== '' && <DisplayImage imageUri={displayImage} setImageUri={setDisplayImage} />}
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    EditContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    EditMain: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row'
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
        fontFamily: 'Lato'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
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
    InfoText: {
        color: '#FFFFFF',
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Nunito',
    },
    selectionModeButton: {
        paddingVertical: 10,
        position: 'absolute',
        left: 10,
    },
    selectionModeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 50,
        paddingHorizontal: 30,
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
        marginHorizontal: 10
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    selectedTextView: {
        backgroundColor: '#E09D90',
    },
});

export default ChatScreen;