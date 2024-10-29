import React, { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    View,
    Pressable,
    StyleSheet,
} from "react-native";
import Toast from 'react-native-toast-message';
import { getInvits, setInvit } from "../services/invitation";


export default function Invitation() {

    const [invitsList, setInvitsList] = useState()

    const loadInvits = async () => {
        try {
            const allInvits = await getInvits()
            setInvitsList(allInvits)
        } catch (error) {

            Alert.alert(
                'Une erreur est survenue',
                formatErrorMessage(error),
                [
                    {
                        text: 'Compris',
                    },
                ],
                {
                    cancelable: true,
                },
            );
        }
    }

    const responseInvit = async (id, statut, action) => {
        await setInvit(id, statut)
        await loadInvits()
        showToast(action)
    }

    const showToast = (action) => {
        Toast.show({
            type: 'info',
            text1: `${action} confirmée`,
        });
    };

    const renderItem = ({ item }) => (
        <View>
            <Text>{item.sender.name} vous a invité dans le groupe {item.group.name}</Text>
            <View style={styles.containerButton}>
                <View>
                    <Pressable
                        style={[styles.button, styles.buttonValide]}
                        onPress={() => responseInvit(item.id, 200, "Validation")}>
                        <Text>V</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable
                        style={[styles.button, styles.buttonRefus]}
                        onPress={() => responseInvit(item.id, 300, "Suppression")}>
                        <Text>X</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

    useEffect(() => {
        loadInvits()
    }, [])

    if (!invitsList) { return <></> }

    return (
        <FlatList
            data={invitsList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );

}

const styles = StyleSheet.create({
    containerButton: {
        flexDirection: "row",
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonValide: {
        color: "white",
        textAlign: 'center',
        backgroundColor: 'green'
    },
    buttonRefus: {
        color: "white",
        textAlign: 'center',
        backgroundColor: 'red'
    }

})

