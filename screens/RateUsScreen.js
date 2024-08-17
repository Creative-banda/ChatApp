import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, get, set, update } from 'firebase/database';
import { database } from '../config';
import { useRoute } from '@react-navigation/native';

const RateUsScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const navigation = useNavigation();
    const [Isloading, SetLoading] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const route = useRoute();
    const { uid } = route.params;

    const handleRating = (newRating) => {
        setRating(newRating);
        Animated.spring(animation, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };
    const handleSubmit = async () => {
        if (rating === 0) {
            SetLoading(true);
            Alert.alert('Rating Required', 'Please provide a rating before submitting.');
            return;
        }
            const newMessage = {
                Stars: rating,
                Comment: feedback,
            };

            try {
                const userRatingRef = ref(database, `Rating/${uid}`);
                
                const snapshot = await get(userRatingRef);
                
                if (snapshot.exists()) {
                    // Update existing rating
                    await update(userRatingRef, newMessage);
                } else {
                    // Create new rating
                    await set(userRatingRef, newMessage);
                }
                
                Alert.alert('Thank You!', 'Your feedback has been submitted.');
                setRating(0);
                setFeedback('');
                navigation.goBack();
            } catch (error) {
                console.error("Error sending message: ", error);
            } finally {
                SetLoading(false);
            }
        }

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleRating(i)}>
                    <Animated.Text
                        style={[
                            i <= rating ? styles.selectedStar : styles.star,
                            { transform: [{ scale: i <= rating ? animation : 1 }] }
                        ]}
                    >
                        ★
                    </Animated.Text>
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <LinearGradient
            colors={['#333333', '#222222', '#111111']}
            style={styles.container}
        >
            <Text style={styles.header}>Rate Your Experience</Text>
            <View style={styles.card}>
                <View style={styles.starContainer}>{renderStars()}</View>
                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Share your thoughts with us..."
                    placeholderTextColor="#AAA"
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>

                    {!Isloading ?
                        <Text style={styles.submitButtonText}>Submit Feedback</Text> : 
                        <ActivityIndicator size='small'/>}
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    star: {
        fontSize: 48,
        color: '#D1D1D1',
        marginHorizontal: 8,
    },
    selectedStar: {
        fontSize: 48,
        color: '#FFD700',
        marginHorizontal: 8,
    },
    feedbackInput: {
        width: '100%',
        height: 120,
        backgroundColor: '#fff',
        color: '#333',
        padding: 15,
        borderRadius: 15,
        marginTop: 16,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
    },
    submitButton: {
        width:'80%',
        marginTop: 30,
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RateUsScreen;