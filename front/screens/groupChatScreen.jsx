import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Chat } from '../components/Chat';
import { getUser } from '../utils/authUtils';

const GroupChatScreen = () => {
    const route = useRoute();
    const { groupName, groupId, groupUsers } = route.params;
    const [user, setUser] = useState(null);


    const parsedGroupUsers = JSON.parse(groupUsers);

    const setupUser = async () => {
        const user = await getUser();
        setUser(user);
    };

    useEffect(() => {
        setupUser();
    }, []);

    const showGroupUsers = () => {
        if (!parsedGroupUsers || parsedGroupUsers.length === 0) {
            Alert.alert('Membres du groupe', 'Aucun utilisateur trouvé');
            return;
        }

        const admins = parsedGroupUsers.filter((groupUser) => groupUser.isAdmin);
        const regularMembers = parsedGroupUsers.filter((groupUser) => !groupUser.isAdmin);

        const adminNames = admins.map((admin) => admin.user.name).join(', ');
        const memberNames = regularMembers.map((member) => member.user.name).join(', ');

        let alertMessage = '';
        if (adminNames) {
            alertMessage += `Administrateurs: ${adminNames}\n\n`;
        }
        if (memberNames) {
            alertMessage += `Membres: ${memberNames}`;
        }

        Alert.alert('Membres du groupe', alertMessage);
    };


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
            <TouchableOpacity onPress={showGroupUsers} style={styles.userButton}>
                <Text style={styles.userButtonText}>👤</Text>
            </TouchableOpacity>
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
    userButton: {
        position: 'absolute',
        top: 45,
        right: 35,
    },
    userButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default GroupChatScreen;
