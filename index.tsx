import React, { useContext } from 'react';
import { StyleSheet } from "react-native";
import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './authentication/authContext';
import { LoginScreen } from './app/login/login.screen';
import { RegisterScn } from './app/login/register.screen';
import { Homepage } from './app/main/homepage.screen';
import { Edit } from './app/main/editprof.screen';
import { AddExp } from './app/main/addexpense.screen';
import { GroupDetails } from './app/main/groupdetails.screen';
import { BetScreen } from './app/main/bets.screen';
import { BudgetScreen } from './app/main/budget.screen';
import { WinnerLog } from './app/main/winnerlog.screen';

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
      <Stack.Screen
        name="AddExpense"
        component={AddExp} 
        options={{ title: 'Add Expense' }}
      />
      <Stack.Screen
        name="GroupDetails"
        component={GroupDetails}
        options={{ title: 'Group Details' }}
      />
      <Stack.Screen
        name="Bets"
        component={BetScreen}
        options={{ title: 'Bet Screen' }}
      />
      <Stack.Screen
        name="BudgetScreen"
        component={BudgetScreen}
        options={{ title: 'Budget Screen' }}
      />
      <Stack.Screen 
        name="WinnerLog"
        component={WinnerLog}
        options={{ title: 'Winner Log' }}
      />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const { state } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.userToken == null ? (
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
  );
}

export default function Index() {
  return (
    <PaperProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
