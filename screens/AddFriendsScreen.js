import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { database } from '../config';
import { ref, get, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import UserIcon from '../assets/SVG/UserIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import CallIcon from '../assets/SVG/CallIcon';
import AddFriendIcon from '../assets/SVG/AddFriendIcon';

const AddFriendsScreen = ({ navigation }) => {
    const route = useRoute();
    const { uid, user } = route.params;
    const [users, setUsers] = useState([]);
    const [uniqueUidList, setUniqueUidList] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchCurrentUserFriends();
    }, []);

    const fetchUsers = async () => {
        try {
            const userDataRef = ref(database, 'Users');
            const snapshot = await get(userDataRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const usersList = Object.keys(userData).map(key => ({
                    mail: userData[key].email,
                    id: key,
                    image: userData[key].ProfilePic,
                    username: userData[key].username,
                }));
                setUsers(usersList);

            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchCurrentUserFriends = async () => {
        try {
            const currentuserRef = ref(database, `FriendList/${uid}`);
            const snapshot = await get(currentuserRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const filteredUsers = Object.values(userData);
                const uniqueUids = new Set();
                filteredUsers.forEach(item => {
                    uniqueUids.add(item.receiveruid);
                    uniqueUids.add(item.senderuid);
                });
                setUniqueUidList(Array.from(uniqueUids));
                

            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    function generateRandomId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }

    const handleAddFriend = async (friend) => {
        const id = generateRandomId();
        const request = {
            senderuid: uid,
            senderusername: user.username,
            senderprofile: user.ProfilePic,
            time: new Date().toISOString(),
            Status: 'pending',
            receiverusername: friend.username,
            receiverprofile: friend.image,
            receiveruid: friend.id,
            requestId: id,
        };

        try {
            const newMessageRef = ref(database, `FriendList/${uid}/${id}`);
            const otherMessageRef = ref(database, `FriendList/${friend.id}/${id}`);
            await set(otherMessageRef, request);
            await set(newMessageRef, request);

            setUsers(prevUsers => prevUsers.filter(u => u.id !== friend.id));
        } catch (error) {
            console.error("Error while adding friend: ", error);
        }
    };

    const renderFriendItem = ({ item }) => {
        if (item.id === uid || uniqueUidList.includes(item.id)) {
            return null;
        }
    
        const imageUri = item.image && item.image !== '' ? { uri: item.image } : require('../assets/icon.png');
    
        return (
            <TouchableOpacity style={styles.friendItem} onPress={() => navigation.navigate('OtherProfile', { uid: item.id })}>
                <Image source={imageUri} style={styles.avatar} />
                <Text style={styles.friendName}>{item.username}</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddFriend(item)}
                >
                    <Text style={styles.addButtonText}>Add Friend +</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };
    

    return (
        <ImageBackground source={require('../assets/Images/AddFriendBackground.jpg')} style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <View style={styles.holder}>
                <View style={styles.Uppercontainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-back-outline' size={25} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Add Friends</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 8, top: 10 }} onPress={() => { navigation.navigate('FriendRequest', { uid: uid }) }}>
                        <Icon name='notifications-circle' size={30} color='#E7F573' />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={users}
                    renderItem={renderFriendItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
                <View style={styles.BottomIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home", { uid: uid, user: user })}>
                        <UserIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Status", { uid: uid, user: user })}>
                        <StatusIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Call", { uid: uid, user: user })}>
                        <CallIcon />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <AddFriendIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    holder: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 25
    },
    Uppercontainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    header: {
        marginLeft: 20,
        fontFamily: 'Lato',
        fontSize: 20,
        color: '#fff'
    },
    listContainer: {
        paddingVertical: 10
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    friendName: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Lato'
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#00BCD4',
        borderTopEndRadius: 10,
        borderBottomLeftRadius: 10,
        borderRadius: 2
    },
    addButtonText: {
        fontFamily: 'Lato',
        fontSize: 15,
        color: '#fff'
    },
    BottomIcons: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    }
});

export default AddFriendsScreen;
