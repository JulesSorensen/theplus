import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { loginInApp } from '../services/login';
import { checkAccount } from '../services/checkAccount';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const connect = async () => {

    try {
      await loginInApp(email, password)
      navigation.replace('Home')
    } catch (error) {
      Alert.alert(
        'Une erreur est survenue',
        error.message,
        [
          {
            text: 'Compris',
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  }
  
  useEffect(()=> {
    checkAccount(navigation)
  }, [])

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email :</Text>
        <TextInput style={styles.input} placeholder='Entrez votre email' onChangeText={setEmail} value={email} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe :</Text>
        <TextInput style={styles.input} placeholder='Entrez votre mot de passe' onChangeText={setPassword} value={password} secureTextEntry />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Allons y" onPress={connect} />
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text>JE VEUX M'INSCRIRE</Text>
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

export default LoginScreen;
