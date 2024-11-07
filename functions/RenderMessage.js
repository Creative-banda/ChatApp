import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";

const formatTimeOnly = (timestamp) => {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
};

const RenderMessage = ({ item, handleSingleClick, toggleSelectionMode, selectedItems, name }) => {

    // Ensure name and selectedItems are passed correctly
    const isMyMessage = item.from.trim().toLowerCase() === name.id.trim().toLowerCase();
    const isSelected = selectedItems.includes(item.id);
    const isImage = item.messageType === 'image';

    const timeing = formatTimeOnly(item.time);

    return (
        <View
            style={[
                isImage ? styles.imageContainer : styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.otherMessage,
                isSelected && styles.selectedMessage
            ]}
        >
            <TouchableOpacity
                onLongPress={() => toggleSelectionMode(item.id, item.message, item.messageType)}
                onPress={() => handleSingleClick(item)}
            >
                {item.messageType === "text" ? (
                    <Text style={[styles.messageText, isSelected && styles.selectedMessageText]}>
                        {item.message}
                    </Text>
                ) : (
                    <Image source={{ uri: item.message }} style={styles.image} />
                )}
            </TouchableOpacity>
            <Text style={styles.timestamp}>{timeing}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    messageContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        paddingRight: 50
    },
    messageText: {
        fontSize: 17,
        color: '#000000',
        fontFamily: 'Nunito',
    },
    selectedMessage: {
        backgroundColor: '#E09D90',
    },
    selectedMessageText: {
        color: '#000',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover'

    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#CBC3E3',
        padding: 7,
        marginVertical: 5,
        maxWidth: '75%',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 20,
        paddingLeft: 20,
        paddingBottom: 15
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 3,
        paddingHorizontal: 20,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 20,
        marginVertical: 5,
        paddingTop: 10,
        maxWidth: '75%',
        fontSize: 16,
        paddingBottom: 15
    },
    timestamp: {
        fontSize: 12,
        position: 'absolute',
        bottom: 0,
        right: 5,
    },
});

export default RenderMessage;
