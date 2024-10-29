import env from "../env";
import { r } from "../utils/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = (data) =>
  r({ url: `${env.API_URL}/login`, method: "POST", data });

export const loginInApp = async (email, password) => {
  const jwt = await login({ email, password });
  await AsyncStorage.setItem("jwt", jwt.access_token);
  await AsyncStorage.setItem("user", JSON.stringify(jwt.user));
};
