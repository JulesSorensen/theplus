import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

export default MessageAction = ({
  ownMessage,
  onEdit,
  onDelete,
  hideModal,
}) => (
  <Modal animationType="slide" transparent={true} visible={true}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.viewButton}>
          <Pressable style={[styles.buttonClose]} onPress={() => hideModal()}>
            <IconButton icon="close" size={20} />
          </Pressable>
        </View>
        {ownMessage ? (
          <>
            <View style={styles.viewButton}>
              <Pressable style={[styles.buttonEdit]} onPress={onEdit}>
                <IconButton icon="pencil" size={20} />
              </Pressable>
            </View>
            <View style={styles.viewButton}>
              <Pressable style={[styles.buttonDelete]} onPress={onDelete}>
                <IconButton icon="delete" size={20} />
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.viewButton}>
            <Pressable
              style={[styles.buttonReport]}
              onPress={() => hideModal()}
            >
              <IconButton icon="flag" size={20} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonEdit: {
    width: "100%",
    backgroundColor: "#98C1D9",
    alignItems: "center",
  },
  buttonClose: {
    width: "100%",
    backgroundColor: "#CCDBFF",
    alignItems: "center",
  },
  buttonDelete: {
    width: "100%",
    backgroundColor: "#B31D1D",
    alignItems: "center",
  },
  buttonReport: {
    width: "100%",
    backgroundColor: "#B31D1D",
    alignItems: "center",
  },
  viewButton: {
    width: "100%",
  },
});
