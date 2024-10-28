import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import HomeScreen from './screens/homeScreen';
import GroupInvitScreen from './screens/groupInvitScreen';
import GroupChatScreen from './screens/groupChatScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroupInvit" component={GroupInvitScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
