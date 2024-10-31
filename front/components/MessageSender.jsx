import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { editMessage, publishMessages } from "../services/messages";
import { sendError } from "../utils/errors";
import { IconButton } from "react-native-paper";

export const MessageSender = ({
  user,
  groupId,
  addMessage,
  editedMessage,
  confirmEdition,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (isLoading || messageInput.length < 1) return;

    setIsLoading(true);

    const newMessageData = {
      content: messageInput,
      user: {
        name: user.name,
      },
    };

    if (groupId) newMessageData.groupId = groupId;

    try {
      if (editedMessage) {
        const response = await editMessage(editedMessage.id, newMessageData);
        confirmEdition(response);
      } else {
        const response = await publishMessages(newMessageData);
        const newMessage = {
          id: response.id,
          content: response.content,
          user: response.user,
        };

        addMessage(newMessage);
      }
      setMessageInput("");
    } catch (error) {
      sendError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (editedMessage) {
      setMessageInput(editedMessage.content);
    }
  }, [editedMessage]);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.messageInput}
        placeholder="Écrire un message"
        value={messageInput}
        onChangeText={setMessageInput}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        {!editedMessage ? (
          <IconButton
            icon="send"
            iconColor={isLoading ? "gray" : "#6200ee"}
            size={25}
          />
        ) : (
          <IconButton
            icon="pencil"
            iconColor={isLoading ? "gray" : "#6200ee"}
            size={25}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
