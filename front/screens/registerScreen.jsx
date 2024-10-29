import React, { useState, useEffect } from "react";
import { Alert, View, Text, StyleSheet, Pressable } from "react-native";
import { register } from "../services/register";
import { loginInApp, formatErrorMessage } from "../services/login";
import { checkAccount } from "../services/checkAccount";
import { Button, TextInput } from "react-native-paper";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const createUserInBDDViaAPIURL = async () => {
    setIsLoaded(true);

    try {
      await register({ email: email, name: name, password: password });
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
          placeholder="Entrez votre nom utilisateur"
          onChangeText={setName}
          value={name}
          label="Nom"
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
          onPress={createUserInBDDViaAPIURL}
          loading={isLoaded}
          disabled={isLoaded}
        />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.redirectionText}>(J'ai déjà un compte)</Text>
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
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
