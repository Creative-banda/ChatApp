import React, { useEffect, useState,useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { storage, database } from '../config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as databaseRef, update, get } from 'firebase/database';
import CallIcon from '../assets/SVG/CallIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import UserIcon from '../assets/SVG/UserIcon';
import StoryDisplay from '../components/StoryDisplay';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import DisplayAddStory from '../components/DisplayAddStory';
import { MaterialIcons } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import AddFriendIcon from '../assets/SVG/AddFriendIcon';
import { AppContext } from '../AppContext';

const StoryStatusScreen = ({ navigation }) => {
    const [selectedStory, setSelectedStory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [IsUploading, SetUploading] = useState(false);
    const [inputText, setInputText] = useState('');
    const [storyActionModalVisible, setStoryActionModalVisible] = useState(false);
    const [filteredFriendList, setFilteredFriendList] = useState([]);
    const { friendList, user } = useContext(AppContext);
    const [currentUser, setUser] = useState(user)
    

    useEffect(() => {
        setFilteredFriendList(friendList.filter(item => item.id !== currentUser.email && item.Status.url));
    }, [friendList, currentUser.email]);

    const handleImagePick = async () => {
        setStoryActionModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: result.assets[0].width * 0.5 } }],  // Resize to 50% of original size
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }  // Compress to 70% quality
            );

            setImageUri(compressedImage.uri);
        }
    };

    const handleViewStory = async () => {
        setSelectedStory(currentUser);
        setModalVisible(true);
    }

    const handleRemoveStory = async () => {
        try {
            SetUploading(true);
            const statusRef = databaseRef(database, `Users/${currentUser.id}/Status`);
            const snapshot = await get(statusRef);

            if (snapshot.exists()) {
                await update(statusRef, { url: "", time: "  ", message: "" });
                let imageUrl = snapshot.val().url;
                if (snapshot.val().url) {
                    const storageRef = ref(storage, imageUrl);
                    await deleteObject(storageRef);
                    Alert.alert("Sucessfully", "Story Deleted Sucessfully")
                    setUser(prevUser => ({
                        ...prevUser,
                        Status: { url: "", time: "  ", message: "" }
                    }));
                } else {
                    Alert.alert("No Story", "Sorry You Did Not Upload Any Story")
                }
            } 
        } catch (error) {
            console.log("Error", error);
        }
        finally {
            SetUploading(false);
            setStoryActionModalVisible(false);
        }
    };

    const UpdatingDatabase = async (url) => {
        try {
            let statusRef = databaseRef(database, `Users/${currentUser.id}/Status`);

            await update(statusRef, { time: Date.now(), url: url, message: inputText, });
            setUser(prevUser => ({
                ...prevUser, Status: { time: Date.now(), url: url, message: inputText, }
            }));
        } catch (error) {
            console.error("Error updating database: ", error);
        }
    };

    const uploadImage = async () => {
        if (!imageUri) return;

        try {
            SetUploading(true);
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);

            await UpdatingDatabase(url);
            setImageUri(null);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        finally {
            SetUploading(false);
        }
    };

    const handleStoryPress = (item) => {

        setSelectedStory(item);
        setModalVisible(true);
    };
    const EmptyListComponent = () => (
        <View style={styles.noStoriesContainer}>
            <Text style={styles.noStoriesText}>Looks like it's quiet here... for now</Text>
        </View>
    );

    const renderStories = ({ item }) => {

        return (
            <TouchableOpacity style={styles.storyContainer} onPress={() => handleStoryPress(item)}>
                <Image source={{ uri: item?.Status.url }} style={styles.storyImage} />
                <View style={styles.storyTextContainer}>
                    <Text style={styles.storyName}>{item.username}</Text>
                    <Text style={styles.storyTime}>
                        {Math.floor((Date.now() - item.Status.time) / 1000 / 60 / 60)} hours{' '}
                        {Math.floor(((Date.now() - item.Status.time) / 1000 / 60) % 60)} minutes ago
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center', paddingVertical: 8 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingBottom: 15 }}>
                    <Ionicons name='chevron-back-outline' size={25} color={'#fff'} />
                </TouchableOpacity>
                <Text style={styles.header}>Stories</Text>
            </View>
            <TouchableOpacity style={styles.addStoryContainer} onPress={()=> setStoryActionModalVisible(true)}>
                <MaterialIcons name="manage-accounts" color="#fff" size={22} />
                <Text style={styles.addStoryText}>
                    {currentUser?.Status.url ? 'Manage Story' : 'Add Story'}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={filteredFriendList}
                keyExtractor={(item) => item.id}
                renderItem={renderStories}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.storyList}
                ListEmptyComponent={EmptyListComponent}
            />

            <View style={styles.BottomIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <UserIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <StatusIcon strokeWidth={3.5} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Call')}>
                    <CallIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AddFriend')}>
                    <AddFriendIcon />
                </TouchableOpacity>
            </View>

            {imageUri && <DisplayAddStory imageUri={imageUri} setImageUri={setImageUri} Done={uploadImage} IsUploading={IsUploading} inputText={inputText} setInputText={setInputText} />}
            {selectedStory && <StoryDisplay image={selectedStory.Status.url} modalVisible={modalVisible} onClose={() => { setSelectedStory(''); setModalVisible(false); }} Name={selectedStory.username} Message={selectedStory.Status.message} />}
            {selectedStory && <StoryDisplay image={selectedStory.Status.url} modalVisible={modalVisible} onClose={() => setModalVisible(false)} Name={selectedStory.username} Message={selectedStory.Status.message} />}

            <Modal
                animationType="slide"
                transparent={true}
                visible={storyActionModalVisible}
                onRequestClose={() => setStoryActionModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
                            <Ionicons name="image-outline" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.modalButtonText}>Add Story</Text>
                        </TouchableOpacity>

                        {currentUser?.Status.url && <TouchableOpacity onPress={handleViewStory} style={styles.modalButton}>
                            <Ionicons name="eye-outline" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.modalButtonText}>View Story</Text>
                        </TouchableOpacity>}

                        {currentUser?.Status.url && <TouchableOpacity onPress={handleRemoveStory} style={styles.modalButton}>
                            {IsUploading ? <ActivityIndicator size='small' color="#fff" /> : <>
                                <Ionicons name="trash-outline" size={24} color="#fff" style={styles.icon} />
                                <Text style={styles.modalButtonText}>Remove Story</Text>
                            </>}
                        </TouchableOpacity>}

                        <TouchableOpacity onPress={() => setStoryActionModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                            <Ionicons name="close-outline" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    header: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 16,
        fontFamily: 'Lato'
    },

    addStoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    addStoryText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 8,
        fontFamily: 'Nunito'
    },
    storyList: {
        paddingBottom: 16,
    },
    storyContainer: {
        marginBottom: 24,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    storyImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    storyTextContainer: {
        padding: 12,
    },
    storyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Lato'
    },
    storyTime: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
        fontFamily: 'Nunito'
    },
    BottomIcons: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#252525',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito',
        marginLeft: 10,
    },
    icon: {
        position: 'absolute',
        left: 20
    },
    noStoriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:50
    },
    noStoriesText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Nunito',
    },
});

export default StoryStatusScreen;