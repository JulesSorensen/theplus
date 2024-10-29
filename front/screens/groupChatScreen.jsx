import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getGroupMesages, publishMessages } from '../services/messages';
import { getPseudoFromToken, getUser } from '../utils/authUtils';

const GroupChatScreen = () => {
    const route = useRoute();
    const { groupName, groupId } = route.params;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [myPseudo, setMyPseudo] = useState(null);
    const [user, setUser] = useState();

    const fetchPseudo = async () => {
        const userPseudo = await getPseudoFromToken();
        setMyPseudo(userPseudo);
    };

    const setupUser = async () => {
        const user = await getUser();
        setUser(user);
    };

    const fetchGroupMessages = async () => {
        try {
            const response = await getGroupMesages(groupId);
            setMessages(response);
            if (response.length == 0) { welcomeMessage() }
        } catch (error) {
            console.error("Erreur lors de la récupération des messages du groupe :", error);
        }
    };

    const welcomeMessage = async () => {
        try {
            const welcomeMessageData = {
                groupId: groupId,
                content: "Bienvenue dans le groupe !",
                user: {
                    name: "The+ bot",
                },
            };
            await publishMessages(welcomeMessageData);
            console.log('Message de bienvenue publié !')
        } catch (error) {
            console.error("Erreur lors de la création du groupe ou de la publication du message :", error);
        }
    };

    const handleSendMessage = async () => {
        if (messageInput.trim()) {
            const newMessageData = {
                groupId: groupId,
                content: messageInput,
                user: {
                    name: myPseudo,
                },
            };

            try {
                const response = await publishMessages(newMessageData);

                const newMessage = {
                    id: response.id,
                    content: response.content,
                    user: response.user,
                    type: "sent",
                };

                setMessages([...messages, newMessage]);
                setMessageInput("");
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    const renderMessage = ({ item }) => {
        const isFromMe = item.user.id === user.id;

        return (
            <View
                style={isFromMe ? styles.messageContainerSent : styles.messageContainer}
            >
                <Image
                    source={{
                        uri: `https://gravatar.com/avatar/${item.user?.hashedName}?s=200&d=wavatar`,
                    }}
                    style={isFromMe ? styles.myMessageAvatar : styles.messageAvatar}
                />
                <View
                    style={[
                        styles.messageBubble,
                        isFromMe ? styles.sentBubble : styles.receivedBubble,
                    ]}
                >
                    {!isFromMe && (
                        <Text style={styles.messageSender}>{item.user.name}</Text>
                    )}
                    <Text
                        style={
                            isFromMe ? styles.sentMessageText : styles.receivedMessageText
                        }
                    >
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    useEffect(() => {
        fetchGroupMessages();
        fetchPseudo();
        setupUser();
    }, []);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.chatContainer}>
                <Text style={styles.chatTitle}>{groupName}</Text>
                {messages !== undefined ? (
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.chatContent}
                    />
                ) : (
                    <Text>Loading</Text>
                )}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Écrire un message"
                        value={messageInput}
                        onChangeText={setMessageInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Envoyer</Text>
                    </TouchableOpacity>
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
    messageAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    myMessageAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 10,
    },
    messageContainer: {
        flexDirection: "row",
    },
    messageContainerSent: {
        flexDirection: "row-reverse",
    }
});

export default GroupChatScreen;
