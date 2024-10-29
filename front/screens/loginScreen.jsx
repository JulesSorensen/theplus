import React, { useState, useEffect } from "react";
import { Alert, View, Text, Pressable, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { loginInApp, formatErrorMessage } from "../services/login";
import { checkAccount } from "../services/checkAccount";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const connect = async () => {
    setIsLoaded(true);
    try {
      await loginInApp(email, password, navigation);
    } catch (error) {
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
    } finally {
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    checkAccount(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          label="Email"
          mode="outlined"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          label="Mot de passe"
          mode="outlined"
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          children="Allons y"
          mode="elevated"
          onPress={connect}
          loading={isLoaded}
          disabled={isLoaded}
        />
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.redirectionText}>JE VEUX M'INSCRIRE</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    width: 120,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  redirectionText: {
    opacity: 0.7,
    color: "blue",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
