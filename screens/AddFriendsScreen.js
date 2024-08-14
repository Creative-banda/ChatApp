import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import UserIcon from '../assets/SVG/UserIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import CallIcon from '../assets/SVG/CallIcon'
import AddFriendIcon from '../assets/SVG/AddFriendIcon';

const dummyFriends = [
    { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '4', name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: '5', name: 'Chris Wilson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: '6', name: 'Anna Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: '7', name: 'David Lee', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: '8', name: 'Laura Martinez', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: '9', name: 'James Garcia', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: '10', name: 'Samantha Miller', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: '11', name: 'Andrew Clark', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { id: '12', name: 'Olivia Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { id: '13', name: 'Daniel Lewis', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: '14', name: 'Sophia Walker', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { id: '15', name: 'Matthew Hall', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { id: '16', name: 'Isabella Young', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { id: '17', name: 'Anthony King', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { id: '18', name: 'Mia Hernandez', avatar: 'https://randomuser.me/api/portraits/women/9.jpg' },
    { id: '19', name: 'Joshua Wright', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: '20', name: 'Abigail Lopez', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
];

const AddFriendsScreen = ({navigation}) => {
    const route = useRoute();
    const { uid,user } = route.params;

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity style={styles.friendItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.friendName}>{item.name}</Text>
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Friend +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={require('../assets/Images/AddFriendBackground.jpg')} style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <View style={styles.holder}>
                <View style={styles.Uppercontainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='chevron-back-outline' size={25} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Add Friends </Text>
                </View>
                <FlatList
                    data={dummyFriends}
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
        flexDirection: "row",
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    }

});

export default AddFriendsScreen;