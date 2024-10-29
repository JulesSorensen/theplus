import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPseudoFromToken = async () => {
  try {
    const user = await getUser();
    if (user) return user.pseudo;

    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du pseudo :", error);
    return null;
  }
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  if (user) return JSON.parse(user);

  const token = await AsyncStorage.getItem("jwt");
  if (token) {
    const payloadBase64 = token.split(".")[1];
    if (payloadBase64) {
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload;
    }
  }
};
