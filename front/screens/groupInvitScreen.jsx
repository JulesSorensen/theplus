import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createGroup, createInvit } from '../services/groups';
import { getUsers } from '../services/users'
import { sendError } from '../utils/errors';

const GroupInvitScreen = ({ route }) => {
    const { groupName, onGroupCreated } = route.params;
    const navigation = useNavigation();

    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [invitedUsers, setInvitedUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
                console.log(users)
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        return () => {
            if (onGroupCreated) {
                onGroupCreated();
            }
        };
    }, [onGroupCreated]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const addUser = (user) => {
        if (!invitedUsers.some(invitedUser => invitedUser.id === user.id)) {
            setInvitedUsers([...invitedUsers, user]);
        }
    };

    const removeUser = (userId) => {
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    };

    const createGroupAndInviteUsers = async () => {
        try {
            const newGroup = await createGroup({ name: groupName });
            const groupId = newGroup.id;

            const userIds = invitedUsers.map(user => user.id);
            await createInvit({ userIds, groupId });

            navigation.replace('GroupChat', { groupName: groupName, groupId: groupId });
        } catch (error) {
            sendError(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{groupName}</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un utilisateur"
                value={searchText}
                onChangeText={setSearchText}
            />

            <FlatList
                style={styles.userList}
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.username}>{item.name}</Text>
                        <TouchableOpacity onPress={() => addUser(item)} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Text style={styles.invitedTitle}>Utilisateurs invités :</Text>
            {invitedUsers.length > 0 ? (
                <FlatList
                    style={styles.invitedUserList}
                    data={invitedUsers}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.invitedUserItem}>
                            <Text style={styles.invitedUsername}>{item.name}</Text>
                            <TouchableOpacity onPress={() => removeUser(item.id)} style={styles.removeButton}>
                                <Text style={styles.removeButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noInvitedText}>Aucun utilisateur invité.</Text>
            )}

            {invitedUsers.length > 0 && (
                <TouchableOpacity onPress={createGroupAndInviteUsers} style={styles.createButton}>
                    <Text style={styles.createButtonText}>Créer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    userList: {
        maxHeight: '40%',
    },
    invitedUserList: {
        maxHeight: '40%',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    username: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#6200ee',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    invitedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    invitedUserItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    invitedUsername: {
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#f44336',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noInvitedText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
    createButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeButton: {
        marginLeft: 15,
    },
    closeButtonText: {
        fontSize: 30,
        color: '#6200ee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default GroupInvitScreen;
