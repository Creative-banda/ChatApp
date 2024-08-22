import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { database } from '../config';
import { ref, get } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserIcon from '../assets/SVG/UserIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import CallIcon from '../assets/SVG/CallIcon';
import AddFriendIcon from '../assets/SVG/AddFriendIcon';

const ChatAppHomePage = ({ navigation, uid, email }) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [UserInfo, SetUserInfo] = useState('');

  useEffect(() => {
    initializingUsers();
    if (uid) {
      fetchUsername(uid);
    }
  }, [uid]);

  const initializingUsers = async () => {
    try {
      let UserData = ref(database, 'Users');
      const snapshot = await get(UserData);
      if (snapshot.exists()) {
        const UserData = snapshot.val();
        const keys = Object.keys(UserData);
        const usersList = keys.map(key => ({ id: UserData[key].email, name: key, image: UserData[key].ProfilePic, username: UserData[key].username, Phone : UserData[key].PhoneNumber }));
        setUsers(usersList);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };


  const fetchUsername = async (uid) => {
    try {
      let UserData = ref(database, `Users/${uid}`);
      const snapshot = await get(UserData);
      if (snapshot.exists()) {
        CurrentUser = snapshot.val()
        setUsername(CurrentUser.username)
        SetUserInfo(CurrentUser)
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };
  
  const renderChatItem = ({ item }) => {
    if (!item || !item.id || !item.username) {
      return null; 
    }
  
    if (item.id === email) {
      return null; 
    }
    
  
    const imageUri = item.image && item.image !== ''? { uri: item.image } : require('../assets/icon.png');
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ChatScreen", { chatId: item, name: UserInfo })}
      >
        <View style={styles.textContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={imageUri} style={styles.avatar} />
            <Text style={styles.name}>{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (

    <ImageBackground
      source={require('../assets/Images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="stretch"

    >

      <View style={styles.container}>
        {users.length === 1 && <Text style={{position:'absolute', color:'#fff',fontSize:18 ,top:'50%', fontFamily:'Nunito', alignSelf:'center'}}>Sorry No User Is There 😥</Text>}
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          {username ?
            <Text style={styles.title}>Hii, {username}</Text> :
            <Text></Text>
          }
          <Icon name="gear" size={30} color="#ffffff" onPress={() => navigation.navigate('SettingPage', { uid: uid, user: UserInfo })} style={styles.icon} />
        </View>
        <FlatList
          data={users}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />


        <View style={styles.BottomIcons}>
          <TouchableOpacity>
            <UserIcon strokeWidth={0}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate("Status", { uid: uid, user: UserInfo }) }}>
            <StatusIcon  />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate("Call", { uid: uid, user: UserInfo }) }}>
            <CallIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate("AddFriend", { uid: uid, user: UserInfo }) }}>
            <AddFriendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,

  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  icon: {
    marginRight: 10,
    marginTop: 10
  },


  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Lato',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    padding: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Lato',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: '#8F8F8E',
    borderTopEndRadius: 40,
    borderBottomEndRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Nunito',

  },
  message: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
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

export default ChatAppHomePage;
