import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkAccount = async (navigation) => {
  const jwt = await AsyncStorage.getItem("jwt");
  if (jwt) navigation.navigate("Home");
};
