import React, { useEffect, useRef, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
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

export const Chat = ({ title, user, groupId }) => {
  const [messageToAction, setMessageToAction] = useState();

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

      <Invitation visible={showModal} hideModal={() => setShowModal(false)} />

      {messageToAction !== undefined && (
        <MessageAction
          ownMessage={messageToAction.user.id === user.id}
          onDelete={onDeleteMessage}
          hideModal={() => setMessageToAction(undefined)}
        />
      )}

      <Button title="Notification" onPress={() => setShowModal(true)}></Button>
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
});
