import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { publishMessages } from "../services/messages";
import { sendError } from "../utils/errors";

export const MessageSender = ({ user, addMessage }) => {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = async () => {
    if (messageInput.length < 1) return;

    const newMessageData = {
      content: messageInput,
      user: {
        name: user.name,
      },
    };

    try {
      const response = await publishMessages(newMessageData);
      const newMessage = {
        id: response.id,
        content: response.content,
        user: response.user,
      };

      addMessage(newMessage);
      setMessageInput("");
    } catch (error) {
      sendError(error);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.messageInput}
        placeholder="Écrire un message"
        value={messageInput}
        onChangeText={setMessageInput}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Text style={styles.sendButtonText}>Envoyer</Text>
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
});
