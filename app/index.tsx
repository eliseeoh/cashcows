import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from '../authentication/authContext';
import { LoginScreen } from './login/login.screen';
import { RegisterScn } from './login/register.screen';
import { Homepage } from './main/homepage.screen';
import { Edit } from './main/editprof.screen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Log in">
      <Stack.Screen
        name="Log in"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScn}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Homepage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={Edit}
      />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AuthContext.Consumer>
          {({ authData }) => (
            <NavigationContainer>
              <Stack.Navigator>
                {authData == null ? (
                  <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }}
                  />
                ) : (
                  <Stack.Screen
                    name="App"
                    component={AppStack}
                    options={{ headerShown: false }}
                  />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    </PaperProvider>
  );
}

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCxgpWsVXck0X_jXZjCjIaLV_uO0qVZaJU",
  authDomain: "cashcows-4102f.firebaseapp.com",
  projectId: "cashcows-4102f",
  storageBucket: "cashcows-4102f.appspot.com",
  messagingSenderId: "3300826133",
  appId: "1:3300826133:android:7cbd57d9d1e2f3349b821c",
};

const app = initializeApp(firebaseConfig);