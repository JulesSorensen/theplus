import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";

export const Message = ({ isFromMe, message, onLongPress }) => {
  const [userPicture, setUserPicture] = React.useState(
    `https://gravatar.com/avatar/${message.user?.hashedName}?s=200&d=wavatar`,
  );

  const randomPictures = [
    "https://media.licdn.com/dms/image/v2/D4E03AQE1lc8OzyUG6w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1678691731218?e=1735776000&v=beta&t=ud5-k2bXqgbd4_0qunS75l3yzmmTqiODNMkJ-2cQsXU",
    "https://media.licdn.com/dms/image/v2/D4E35AQHT7KWV_zMRDw/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1696581643088?e=1730923200&v=beta&t=xSIqse4Z3ArfHNeYfVSTkMV6oOll8PCFvyCIvXIRIoU",
    "https://media.licdn.com/dms/image/v2/D4E03AQEhtUpKnC9ciQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1715800014829?e=1735776000&v=beta&t=3uVn8A4ALW11WqAfV00jUZDitztpQUHFdhsBoxfmzM0",
  ];

  return (
    <View
      style={isFromMe ? styles.messageContainerSent : styles.messageContainer}
    >
      <Pressable
        onPress={() => {
          setUserPicture(
            randomPictures[Math.floor(Math.random() * randomPictures.length)],
          );
        }}
      >
        <Image
          source={{
            uri: userPicture,
          }}
          style={isFromMe ? styles.myMessageAvatar : styles.messageAvatar}
        />
      </Pressable>
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
};

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
