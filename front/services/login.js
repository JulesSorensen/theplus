import env from "../env";
import { r } from "../utils/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = (data) =>
    r({ url: `${env.API_URL}/login`, method: "POST", data });

export const loginInApp = async (email, password, navigation) => {
    const jwt = await login({ email, password })
    await AsyncStorage.setItem("jwt", jwt.access_token)
    await AsyncStorage.setItem("user", JSON.stringify(jwt.user));
    navigation.replace('Home')
}

export const formatErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    } else if (error && typeof error === 'object') {
        if (Array.isArray(error.message)) {
            return error.message.join('\n');
        } else if (typeof error.message === 'string') {
            return error.message;
        } else {
            return JSON.stringify(error);
        }
    }
    return "Une erreur inconnue s'est produite";
};
