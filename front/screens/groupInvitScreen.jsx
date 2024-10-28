import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GroupInvitScreen = ({ route }) => {
    const { groupName, onGroupCreated } = route.params; // Récupérer la fonction de suppression du groupe
    const navigation = useNavigation();

    const [users, setUsers] = useState([
        { id: '1', username: 'Alice' },
        { id: '2', username: 'Bob' },
        { id: '3', username: 'Charlie' },
        { id: '4', username: 'David' },
        { id: '5', username: 'Eve' },
    ]);
    const [searchText, setSearchText] = useState('');
    const [invitedUsers, setInvitedUsers] = useState([]);

    useEffect(() => {
        // Lorsque le composant est démonté, appeler la fonction onGroupCreated pour supprimer le groupe
        return () => {
            if (onGroupCreated) {
                onGroupCreated();
            }
        };
    }, [onGroupCreated]);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
    );

    const addUser = (user) => {
        if (!invitedUsers.some(invitedUser => invitedUser.id === user.id)) {
            setInvitedUsers([...invitedUsers, user]);
        }
    };

    const removeUser = (userId) => {
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    };

    const createGroupChat = () => {
        // Logique pour créer le groupe et naviguer vers l'écran de chat de groupe
        navigation.navigate('GroupChat', { groupName: groupName, members: invitedUsers });
    };

    const confirmExit = () => {
        Alert.alert(
            "Confirmation",
            "Si vous quittez, le groupe ne sera pas créé. Êtes-vous sûr de vouloir continuer?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Quitter",
                    onPress: () => {
                        if (onGroupCreated) {
                            onGroupCreated(); // Appeler la fonction pour supprimer le groupe
                        }
                        navigation.navigate('Home'); // Naviguer vers HomeScreen après la suppression
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Personnaliser l'en-tête
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={confirmExit} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✖</Text> 
                </TouchableOpacity>
            ),
            headerTitle: () => <Text style={styles.headerTitle}>{groupName}</Text>,
            headerBackVisible: false,
        });
    }, [navigation]);

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
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.username}>{item.username}</Text>
                        <TouchableOpacity onPress={() => addUser(item)} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Text style={styles.invitedTitle}>Utilisateurs invités :</Text>
            {invitedUsers.length > 0 ? (
                <FlatList
                    data={invitedUsers}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.invitedUserItem}>
                            <Text style={styles.invitedUsername}>{item.username}</Text>
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
                <TouchableOpacity onPress={createGroupChat} style={styles.createButton}>
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
