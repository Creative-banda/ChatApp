import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './config';
import * as Font from 'expo-font';
import ChatAppHomePage from './screens/HomeScreen';
import LoginPage from './screens/LoginPage';
import ChatScreen from './screens/ChatScreen';
import SignUp from './screens/SignUp';
import SettingPage from './screens/SettingPage';
import Profile from './screens/Profile';
import CallScreen from './screens/CallScreen';
import StatusScreen from './screens/StatusScreen';
<<<<<<< HEAD
import RateUsScreen from './screens/RateUsScreen';
=======
import Forgetpassword from './screens/Forgetpassword'
import OtherProfile from './screens/OtherProfile'
import AddFriendsScreen from './screens/AddFriendsScreen';
<<<<<<< HEAD
>>>>>>> 8b2e5012b02bdfae41864a39ad5cd419048431be
=======
import RateUsScreen from './screens/RateUsScreen'
import { AppProvider } from './AppContext';
>>>>>>> 8217a0e4d7f8370530f4d95d67a7566fca6bded6

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Lato': require('./assets/Fonts/Lato-Bold.ttf'),
        'Nunito': require('./assets/Fonts/Nunito.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <StatusBar color='dark'/>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <ChatAppHomePage {...props} uid={user ? user.uid : null} user={user} email={user ? user.email : null} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="SettingPage" component={SettingPage} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
<<<<<<< HEAD
        <Stack.Screen name="RateUs" component={RateUsScreen} />
=======
        <Stack.Screen name="ForgetPassword" component={Forgetpassword} />
        <Stack.Screen name="OtherProfile" component={OtherProfile} />
        <Stack.Screen name="AddFriend" component={AddFriendsScreen} />
>>>>>>> 8b2e5012b02bdfae41864a39ad5cd419048431be
      </Stack.Navigator>
    </NavigationContainer>
=======
    <AppProvider uid={user ? user.uid : null}>
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName={user ? "Home" : "Login"}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="Home">
            {(props) => <ChatAppHomePage {...props} uid={user ? user.uid : null} user={user} email={user ? user.email : null} />}
          </Stack.Screen>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="SettingPage" component={SettingPage} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="Call" component={CallScreen} />
          <Stack.Screen name="ForgetPassword" component={Forgetpassword} />
          <Stack.Screen name="OtherProfile" component={OtherProfile} />
          <Stack.Screen name="AddFriend" component={AddFriendsScreen} />
          <Stack.Screen name="RateUs" component={RateUsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
>>>>>>> 8217a0e4d7f8370530f4d95d67a7566fca6bded6
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000'
  },
});

export default App;