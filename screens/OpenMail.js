import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { openInbox } from 'react-native-email-link'
import * as IntentLauncher from 'expo-intent-launcher';

const OpenMail = ({ navigation }) => {

    const openMail = async () => {
        if (Platform.OS === "ios") {
          try {
            await openInbox({ title: "Open mail app" });
          } catch (error) {
            console.error(`OpenEmailbox > iOS Error > ${error}`);
          }
        }
      
        if (Platform.OS === "android") {
          const activityAction = "android.intent.action.MAIN";
          const intentParams = {
            category: "android.intent.category.APP_EMAIL",
          };
          IntentLauncher.startActivityAsync(activityAction, intentParams);
        }
      }


    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <View style={styles.iconHolder}>
                    <MaterialCommunityIcons name='email' size={50} color="#673fd2" />
                </View>
                <Text style={styles.header}>Check Your Mail</Text>
                <Text style={styles.subHeader}>We've sent you a verification link</Text>
                <Text style={styles.subHeader}>Please check your inbox</Text>

                <TouchableOpacity style={styles.button} onPress={openMail}>
                    <Text style={styles.buttonText}>Open Email App</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.laterText}>Skip, I'll confirm later</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.lowerContainer}>
                <Text style={styles.notReceivetext}>Didn't receive the email? Check your Spam</Text>
                <View style={styles.resendContainer}>
                    <Text style={styles.normalText}>or </Text>
                    <TouchableOpacity onPress={()=>navigation.navigate("ForgetPassword")}>
                        <Text style={styles.resendText}>try another email address</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '40%',
        paddingHorizontal: 20,
        backgroundColor: '#112A46',
        alignItems: 'center',
    },
    upperContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    iconHolder: {
        backgroundColor: 'rgba(103,63,210,0.1)',
        padding: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 26,
        fontFamily: 'Lato',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#ACC8E5',
    },
    subHeader: {
        fontSize: 16,
        fontFamily: 'Nunito',
        textAlign: 'center',
        color: '#ACC8E5',
        marginBottom: 5,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#673fd2',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#ACC8E5',
        fontFamily: 'Lato',
    },
    laterText: {
        marginTop: 20,
        fontSize: 16,
        fontFamily: 'Lato',
        color: '#ACC8E5',
        textDecorationLine: 'underline',
    },
    lowerContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notReceivetext: {
        fontSize: 16,
        fontFamily: 'Nunito',
        color: '#ACC8E5',
        textAlign: 'center',
        marginBottom: 10,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    normalText: {
        fontSize: 16,
        color: '#ACC8E5',
    },
    resendText: {
        fontSize: 16,
        color: '#673fd2',
        textDecorationLine: 'underline',
    }
});

export default OpenMail;
