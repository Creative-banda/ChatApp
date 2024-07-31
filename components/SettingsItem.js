import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const SettingsItem = ({ title, IconName, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Icon name={IconName} size={20} color="rgba(255, 255, 255, 0.8)" style={styles.icon}/>
            <Text style={styles.title}>{title}</Text>
            <Icon name="right" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.secondIcon}/>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop:40,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.8)',
        paddingBottom: 10,
        
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    icon: {
        marginRight: 20,
    },
    secondIcon: {
        position: 'absolute',
        right: 10,
    },
});

export default SettingsItem;
