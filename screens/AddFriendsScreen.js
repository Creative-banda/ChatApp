import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { database } from '../config';
import { ref, get } from 'firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import UserIcon from '../assets/SVG/UserIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import CallIcon from '../assets/SVG/CallIcon'
import AddFriendIcon from '../assets/SVG/AddFriendIcon';

const AddFriendsScreen = ({ navigation }) => {
    const route = useRoute();
    const { uid, user } = route.params;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        initializingUsers();
    }, []);


    const initializingUsers = async () => {
        try {
            let UserData = ref(database, 'Users');
            const snapshot = await get(UserData);
            if (snapshot.exists()) {
                const UserData = snapshot.val();
                const keys = Object.keys(UserData);
                
                const usersList = keys.map(key => ({ mail: UserData[key].email, id: key, image: UserData[key].ProfilePic, username: UserData[key].username, id : UserData[key].id }));
                setUsers(usersList);
                console.log(usersList);
                
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const renderFriendItem = ({ item }) => {
        const imageUri = item.image && item.image !== '' ? { uri: item.image } : require('../assets/icon.png');

        return (
            <TouchableOpacity style={styles.friendItem} onPress={()=>{ navigation.navigate('OtherProfile', { uid: item.id }) }}>
                <Image source={imageUri} style={styles.avatar} />
                <Text style={styles.friendName}>{item.username}</Text>
                <TouchableOpacity style={styles.addButton}>
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
                    <Text style={styles.header}>Add Friends </Text>
                    <TouchableOpacity style={{position:'absolute',right: 8,top:10}} onPress={()=>{navigation.navigate('FriendRequest')}}>
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
                    <TouchableOpacity onPress={() => { navigation.navigate("Home", { uid: uid, user: user }) }}>
                        <UserIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("Status", { uid: uid, user: user }) }}>
                        <StatusIcon />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("Call", { uid: uid, user: user }) }}>
                        <CallIcon />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <AddFriendIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

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
        fontSize: 15
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