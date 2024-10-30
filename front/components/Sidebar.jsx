import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";

export const SideBar = ({
  visible,
  toggleMenu,
  groups,
  addGroup,
  openGroupChat,
}) => {
  const [groupName, setGroupName] = useState("");
  const [isAddGroupVisible, setAddGroupVisible] = useState(false);
  const menuAnimation = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: !visible ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  return (
    <>
      {visible && <Pressable style={styles.overlay} onPress={toggleMenu} />}

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
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                addGroup(groupName);
                setGroupName("");
                setAddGroupVisible(false);
              }}
            >
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
    </>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
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
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
});
