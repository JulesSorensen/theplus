import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable } from 'react-native';
import { register } from '../services/register';
import { loginInApp } from '../services/login';



const RegisterScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const createUserInBDDViaAPIURL = async () => {
    try {
      await register({ email: email, name: name, password: password })
      await loginInApp(email, password)
      console.log("ouf")
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email :</Text>
        <TextInput style={styles.input} placeholder='Entrez votre email' onChangeText={setEmail} value={email} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom utilisateur :</Text>
        <TextInput style={styles.input} placeholder='Entrez votre nom utilisateur' onChangeText={setName} value={name} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe :</Text>
        <TextInput style={styles.input} placeholder='Entrez votre mot de passe' onChangeText={setPassword} value={password} secureTextEntry />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Allons y" onPress={createUserInBDDViaAPIURL} />
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text> J'ai déjà un compte</Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  label: {
    width: 120,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
});


export default RegisterScreen;
