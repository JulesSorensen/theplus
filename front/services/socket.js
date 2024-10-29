import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../env";

export const getSocket = async () =>
  io(env.API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${await AsyncStorage.getItem("jwt")}`,
    },
  });
