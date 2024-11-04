import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, get, remove  } from 'firebase/database';
import { database } from '../config';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../AppContext';

const FriendRequestScreen = ({navigation}) => {
    const [UserList, SetUserlist] = useState([]);
    const {userUid} = useContext(AppContext);
    console.log(userUid);
    
    useEffect(() => {
        initializingUsers();
    }, []);

    const initializingUsers = async () => {
        try {
            const userDataRef = ref(database, `FriendList/${userUid}`);
            const snapshot = await get(userDataRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userListArray = Object.keys(userData).map(key => ({
                    key: key,
                    ...userData[key]
                }));
                const users = userListArray.filter(item => item.Status !== "Accept" && item.receiveruid !== userUid);
                SetUserlist(users);
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };


    const handleCancel = async(item)=>{
        try {
                const requestRef = ref(database, `FriendList/${item.senderuid}/${item.requestId}`);
                const otherrequestRef = ref(database, `FriendList/${item.receiveruid}/${item.requestId}`);
                
                await remove(requestRef);
                await remove(otherrequestRef);
                const newUsers = UserList.filter(user => user.key !== item.key);
                SetUserlist(newUsers);
            
        } catch (error) {
            console.error("Error deleting messages:", error);
        }
    }

    const renderFriendItem = ({ item }) => {

        const imageUri = item.receiverprofile && item.receiverprofile !== '' ? { uri: item.receiverprofile } : require('../assets/icon.png');

        return (
            <View style={styles.friendItemContainer}>
                <TouchableOpacity style={styles.friendItem} onPress={() => { navigation.navigate('OtherProfile', { userUid: item.id }) }}>
                    <Image source={imageUri} style={styles.avatar} />
                    <Text style={styles.friendName}>{item.receiverusername}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleCancel(item)}
                    >
                        <Text style={styles.addButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Icon name="sad-outline" size={50} color="#fff" />
            <Text style={styles.emptyText}>You Did'nt Send Any Friend Request</Text>
        </View>
    );

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradientBackground}
        >
            <ImageBackground source={require('../assets/Images/AddFriendBackground.jpg')} style={styles.imageBackground}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name='chevron-back-outline' size={25} color={'#fff'} />
                        </TouchableOpacity>
                        <Text style={styles.header}>Friend Requests</Text>
                    </View>
                    <View style={styles.TopContainer}>
                        <TouchableOpacity onPress={() => { navigation.navigate('FriendRequest', { userUid: userUid }) }}>
                            <Text style={{ paddingLeft: 5, color: '#fff' }}>Receive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.TopButtons}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={UserList}
                        renderItem={renderFriendItem}
                        keyExtractor={item => item.key}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={renderEmptyComponent}
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 0.5,
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
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 14,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontFamily: 'Lato',
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
    },
    TopContainer: {
        width: '95%',
        flexDirection: 'row',
        paddingVertical: 15,
        gap: 20,
        alignSelf: 'center',
        paddingLeft: 10,
        alignItems: 'center'
    },
    TopButtons: {
        color: '#B8579F',
        fontSize: 15,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderColor: '#B8579F',
    }
});

export default FriendRequestScreen;
