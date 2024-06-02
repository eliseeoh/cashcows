import React from 'react';
import { SafeAreaView, StyleSheet} from "react-native";
import { PaperProvider } from 'react-native-paper';
import {LoginScreen} from './login/login.screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RegisterScn } from './login/register.screen';


const Stack = createNativeStackNavigator();

export default function Index() {
  return (
		<PaperProvider>
			<Stack.Navigator initialRouteName="Log in">
				<Stack.Screen
					name="Log in"
					component={LoginScreen}
          options={{ headerShown: false }}/>
				<Stack.Screen
					name="Register"
					component={RegisterScn}
          options={{ 
            title: ""}}/>
			</Stack.Navigator>
		</PaperProvider>

  );
}
