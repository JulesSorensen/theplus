import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { IconButton } from "react-native-paper";

export const GroupMembers = ({ groupUsers }) => {
  const showGroupUsers = () => {
    if (!groupUsers || groupUsers.length === 0) {
      Alert.alert("Membres du groupe", "Aucun utilisateur trouvé");
      return;
    }

    const admins = groupUsers.filter((groupUser) => groupUser.isAdmin);
    const regularMembers = groupUsers.filter((groupUser) => !groupUser.isAdmin);

    const adminNames = admins.map((admin) => admin.user.name).join(", ");
    const memberNames = regularMembers
      .map((member) => member.user.name)
      .join(", ");

    let alertMessage = "";
    if (adminNames) {
      alertMessage += `Administrateurs: ${adminNames}\n\n`;
    }
    if (memberNames) {
      alertMessage += `Membres: ${memberNames}`;
    }

    Alert.alert("Membres du groupeA", alertMessage);
  };

  return (
    <TouchableOpacity onPress={showGroupUsers}>
      <IconButton icon="account-group" color="#fff" size={30} />
    </TouchableOpacity>
  );
};
