import { database } from '../config';
import { AppContext } from '../AppContext';
import UserIcon from '../assets/SVG/UserIcon';
import CallIcon from '../assets/SVG/CallIcon';
import { ref, get, set } from 'firebase/database';
import StatusIcon from '../assets/SVG/StatusIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import AddFriendIcon from '../assets/SVG/AddFriendIcon';
import React, { useEffect, useState, useContext } from 'react';
import handle_Notification from '../functions/Send_Notification';
import { StyleSheet, View, ImageBackground, StatusBar, Text, FlatList, TouchableOpacity, Image } from 'react-native';

const AddFriendsScreen = ({ navigation }) => {
    const { userUid, user } = useContext(AppContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
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
                
                // Filter out users who are already friends
                const uniqueUids = await fetchCurrentUserFriends();
                const filteredUsers = usersList.filter(user => user.id !== userUid && !uniqueUids.has(user.id));

                setUsers(filteredUsers);
                // handleNotification()

            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchCurrentUserFriends = async () => {
        try {
            const currentuserRef = ref(database, `FriendList/${userUid}`);
            const snapshot = await get(currentuserRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const uniqueUids = new Set();
                Object.values(userData).forEach(item => {
                    uniqueUids.add(item.receiveruid);
                    uniqueUids.add(item.senderuid);
                });
                
                return uniqueUids;
                
            } else {
                console.log('No data available');
                return new Set(); // Return an empty set if no data is available
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return new Set(); // Return an empty set if an error occurs
        }
    };
    
    function generateRandomId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }

    const handleAddFriend = async (friend) => {
        const id = generateRandomId();
        const request = {
            senderuid: userUid,
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
            const newMessageRef = ref(database, `FriendList/${userUid}/${id}`);
            const otherMessageRef = ref(database, `FriendList/${friend.id}/${id}`);
            await set(otherMessageRef, request);
            await set(newMessageRef, request);

            setUsers(prevUsers => prevUsers.filter(u => u.id !== friend.id));
            let msg = "You got a friend request from "+user.username;

            handle_Notification(friend.token, msg, 'You have a new friend request from ' + user.username, 'friend_request');

        } catch (error) {
            console.error("Error while adding friend: ", error);
        }
    };

    const renderFriendItem = ({ item }) => {
        console.log(item);
        
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
                    <TouchableOpacity style={{ position: 'absolute', right: 8, top: 10 }} onPress={() => { navigation.navigate('FriendRequest') }}>
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
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <UserIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Status")}>
                        <StatusIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Call")}>
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
