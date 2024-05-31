import React from 'react';
import { Text, View, StyleSheet, Button, TextInput } from "react-native";

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

const TextIn = (props: { ph: string | undefined; }) => (
  <TextInput 
    onChangeText = {text => onChangeText(text)} 
    autoCapitalize= 'none' placeholder={props.ph} style= {styles.input}></TextInput>
)

export default function Index() {
  const [email, OnChangeText] = React.useState('');
  const [password, OnChangeText] = React.useState('');

  return (
    <View style={styles.appContainer}>
      <Text style={styles.defaultSemiBold}>Login</Text>
      <TextIn ph= "Email"/>
      <TextIn ph= "Password"/>
      <Button title= "Sign in"/>
    </View>
  );
}
