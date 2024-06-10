import React from 'react';
import { PaperProvider } from 'react-native-paper';
import {LoginScreen} from './login/login.screen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RegisterScn } from './login/register.screen';
import {Homepage} from './main/homepage.screen';

const Stack = createNativeStackNavigator();
function AuthStack() {
	return (
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
	);
}

function AppStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="home" component={Homepage}/>
		</Stack.Navigator>
	)
}
export default function Index() {
  return (
	<PaperProvider>
		<AuthStack />
	</PaperProvider>
  );
}
