import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { storage, database } from '../config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, update, get } from 'firebase/database';
import CallIcon from '../assets/SVG/CallIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import UserIcon from '../assets/SVG/UserIcon';
import PlusIcon from '../assets/SVG/PlusIcon';
import StoryDisplay from '../components/StoryDisplay';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import DisplayAddStory from '../components/DisplayAddStory'
import { useRoute } from '@react-navigation/native';

const StoryStatusScreen = ({ navigation }) => {
    const route = useRoute();
    const { uid, user } = route.params;
    const [Stories, SetStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [IsUploading, SetUploading] = useState(false)
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        initializingUsers();
    }, []);

    const initializingUsers = async () => {
        try {
            let UserData = databaseRef(database, 'Users');
            const snapshot = await get(UserData);
            if (snapshot.exists()) {
                const UserData = snapshot.val();
                const StatusList = Object.values(UserData);
                SetStories(StatusList);
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleAddStory = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri
            );

            setImageUri(manipulatedImage.uri);
        }
    };

    const UpdatingDatabase = async (url) => {
        console.log(inputText);
        
        try {
            let statusRef = databaseRef(database, `Users/${user.id}/Status`);

            await update(statusRef, {
                time: Date.now(),
                url: url,
                message : inputText
            });

            console.log("Database updated successfully!");
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
            console.log("Download Link:", url);

            await UpdatingDatabase(url);
            setImageUri(null);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        SetUploading(false)
    };

    const handleStoryPress = (item) => {
        setSelectedStory(item);
        setModalVisible(true);
    };

    const renderStories = ({ item }) => {
        if (item.email === user.email || !item.Status) {
            return null; 
        }
        return (
            <TouchableOpacity style={styles.storyContainer} onPress={() => handleStoryPress(item)}>
                <Image source={{ uri: item.Status.url }} style={styles.storyImage} />
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
            <Text style={styles.header}>Stories</Text>
            <TouchableOpacity style={styles.addStoryContainer} onPress={handleAddStory}>
                <PlusIcon />
                <Text style={styles.addStoryText}>Add Story</Text>
            </TouchableOpacity>

            <FlatList
                data={Stories}
                keyExtractor={(item) => item.email}
                renderItem={renderStories}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.storyList}
            />

            <View style={styles.BottomIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <UserIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <StatusIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Call', { uid: uid, user: user })}>
                    <CallIcon />
                </TouchableOpacity>
            </View>

            {imageUri && <DisplayAddStory imageUri={imageUri} setImageUri={setImageUri} Done={uploadImage} IsUploading={IsUploading} inputText={inputText} setInputText={setInputText}/>}
            {selectedStory && <StoryDisplay image={selectedStory.Status.url} modalVisible={modalVisible} onClose={() => {  setSelectedStory(''); setModalVisible(false)}} Name={selectedStory.username} Message={selectedStory.Status.message} />}
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
    }
});

export default StoryStatusScreen;
