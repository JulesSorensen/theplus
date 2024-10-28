import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GroupChatScreen = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Pour stocker les messages

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage(''); // Réinitialiser le champ de texte
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.chatContainer}>
                    <Text style={styles.chatTitle}>Chat global</Text>
                    <ScrollView contentContainerStyle={styles.chatContent}>
                        {messages.map((msg, index) => (
                            <Text key={index}>{msg}</Text>
                        ))}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Écrire un message"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Text style={styles.sendButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f0f0f5',
    },
    container: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        elevation: 3,
    },
    chatTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    chatContent: {
        paddingBottom: 60,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 5,
        borderRadius: 10,
    },
    messageInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default GroupChatScreen;
