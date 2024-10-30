import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chat } from "../components/Chat";
import { SideBar } from "../components/Sidebar";
import { getGroups } from "../services/groups";
import { getUser } from "../utils/authUtils";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [user, setUser] = useState();

  const setupUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const addGroup = (groupName) => {
    if (groupName.trim()) {
      const groupExists = groups.some(
        (group) => group.name.toLowerCase() === groupName.toLowerCase(),
      );
      if (groupExists) {
        alert("Le nom du groupe existe déjà. Veuillez en choisir un autre.");
        return;
      }

      const newGroup = { name: groupName };
      setGroups([...groups, newGroup]);
      navigation.navigate("GroupInvit", {
        groupName: newGroup.name,
      });
    }
  };

  const openGroupChat = (group) => {
    navigation.navigate("GroupChat", {
      groupName: group.name,
      groupId: group.id,
    });
  };

  useEffect(() => {
    setupUser();
    fetchGroups();
  }, []);

  if (!user) return <></>;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton}>
          <Text style={styles.burgerText}>☰</Text>
        </TouchableOpacity>

        <SideBar
          visible={isMenuVisible}
          toggleMenu={toggleMenu}
          addGroup={addGroup}
          groups={groups}
          openGroupChat={openGroupChat}
        />

        <Chat title={"Chat global"} user={user} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  burgerButton: {
    position: "absolute",
    top: 30,
    left: 15,
    zIndex: 3,
  },
  burgerText: {
    fontSize: 30,
    color: "#333",
  },
});

export default HomeScreen;
