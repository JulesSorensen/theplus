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
import { IconButton } from "react-native-paper";

export const Invitation = ({ visible, hideModal, setHasNotification }) => {
  const [invitsList, setInvitsList] = useState();

  const loadInvits = async () => {
    try {
      const allInvits = await getInvits();
      setInvitsList(allInvits);
      if (allInvits.length > 0) {
        setHasNotification(true);
      } else {
        setHasNotification(false);
      }
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
            <IconButton size={15} icon="check" />
          </Pressable>
        </View>
        <View>
          <Pressable
            style={[styles.button, styles.buttonRefus]}
            onPress={() => responseInvit(item.id, 300, "Suppression")}
          >
            <IconButton size={15} icon="trash-can" />
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
              {invitsList.length === 0 ? (
                <Text style={styles.noInvits}>Aucune notification</Text>
              ) : (
                <FlatList
                  data={invitsList}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}

              <View style={styles.viewButton}>
                <View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={hideModal}
                  >
                    <IconButton icon="close" />
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
    padding: 1,
  },
  buttonValide: {
    color: "white",
    textAlign: "center",
    backgroundColor: "green",
    marginRight: 5,
  },
  buttonRefus: {
    color: "white",
    textAlign: "center",
    backgroundColor: "red",
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    height: "50%",
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
    backgroundColor: "darkgrey",
  },
  noInvits: {
    marginBottom: "auto",
  },
});
