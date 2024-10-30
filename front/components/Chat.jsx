import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { Invitation } from "../components/Invitation";
import { MessageSender } from "../components/MessageSender";
import {
  deleteMessage,
  getGroupMesages,
  getMessages,
} from "../services/messages";
import { getSocket } from "../services/socket";
import { Message } from "./Message";
import { MessageAction } from "./MessageAction";
import { deco } from "../services/disconnect";

export const Chat = ({ title, user, groupId, navigation }) => {
  const [messageToAction, setMessageToAction] = useState();
  const [hasNotification, setHasNotification] = useState(false);

  const [messages, setMessages] = useState([]);
  const messageRef = useRef(messages);

  const [showModal, setShowModal] = useState(false);
  const [socketState, setSocketState] = useState(false);

  const addMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
    messageRef.current = [...messageRef.current, newMessage];
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
      sendError(error);
    } finally {
      setMessageToAction(undefined);
    }
  };

  const fetchMessages = async () => {
    try {
      let msgs;

      if (groupId === undefined) {
        msgs = await getMessages();
      } else {
        msgs = await getGroupMesages(groupId);
      }

      setMessages(msgs);
      messageRef.current = msgs;
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  const initSocket = async () => {
    const socket = await getSocket();
    setSocketState(socket);

    socket.on("message", (message) => {
      if (
        (!groupId && (!message.group || !message.group.id)) ||
        (message.group && groupId && message.group.id === groupId)
      ) {
        messageRef.current = [...messageRef.current, message];
        setMessages([...messageRef.current]);
      }
    });

    socket.on("updateMessage", (updatedMessage) => {
      if (
        (!groupId && (!updatedMessage.group || !updatedMessage.group.id)) ||
        (updatedMessage.group && groupId && updatedMessage.group.id === groupId)
      ) {
        const newMessages = messageRef.current.map((currentMessage) =>
          currentMessage.id === updatedMessage.id
            ? updatedMessage
            : currentMessage,
        );
        messageRef.current = newMessages;
        setMessages(newMessages);
      }
    });

    socket.on("removeMessage", (removedMessage) => {
      if (
        (!groupId && (!removedMessage.group || !removedMessage.group.id)) ||
        (removedMessage.group && groupId && removedMessage.group.id === groupId)
      ) {
        const newMessages = messageRef.current.filter(
          (currentMessage) => currentMessage.id !== removedMessage.id,
        );
        messageRef.current = newMessages;
        setMessages(newMessages);
      }
    });
  };

  useEffect(() => {
    fetchMessages();
    initSocket();

    return () => {
      if (socketState) {
        socketState.off("message");
        socketState.disconnect();
      }
    };
  }, []);

  return (
    <View style={styles.chatContainer}>
      <Text style={styles.chatTitle}>{title}</Text>

      <Pressable style={styles.notification} onPress={() => setShowModal(true)}>
        <Image
          style={{ height: 25, width: 25 }}
          source={
            hasNotification
              ? require(`../assets/notificationon.png`)
              : require(`../assets/notificationoff.png`)
          }
        />
      </Pressable>
      <Pressable style={styles.deconnection} onPress={() => deco(navigation)}>
        <Image
          style={{ height: 25, width: 25 }}
          source={require(`../assets/deconnexion.png`)}
        />
      </Pressable>


      <Invitation
        visible={showModal}
        hideModal={() => setShowModal(false)}
        setHasNotification={setHasNotification}
      />

      {messageToAction !== undefined && (
        <MessageAction
          ownMessage={messageToAction.user.id === user.id}
          onDelete={onDeleteMessage}
          hideModal={() => setMessageToAction(undefined)}
        />
      )}

      {messages !== undefined ? (
        <FlatList
          data={[...messages].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Message
              message={item}
              isFromMe={item.user.id === user.id}
              onLongPress={() => {
                console.log("Long press");
                console.log({ item });
                console.log({ setMessageToAction });
                setMessageToAction(item);
              }}
            />
          )}
          contentContainerStyle={styles.chatContent}
          inverted
        />
      ) : (
        <Text>Loading</Text>
      )}
      <MessageSender user={user} addMessage={addMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  notification: {
    position: "absolute",
    right: 40,
    top: 12,
  },
  deconnection: {
    position: "absolute",
    right: 5,
    top: 12,
  },
  press: {
    flexDirection: "row"
  }
});
