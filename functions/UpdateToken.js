import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set } from 'firebase/database';


const updateToken = async (user) => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("expoPushToken");
  
      if (token) {
        const database = getDatabase();
        // Create a reference to the user's token path
        const userRef = ref(database, `Users/${user.uid}/token`);
  
        // Update the token in the database
        await set(userRef, token);
  
        console.log("Token updated successfully");
      } else {
        console.log("Token not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error updating token:", error);
    }
  };

export default updateToken;