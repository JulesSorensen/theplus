import React, { useState, useEffect, useRef } from "react";
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
  Image,
  Button,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  deleteMessage,
  getMessages,
  publishMessages,
} from "../services/messages";
import { getPseudoFromToken, getUser } from "../utils/authUtils";
import { getSocket } from "../services/socket";
import Invitation from "../composant/Invitation";
import Toast from "react-native-toast-message";
import MessageAction from "../components/MessageAction";
import { getGroups } from "../services/groups";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAddGroupVisible, setAddGroupVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(messages);

  const [messageInput, setMessageInput] = useState("");
  const menuAnimation = useState(new Animated.Value(-250))[0];
  const [myPseudo, setMyPseudo] = useState(null);
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);

  const [messageToAction, setMessageToAction] = useState();

    const fetchMessages = async () => {
        try {
            const msgs = await getMessages();
            setMessages(msgs);
            messageRef.current = msgs;
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
                groupName: newGroup.name
            });
        }
    };

    const openGroupChat = (group) => {
        navigation.navigate("GroupChat", { groupName: group.name, groupId: group.id });
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
                };

                setMessages([...messages, newMessage]);
                messageRef.current = [...messageRef.current, newMessage];
                setMessageInput("");
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    const renderMessage = ({ item }) => {
        const isFromMe = item.user.id === user.id;

    return (
      <View
        style={isFromMe ? styles.messageContainerSent : styles.messageContainer}
      >
        <Image
          source={{
            uri: `https://gravatar.com/avatar/${item.user?.hashedName}?s=200&d=wavatar`,
          }}
          style={isFromMe ? styles.myMessageAvatar : styles.messageAvatar}
        />
        <Pressable
          style={({ pressed }) => [
            styles.messageBubble,
            isFromMe ? styles.sentBubble : styles.receivedBubble,
            {
              opacity: pressed ? 0.3 : 1,
            },
          ]}
          onLongPress={() => {
            setMessageToAction(item);
          }}
          delayLongPress={500}
        >
          {!isFromMe && (
            <Text style={styles.messageSender}>{item.user.name}</Text>
          )}
          <Text
            style={
              isFromMe ? styles.sentMessageText : styles.receivedMessageText
            }
          >
            {item.content}
          </Text>
        </Pressable>
      </View>
    );
  };

  const onDeleteMessage = async () => {
    try {
      if (messageToAction === null) return;
      if (messageToAction.user.id !== user.id) return;

      await deleteMessage(messageToAction.id);
      const newMessages = messages.filter(
        (message) => message.id !== messageToAction.id,
      );
      setMessages(newMessages);
      messageRef.current = newMessages;
    } catch (error) {
      Alert.alert(
        "Une erreur est survenue",
        formatErrorMessage(error),
        [
          {
            text: "Compris",
          },
        ],
        {
          cancelable: true,
        },
      );
    } finally {
      setMessageToAction(undefined);
    }
  };

    const initSocket = async () => {
        const socket = await getSocket();
        socket.on("message", (message) => {
            messageRef.current = [...messageRef.current, message];
            setMessages([...messageRef.current]);
        });
    };

    useEffect(() => {
        setupUser();
        initSocket();
        fetchMessages();
        fetchPseudo();
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

        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>Chat global</Text>
          <Modal animationType="slide" transparent={true} visible={showModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Invitation />
                <View style={styles.viewButton}>
                  <View>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setShowModal(!showModal)}
                    >
                      <Text style={styles.textSuppr}>X</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          {messageToAction !== undefined && (
            <MessageAction
              ownMessage={messageToAction.user.id === user.id}
              onDelete={onDeleteMessage}
              hideModal={() => setMessageToAction(undefined)}
            />
          )}

          <Button
            title="Notification"
            onPress={() => setShowModal(true)}
          ></Button>
          {messages !== undefined ? (
            <FlatList
              data={[...messages].reverse()}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatContent}
              inverted
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
  chatContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
  },
  chatTitle: {
    paddingLeft: 20,
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
    maxWidth: "90%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  sentBubble: {
    backgroundColor: "#007aff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  receivedMessageText: {
    marginTop: 5,
    color: "black",
    fontSize: 16,
  },
  sentMessageText: {
    marginTop: 5,
    color: "white",
    fontSize: 16,
  },
  messageSender: {
    color: "#333",
    fontSize: 12,
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  myMessageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  messageContainer: {
    flexDirection: "row",
  },
  messageContainerSent: {
    flexDirection: "row-reverse",
    // justifyContent: "flex-end",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textSuppr: {
    color: "white",
    textAlign: "center",
    backgroundColor: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;
