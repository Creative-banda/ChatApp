import React from 'react';
import { StyleSheet, View,Text } from 'react-native';

const FriendRequestScreen = () => {
    return (
        <View style={styles.container}>
            <Text>FriendRequest Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default FriendRequestScreen;
