import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Image,Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CallIcon from '../assets/SVG/CallIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import UserIcon from '../assets/SVG/UserIcon';
import AddFriendIcon from '../assets/SVG/AddFriendIcon';
import { useRoute } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../config';


const CallHistoryScreen = ({ navigation }) => {
  const route = useRoute();
  const [callHistory, setCallHistory] = useState([]);
  const { uid, user } = route.params;


  useEffect(() => {
    fetchUserHistory(uid)
  }, [])

  const fetchUserHistory = async (uid) => {
    try {
      const UserData = ref(database, `CallHistory/${uid}`);
      const snapshot = await get(UserData);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        formattedData.sort((a, b) =>  new Date(b.time) - new Date(a.time));
        setCallHistory(formattedData);
      } else {
        console.log("No Data");

      }
    } catch (error) {
      console.error("Error fetching user history: ", error);
    }
  };

  const makePhoneCall = (phoneNumber) => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          console.log('Phone number is not available');
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.log(err));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Example formatting
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    return date.toLocaleString('en-US', options);
  };

  const renderCallItem = ({ item }) => {
    MyCall = CurrentUser.username === item.From
    const imageUri = item.Profile ? { uri: item.Profile } : require('../assets/icon.png');

    const formattedDate = formatTimestamp(item.time);
    return (
      <TouchableOpacity style={styles.callContainer} onPress={() => { navigation.navigate('OtherProfile', { uid: item.FromUserId }) }}>
        {MyCall ? <MaterialIcons name="call-made" size={24} color="blue" /> : <MaterialIcons name="call-received" size={24} color="green" />}
        <View style={styles.callDetails}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={imageUri} style={styles.avatar} />
          <Text style={styles.callerName}>{item.From}</Text>
          </View>
          <Text style={styles.callTime}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => makePhoneCall(item.UserNumber)} >
        <MaterialIcons name="phone" size={24} color="#fff" style={styles.callIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center', paddingVertical: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingBottom: 15 }}>
          <Icon name='chevron-back-outline' size={25} color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.header}>Call History</Text>
      </View>
      {callHistory && <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callList}
      />}
      {!callHistory && <View style={styles.noHistoryContainer}>
        <MaterialCommunityIcons name='clock-outline' color={'#fff'} size={60} />
        <Text style={{ color: '#fff', paddingVertical: 20, fontSize: 15, fontFamily: 'Nunito' }}> Your Call History is Empty</Text>
        <Text style={styles.noHistoryText}> No Call History</Text>
      </View>}


      <View style={styles.BottomIcons}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <UserIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Status", { uid: uid, user: user }) }}>
          <StatusIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <CallIcon strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddFriend', { uid: uid, user: user })}>
          <AddFriendIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Lato'
  },
  callList: {
    paddingBottom: 16,
  },
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  callDetails: {
    flex: 1,
    marginLeft: 12,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Nunito'
  },
  callTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  callIcon: {
    marginLeft: 12,
  },
  BottomIcons: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    flexDirection: "row",
    width: '100%',
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3
  },
  noHistoryText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: "Lato"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
});

export default CallHistoryScreen;