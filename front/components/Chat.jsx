import React, { useEffect, useRef, useState } from "react";
import {
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
import { sendError } from "../utils/errors";
import { GroupMembers } from "./GroupMembers";
import { IconButton } from "react-native-paper";

export const Chat = ({
  title,
  user,
  groupId,
  groupUsers,
  appendGroup,
  navigation,
}) => {
  const [messageToAction, setMessageToAction] = useState();
  const [hasNotification, setHasNotification] = useState(false);

  const [messages, setMessages] = useState([]);
  const messageRef = useRef(messages);
  const [messageToEdit, setMessageToEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [socketState, setSocketState] = useState(false);

  const isGroupAdmin =
    (groupUsers && groupUsers.find((u) => u.user?.id === user.id)?.isAdmin) ??
    false;

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

  const onEditMessage = () => {
    setMessageToEdit(messageToAction);
    setMessageToAction(undefined);
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
      sendError(error);
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
      {/* Chat title */}
      <View style={styles.chatTitleContainer}>
        <Text style={styles.chatTitle}>{title}</Text>
        {isGroupAdmin && (
          <Pressable style={styles.editGroupName} onPress={() => {}}>
            <IconButton icon="pencil" color="black" size={20} />
          </Pressable>
        )}
      </View>

      {/* Icons */}
      <Pressable
        style={groupId ? styles.notificationInGroups : styles.notification}
        onPress={() => setShowModal(true)}
      >
        <Image
          style={{ height: 25, width: 25 }}
          source={
            hasNotification
              ? require(`../assets/notificationon.png`)
              : require(`../assets/notificationoff.png`)
          }
        />
      </Pressable>
      <Pressable
        style={groupId ? styles.notificationInGroups : styles.notification}
        onPress={() => setShowModal(true)}
      >
        <Image
          style={{ height: 25, width: 25 }}
          source={
            hasNotification
              ? require(`../assets/notificationon.png`)
              : require(`../assets/notificationoff.png`)
          }
        />
      </Pressable>
      <Pressable
        style={groupId ? styles.deconnectionInGroups : styles.deconnection}
        onPress={() => deco(navigation)}
      >
        <Image
          style={{ height: 25, width: 25 }}
          source={require(`../assets/deconnexion.png`)}
        />
      </Pressable>
      {groupId && (
        <Pressable style={styles.groupMembers} onPress={() => deco(navigation)}>
          <GroupMembers groupUsers={groupUsers} />
        </Pressable>
      )}

      <Invitation
        visible={showModal}
        hideModal={() => setShowModal(false)}
        setHasNotification={setHasNotification}
        appendGroup={appendGroup}
      />

      {messageToAction !== undefined && (
        <MessageAction
          ownMessage={messageToAction.user.id === user.id}
          onDelete={onDeleteMessage}
          onEdit={onEditMessage}
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
      <MessageSender
        groupId={groupId}
        editedMessage={messageToEdit}
        confirmEdition={(message) => {
          setMessageToEdit(false);
          const newMessages = messageRef.current.map((currentMessage) => {
            return currentMessage.id === message.id ? message : currentMessage;
          });
          messageRef.current = newMessages;
          setMessages(newMessages);
        }}
        user={user}
        addMessage={addMessage}
      />
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chatContent: {
    paddingBottom: 60,
  },
  notification: {
    position: "absolute",
    right: 40,
    top: 20,
  },
  chatTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
  },
  editGroupName: {
    opacity: 0.5,
  },
  notificationInGroups: {
    position: "absolute",
    right: 80,
    top: 20,
  },
  deconnection: {
    position: "absolute",
    right: 5,
    top: 20,
  },
  deconnectionInGroups: {
    position: "absolute",
    right: 5,
    top: 20,
  },
  groupMembers: {
    position: "absolute",
    right: 25,
    top: 3,
  },
  press: {
    flexDirection: "row",
  },
});
