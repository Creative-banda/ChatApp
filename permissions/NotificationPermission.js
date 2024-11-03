import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const NotificationPermission = () => {
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      // Check if a token is already stored
      const storedToken = await AsyncStorage.getItem('expoPushToken');
      if (storedToken) {
        console.log('Expo Push Token already stored:', storedToken);
        return;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // If permissions are not granted, exit
      if (finalStatus !== 'granted') {
        console.log('Notification permissions denied');
        return;
      }

      // Fetch the Expo Push Token
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        console.error('Project ID not found');
        return;
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log('Expo Push Token:', token);

      // Store the token in AsyncStorage
      await AsyncStorage.setItem('expoPushToken', token);
    } catch (error) {
      console.error('Error checking or requesting notification permissions:', error);
    }
  };

  return null;
};

export default NotificationPermission;
