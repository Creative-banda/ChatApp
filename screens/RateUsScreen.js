import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, get, set, update } from 'firebase/database';
import { database } from '@config';
import { useRoute } from '@react-navigation/native';

const RateUsScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const route = useRoute();
    const { uid } = route.params;
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

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
            Alert.alert('Rating Required', 'Please provide a rating before submitting.');
            return;
        }
        
        setLoading(true);

        const newMessage = {
            Stars: rating,
            Comment: feedback,
        };

        try {
            const userRatingRef = ref(database, `Rating/${uid}`);

            const snapshot = await get(userRatingRef);

            if (snapshot.exists()) {
                await update(userRatingRef, newMessage);
            } else {
                await set(userRatingRef, newMessage);
            }

            Alert.alert('Thank You!', 'Your feedback has been submitted.');
            setRating(0);
            setFeedback('');
            navigation.goBack();
        } catch (error) {
            console.error("Error sending message: ", error);
        } finally {
            setLoading(false);
        }
    };

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
        <LinearGradient colors={['#ffffff', '#f7f7f7']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={
                        styles.container
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={require('../assets/Images/feedback-image.png')} style={styles.headerImage} />

                    <Text style={styles.header}>Your opinion matters to us!</Text>
                    <Text style={styles.subHeader}>
                        We work super hard to serve you better and would love to know how would you rate our app?
                    </Text>

                    <View style={styles.starContainer}>{renderStars()}</View>

                    <TextInput
                        ref={inputRef}
                        style={[styles.feedbackInput, { marginBottom: keyboardHeight > 0 ? 10 : 20 }]}
                        placeholder="Share your thoughts with us..."
                        placeholderTextColor="#AAA"
                        multiline
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { marginBottom: keyboardHeight > 0 ? keyboardHeight + 60 : 40 },
                        ]}
                        onPress={handleSubmit}
                    >
                        {!isLoading ? (
                            <Text style={styles.submitButtonText}>Submit</Text>
                        ) : (
                            <ActivityIndicator size="small" color="#fff" />
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    headerImage: {
        width: '80%',
        height: "40%",
        marginBottom: 20,
        marginTop: '20%'
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Lato',
    },
    subHeader: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Nunito',
        lineHeight: 22,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    star: {
        fontSize: 36,
        color: '#D1D1D1',
        marginHorizontal: 4,
    },
    selectedStar: {
        fontSize: 36,
        color: '#FFD700',
        marginHorizontal: 4,
    },
    feedbackInput: {
        width: '100%',
        minHeight: 100,
        backgroundColor: '#f8f8f8',
        color: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        fontFamily: 'Nunito',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lato',
    },
});

export default RateUsScreen;