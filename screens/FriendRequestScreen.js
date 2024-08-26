import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../assets/SVG/BackButton';
import { ref, get } from 'firebase/database';
import { database } from '../config';
import { useRoute, useNavigation } from '@react-navigation/native';

const FriendRequestScreen = () => {
    const [UserList, SetUserlist] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { uid } = route.params;

    useEffect(() => {
        initializingUsers();
    }, []);

    const initializingUsers = async () => {
        try {
            const userDataRef = ref(database, `FriendList/${uid}`);
            const snapshot = await get(userDataRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const userListArray = Object.keys(userData).map(key => ({
                    key: key,  
                    ...userData[key]
                }));

                SetUserlist(userListArray);
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const renderFriendItem = ({ item }) => {
        if (item.id === uid) return null; 

        const imageUri = item.Profile && item.Profile !== '' ? { uri: item.Profile } : require('../assets/icon.png');

        return (
            <View style={styles.friendItemContainer}>
                <TouchableOpacity style={styles.friendItem} onPress={() => { navigation.navigate('OtherProfile', { uid: item.id }) }}>
                    <Image source={imageUri} style={styles.avatar} />
                    <Text style={styles.friendName}>{item.From}</Text>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => handleAddFriend(item.id)}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradientBackground}
        >
            <ImageBackground source={require('../assets/Images/AddFriendBackground.jpg')} style={styles.imageBackground}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <BackButton />
                        </TouchableOpacity>
                        <Text style={styles.header}>Friend Requests</Text>
                    </View>

                    <FlatList
                        data={UserList}
                        renderItem={renderFriendItem}
                        keyExtractor={item => item.key}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            </ImageBackground>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#fff',
        marginTop: 20,
    },
    header: {
        color: '#fff',
        fontFamily: 'Lato',
        fontSize: 24,
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        left: 10,
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    friendItemContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendName: {
        flex: 1,
        color: '#333',
        fontSize: 18,
        fontFamily: 'Lato',
    },
    addButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#00BCD4',
        borderRadius: 20,
        shadowColor: '#00BCD4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        fontFamily: 'Lato',
        fontSize: 16,
        color: '#fff',
    },
});

export default FriendRequestScreen;
