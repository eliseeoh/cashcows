import React from 'react';
import { SafeAreaView, StyleSheet} from "react-native";
import { PaperProvider, TextInput, Button, Card } from 'react-native-paper';
import {LoginScreen} from './login/login.screen';

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

export default function Index() {
  return (
    <PaperProvider>
      <LoginScreen/>
    </PaperProvider>

  );
}
