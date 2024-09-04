import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, get,update } from 'firebase/database';
import { database } from '../config';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const FriendRequestScreen = ({ navigation }) => {
    const [UserList, SetUserlist] = useState([]);
    const route = useRoute();
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
                const users = userListArray.filter(item => item.Status !== "Accept" && item.senderuid !== uid);


                SetUserlist(users)
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleAddFriend = async(senderuid, receiveruid, messageId) => {
        const Myreq = ref(database, `FriendList/${senderuid}/${messageId}`);
        const Otherreq = ref(database, `FriendList/${receiveruid}/${messageId}`);

        await update(Myreq, { Status: 'Accept' });
        await update(Otherreq, { Status: 'Accept' });

        const users = UserList.filter(user => user.requestId != messageId);
    
        
        SetUserlist(users)

    }

    const renderFriendItem = ({ item }) => {

        console.log(item);
        const imageUri = item.senderprofile && item.senderprofile !== '' ? { uri: item.senderprofile } : require('../assets/icon.png');

        return (
            <View style={styles.friendItemContainer}>
                <TouchableOpacity style={styles.friendItem} onPress={() => { navigation.navigate('OtherProfile', { uid: item.id }) }}>
                    <Image source={imageUri} style={styles.avatar} />
                    <Text style={styles.friendName}>{item.senderusername}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddFriend(item.senderuid, item.receiveruid, item.requestId)}
                    >
                        <Text style={styles.addButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Icon name="sad-outline" size={50} color="#fff" />
            <Text style={styles.emptyText}>No Friend Requests</Text>
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
                        <TouchableOpacity>
                            <Text style={styles.TopButtons}>Receive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ paddingLeft: 20, color: '#fff' }} onPress={() => { navigation.navigate('SendRequest', { uid: uid }) }}>
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
        gap: 14,
        alignSelf: 'center',
        paddingLeft: 20
    },
    TopButtons: {
        color: '#B8579F',
        fontSize: 15,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderColor: '#B8579F'
    }
});

export default FriendRequestScreen;
