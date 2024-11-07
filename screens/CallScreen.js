// React and React Native core imports
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';

// Firebase imports
import { database } from '@config';
import { ref, get } from 'firebase/database';

// Context
import { AppContext } from '@context/AppContext';

// Icons
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// SVG Components
import UserIcon from '@assets/SVG/UserIcon';
import CallIcon from '@assets/SVG/CallIcon';
import StatusIcon from '@assets/SVG/StatusIcon';
import AddFriendIcon from '@assets/SVG/AddFriendIcon';


const CallHistoryScreen = ({ navigation }) => {
  const [callHistory, setCallHistory] = useState([]);
  const { userUid } = useContext(AppContext);




  useEffect(() => {
    fetchUserHistory(userUid)
  }, [])

  const fetchUserHistory = async (userUid) => {
    try {
      const UserData = ref(database, `CallHistory/${userUid}`);
      
      const snapshot = await get(UserData);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        formattedData.sort((a, b) => new Date(b.time) - new Date(a.time));



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
    const isCurrentUser = userUid === item.senderuid;
    let profilePic = '';
    let name = '';

    if (isCurrentUser) {
        profilePic = item.receiverprofile;
        name = item.receiverusername;
    } else {
        profilePic = item.senderprofile;
        name = item.senderusername;
    }

    const imageUri = profilePic ? { uri: profilePic } : require('../assets/icon.png');
    const formattedDate = formatTimestamp(item.time);

    return (
        <TouchableOpacity
            style={styles.callContainer}
            onPress={() => navigation.navigate('OtherProfile', { userUid: isCurrentUser ? item.receiveruid : item.senderuid })}
        >
            {isCurrentUser ? (
                <MaterialIcons name="call-made" size={24} color="green" />
            ) : (
                <MaterialIcons name="call-received" size={24} color="blue" />
            )}
            <View style={styles.callDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={imageUri} style={styles.avatar} />
                    <Text style={styles.callerName}>{name}</Text>
                </View>
                <Text style={styles.callTime}>{formattedDate}</Text>
            </View>
            <TouchableOpacity onPress={() => makePhoneCall(item.UserNumber)}>
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
      {callHistory.length != 0 && <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callList}
      />}
      {callHistory.length == 0 && <View style={styles.noHistoryContainer}>
        <MaterialCommunityIcons name='clock-outline' color={'#fff'} size={60} />
        <Text style={{ color: '#fff', paddingVertical: 20, fontSize: 15, fontFamily: 'Nunito' }}> Your Call History is Empty</Text>
        <Text style={styles.noHistoryText}> No Call History</Text>
      </View>}


      <View style={styles.BottomIcons}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <UserIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Status") }}>
          <StatusIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <CallIcon strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddFriend')}>
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
