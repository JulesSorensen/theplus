import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";

export const Message = ({ isFromMe, message, onLongPress }) => (
  <View
    style={isFromMe ? styles.messageContainerSent : styles.messageContainer}
  >
    <Image
      source={{
        uri: `https://gravatar.com/avatar/${message.user?.hashedName}?s=200&d=wavatar`,
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
      onLongPress={onLongPress}
      delayLongPress={200}
    >
      {!isFromMe && (
        <Text style={styles.messageSender}>{message.user.name}</Text>
      )}
      <Text
        style={isFromMe ? styles.sentMessageText : styles.receivedMessageText}
      >
        {message.content}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  messageContainerSent: {
    flexDirection: "row-reverse",
  },
  messageContainer: {
    flexDirection: "row",
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
});
