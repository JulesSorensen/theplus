import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Chat } from '../components/Chat';
import { getUser } from '../utils/authUtils';

const GroupChatScreen = () => {
    const route = useRoute();
    const { groupName, groupId } = route.params;
    const [user, setUser] = useState(null);

    const setupUser = async () => {
        const user = await getUser();
        setUser(user);
    };

    useEffect(() => {
        setupUser();
    }, []);

    if (!user) return <Text>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.chatContainer}>
                <Chat
                    title={groupName}
                    user={user}
                    groupId={groupId}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f0f0f5',
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
});

export default GroupChatScreen;
