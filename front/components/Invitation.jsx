import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { getInvits, setInvit } from "../services/invitation";
import { sendError } from "../utils/errors";

export const Invitation = ({ visible, hideModal }) => {
  const [invitsList, setInvitsList] = useState();

  const loadInvits = async () => {
    try {
      const allInvits = await getInvits();
      setInvitsList(allInvits);
    } catch (error) {
      sendError(error);
    }
  };

  const responseInvit = async (id, statut, action) => {
    await setInvit(id, statut);
    await loadInvits();
    showToast(action);
  };

  const showToast = (action) => {
    Toast.show({
      type: "info",
      text1: `${action} confirmée`,
    });
  };

  const renderItem = ({ item }) => (
    <View>
      <Text>
        {item.sender.name} vous a invité dans le groupe {item.group.name}
      </Text>
      <View style={styles.containerButton}>
        <View>
          <Pressable
            style={[styles.button, styles.buttonValide]}
            onPress={() => responseInvit(item.id, 200, "Validation")}
          >
            <Text>V</Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            style={[styles.button, styles.buttonRefus]}
            onPress={() => responseInvit(item.id, 300, "Suppression")}
          >
            <Text>X</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    loadInvits();
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!invitsList ? (
            <Text>Chargement...</Text>
          ) : (
            <>
              <FlatList
                data={invitsList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />

              <View style={styles.viewButton}>
                <View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={hideModal}
                  >
                    <Text style={styles.textSuppr}>X</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonValide: {
    color: "white",
    textAlign: "center",
    backgroundColor: "green",
  },
  buttonRefus: {
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
  buttonClose: {
    backgroundColor: "red",
  },
});
