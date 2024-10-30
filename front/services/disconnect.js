import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendError } from "../utils/errors";

export const deco = async (navigation) =>{
    try {
        await AsyncStorage.removeItem("jwt")
        await AsyncStorage.removeItem("user")
        navigation.replace('Login')
    } catch (error) {
        sendError(error)
    }

}