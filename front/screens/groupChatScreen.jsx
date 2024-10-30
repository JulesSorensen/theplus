import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { Chat } from "../components/Chat";
import { getUser } from "../utils/authUtils";

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

  if (!user) return <Text>Chargement...</Text>;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Chat
        title={groupName}
        user={user}
        groupId={groupId}
        groupUsers={parsedGroupUsers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
});

export default GroupChatScreen;
