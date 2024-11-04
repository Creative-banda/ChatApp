import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../config';
import { ref, get, set } from 'firebase/database';
import { AppContext } from '../AppContext';

const NotificationSettingsScreen = () => {
  // Feed Notifications
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [storyUpdate, setStoryUpdate] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState(false);

  // Social/Connection Notifications
  const [newFriendRequest, setNewFriendRequest] = useState(false);
  const [acceptedFriendRequest, setAcceptedFriendRequest] = useState(false);

  // Activity and Security Notifications
  const [profileViewed, setProfileViewed] = useState(false);

  // Loading User Notification Settings

  const { userUid } = useContext(AppContext);

  useEffect(() => {
    fetchingSettings();
  }, []);

  const fetchingSettings = async () => {
    const currentuserRef = ref(database, `Notification_Info/${userUid}`);
    const friendSnapshot = await get(currentuserRef)

    if (friendSnapshot.exists()) {      
      const userData = friendSnapshot.val();

      setStatusUpdate(userData[0].Status);
      setStoryUpdate(userData[0].Story);
      setMessageUpdate(userData[0].Message);
      setNewFriendRequest(userData[0].New_Friend_Requests);
      setAcceptedFriendRequest(userData[0].Accepted_Friend_Requests);
      setProfileViewed(userData[0].ProfileViewed);
    }    
  };

  useEffect(() => {
    updatePermissions();
  }
  , [statusUpdate, storyUpdate, messageUpdate, newFriendRequest, acceptedFriendRequest, profileViewed]);

  const updatePermissions = async () => {
    try {
      await set(ref(database, `Notification_Info/${userUid}`), [
        { Status: statusUpdate, Story: storyUpdate, Message: messageUpdate, New_Friend_Requests: newFriendRequest, Accepted_Friend_Requests: acceptedFriendRequest, ProfileViewed: profileViewed }]);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const SettingItem = ({ label, value, onValueChange, iconName }) => (
    <View style={styles.setting}>
      <View style={styles.labelContainer}>
        <Icon name={iconName} size={22} color="#7047EB" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#4a4a4a', true: '#7047EB' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#4a4a4a"
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Notification Settings</Text>
        </View>

        {/* Feed Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="newspaper-variant-outline" size={24} color="#7047EB" />
            <Text style={styles.sectionTitle}>Feed Notifications</Text>
          </View>
          <View style={styles.sectionContent}>

            <SettingItem
              label="Story Updates"
              value={storyUpdate}
              onValueChange={setStoryUpdate}
              iconName="book-outline"
            />
            <SettingItem
              label="Message Updates"
              value={messageUpdate}
              onValueChange={setMessageUpdate}
              iconName="message-text-outline"
            />
          </View>
        </View>

        {/* Social/Connection Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="account-group-outline" size={24} color="#7047EB" />
            <Text style={styles.sectionTitle}>Social Notifications</Text>
          </View>
          <View style={styles.sectionContent}>
            <SettingItem
              label="New Friend Requests"
              value={newFriendRequest}
              onValueChange={setNewFriendRequest}
              iconName="account-plus-outline"
            />
            <SettingItem
              label="Accepted Friend Requests"
              value={acceptedFriendRequest}
              onValueChange={setAcceptedFriendRequest}
              iconName="account-check-outline"
            />
          </View>
        </View>

        {/* Activity and Security Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shield-outline" size={24} color="#7047EB" />
            <Text style={styles.sectionTitle}>Activity & Security</Text>
          </View>
          <View style={styles.sectionContent}>
            <SettingItem
              label="Profile Viewed"
              value={profileViewed}
              onValueChange={setProfileViewed}
              iconName="eye-outline"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
});

export default NotificationSettingsScreen;