import React, { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    View
} from "react-native";
import { getInvits } from "../services/invitation";


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

    const renderItem = ({ item }) => (
        <View>
            <Text>
                <Text>{item.sender.name} vous a invité dans le groupe {item.group.name}</Text>
            </Text>
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

