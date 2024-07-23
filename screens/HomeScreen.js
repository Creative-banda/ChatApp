import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { database, firestore } from '../config';
import { ref, get } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

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
        onPress={() => navigation.navigate("ChatScreen", { chatId: item})}
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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('Login'); 
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        {username ?
          <Text style={styles.title}>Hii, {username}</Text> : 
          <Text></Text>
        }
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    padding: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
    fontWeight: 'bold',
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
});

export default ChatAppHomePage;
