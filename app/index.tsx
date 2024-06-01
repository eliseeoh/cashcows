import React from 'react';
import { SafeAreaView, StyleSheet} from "react-native";
import { PaperProvider } from 'react-native-paper';
import {LoginScreen} from './login/login.screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RegisterScn } from './login/register.screen';

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  }
})

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
