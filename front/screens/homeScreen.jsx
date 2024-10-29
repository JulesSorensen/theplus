import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getMessages, publishMessages } from "../services/messages";
import { getPseudoFromToken, getUser } from "../utils/authUtils";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAddGroupVisible, setAddGroupVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const menuAnimation = useState(new Animated.Value(-250))[0];
  const [myPseudo, setMyPseudo] = useState(null);
  const [user, setUser] = useState();

  const fetchMessages = async () => {
    try {
      const response = await getMessages();
      setMessages(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  const fetchPseudo = async () => {
    const userPseudo = await getPseudoFromToken();
    setMyPseudo(userPseudo);
  };

  const setupUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  useEffect(() => {
    setupUser();
    fetchMessages();
    fetchPseudo();
  }, []);

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

      const newGroup = { id: Date.now().toString(), name: groupName };
      setGroups([...groups, newGroup]);
      setGroupName("");
      setAddGroupVisible(false);
      navigation.navigate("GroupInvit", {
        groupName: newGroup.name,
        groupId: newGroup.id,
      });
    }
  };

  const openGroupInvit = (group) => {
    navigation.navigate("GroupInvit", { groupName: group.name });
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessageData = {
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
    return (
      <View
        style={[
          styles.messageBubble,
          item.user.id === user.id ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={
            item.type === "sent"
              ? styles.sentMessageText
              : styles.receivedMessageText
          }
        >
          {item.content}
        </Text>
        <Text style={styles.messageSender}>{item.user.name}</Text>
      </View>
    );
  };

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
                onPress={() => openGroupInvit(item)}
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

        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>Chat global</Text>
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
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    elevation: 5,
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
  chatContainer: {
    flex: 1,
    marginTop: 80,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  chatContent: {
    paddingBottom: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
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
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  sentBubble: {
    backgroundColor: "#007aff",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: "#e0e0e0", // Couleur plus foncée pour le message reçu
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  receivedMessageText: {
    color: "black",
    fontSize: 16,
  },
  sentMessageText: {
    color: "white",
    fontSize: 16,
  },
  messageSender: {
    color: "#333", // Changement pour une meilleure visibilité
    fontSize: 12,
    marginTop: 5,
  },
});

export default HomeScreen;