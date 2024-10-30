import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Chat } from "../components/Chat";
import { getGroups } from "../services/groups";
import { getUser } from "../utils/authUtils";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAddGroupVisible, setAddGroupVisible] = useState(false);

  const menuAnimation = useState(new Animated.Value(-250))[0];
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
    Animated.timing(menuAnimation, {
      toValue: isMenuVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const addGroup = () => {
    if (groupName.trim()) {
      const groupExists = groups.some(
        (group) => group.name.toLowerCase() === groupName.toLowerCase(),
      );
      if (groupExists) {
        alert("Le nom du groupe existe déjà. Veuillez en choisir un autre.");
        return;
      }

      const newGroup = { name: groupName };
      setGroupName("");
      setAddGroupVisible(false);
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

        {isMenuVisible && (
          <Pressable style={styles.overlay} onPress={toggleMenu} />
        )}

        <Animated.View
          style={[styles.sideMenu, { left: menuAnimation, zIndex: 2 }]}
        >
          <Text style={styles.menuTitle}>Groupes</Text>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openGroupChat(item)}
                style={styles.groupItem}
              >
                <Text style={styles.groupText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          {isAddGroupVisible ? (
            <View style={styles.addGroupContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Nom du groupe"
                value={groupName}
                onChangeText={setGroupName}
              />
              <TouchableOpacity style={styles.addButton} onPress={addGroup}>
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addGroupToggle}
              onPress={() => setAddGroupVisible(true)}
            >
              <Text style={styles.addGroupText}>+ Ajouter un groupe</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Chat title={"Chat global"} user={user} />

        <Toast />
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
    top: 20,
    left: 20,
    zIndex: 3,
  },
  burgerText: {
    fontSize: 30,
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  groupItem: {
    paddingVertical: 10,
  },
  groupText: {
    fontSize: 18,
    color: "#333",
  },
  addGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#6200ee",
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addGroupToggle: {
    marginTop: 20,
    alignItems: "center",
  },
  addGroupText: {
    color: "#6200ee",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#6200ee",
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  textSuppr: {
    color: "white",
    textAlign: "center",
    backgroundColor: "red",
  },
});

export default HomeScreen;
