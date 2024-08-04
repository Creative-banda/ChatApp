import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CallIcon from '../assets/SVG/CallIcon';
import StatusIcon from '../assets/SVG/StatusIcon';
import UserIcon from '../assets/SVG/UserIcon';

const callHistory = [
  { id: '1', name: 'John Doe', type: 'missed', time: '2h ago' },
  { id: '2', name: 'Jane Smith', type: 'incoming', time: '5h ago' },
  { id: '3', name: 'Mike Johnson', type: 'outgoing', time: '1d ago' },
];

const CallHistoryScreen = ({navigation}) => {
  const renderCallTypeIcon = (type) => {
    switch (type) {
      case 'missed':
        return <MaterialIcons name="call-missed" size={24} color="red" />;
      case 'incoming':
        return <MaterialIcons name="call-received" size={24} color="green" />;
      case 'outgoing':
        return <MaterialIcons name="call-made" size={24} color="blue" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Call History</Text>
      <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.callContainer}>
            {renderCallTypeIcon(item.type)}
            <View style={styles.callDetails}>
              <Text style={styles.callerName}>{item.name}</Text>
              <Text style={styles.callTime}>{item.time}</Text>
            </View>
            <MaterialIcons name="phone" size={24} color="#fff" style={styles.callIcon} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callList}
      />
      <View style={styles.BottomIcons}>
          <TouchableOpacity onPress={()=>{navigation.navigate("Home")}}>
            <UserIcon />
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=>{navigation.navigate("Status")}}>
            <StatusIcon />
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=>{navigation.navigate("Call")}}>
            <CallIcon />
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
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
    position:'absolute',
    bottom:10,
    left:15,
    flexDirection: "row",
    width:'100%',
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }
});

export default CallHistoryScreen;
