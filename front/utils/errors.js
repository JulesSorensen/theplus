import { Alert } from "react-native";
import { formatErrorMessage } from "../services/login";

export const sendError = (error) =>
  Alert.alert(
    "Une erreur est survenue",
    formatErrorMessage(error),
    [
      {
        text: "Compris",
      },
    ],
    {
      cancelable: true,
    },
  );
