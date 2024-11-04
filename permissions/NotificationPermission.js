import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationPermission = () => {
  useEffect(() => {
    const checkNotificationPermission = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('expoPushToken');
        if (storedToken) {
          console.log('Expo Push Token already stored:', storedToken);
          return;
        }

        const { status: currentStatus } = await Notifications.getPermissionsAsync();
        const { status } = currentStatus !== 'granted'
          ? await Notifications.requestPermissionsAsync()
          : { status: currentStatus };

        if (status !== 'granted') {
          console.log('Notification permissions denied');
          return;
        }

        const  token = await Notifications.getExpoPushTokenAsync({
          projectId: "882adba4-e0f7-44e8-98ed-b085d0bc231a"
        });

        console.log('Expo Push Token:', token.data);
        await AsyncStorage.setItem('expoPushToken', token.data);
      } catch (error) {
        console.error('Error checking or requesting notification permissions:', error);
      }
    };

    checkNotificationPermission();
  }, []);

  return null;
};

export default NotificationPermission;