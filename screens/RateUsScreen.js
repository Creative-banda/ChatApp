import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RateUsScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const navigation = useNavigation();

    const handleRating = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please provide a rating before submitting.');
            return;
        }
        console.log('Rating:', rating);
        console.log('Feedback:', feedback);

        Alert.alert('Thank You!', 'Your feedback has been submitted.');
        setRating(0);
        setFeedback('');
        navigation.goBack();
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleRating(i)}>
                    <Text style={i <= rating ? styles.selectedStar : styles.star}>★</Text>
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rate Us</Text>
            <View style={styles.starContainer}>{renderStars()}</View>
            <TextInput
                style={styles.feedbackInput}
                placeholder="Leave your feedback here..."
                placeholderTextColor="#AAA"
                multiline
                value={feedback}
                onChangeText={setFeedback}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 20,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    star: {
        fontSize: 32,
        color: '#888',
        marginHorizontal: 4,
    },
    selectedStar: {
        fontSize: 32,
        color: '#FFD700',
        marginHorizontal: 4,
    },
    feedbackInput: {
        width: '100%',
        height: 120,
        backgroundColor: '#1e1e1e',
        color: '#fff',
        padding: 15,
        borderRadius: 12,
        marginTop: 16,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#6a11cb',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default RateUsScreen;
