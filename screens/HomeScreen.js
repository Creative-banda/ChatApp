import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { database, firestore } from '../config';
import { ref, get } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatAppHomePage = ({ navigation, uid }) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    initializingUsers();
    if (uid) {
      fetchUsername(uid);
    }
  }, [uid]);

  const initializingUsers = async () => {
    try {
      let rolesRef = ref(database, 'Users');
      const snapshot = await get(rolesRef);
      if (snapshot.exists()) {
        const rolesData = snapshot.val();
        const keys = Object.keys(rolesData);
        const usersList = keys.map(key => ({ id: rolesData[key].email, name: key, image: require('../assets/icon.png') }));
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
      const userDoc = doc(firestore, 'Users', uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ChatScreen", { chatId: item, name: { username } })}
      >
        <View style={styles.textContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={item.image} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
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
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          {username ?
            <Text style={styles.title}>Hii, {username}</Text> :
            <Text></Text>
          }
          <Icon name="gear" size={30} color="#ffffff" onPress={() => navigation.navigate('SettingPage')} style={styles.icon} />
        </View>
        <FlatList
          data={users}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
        
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
    marginTop:10
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
});

export default ChatAppHomePage;
