import React, { useState, useContext } from 'react';
import { View, Alert, ImageBackground } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { loginStyles } from './login.screenstyle';

export const RegisterScn = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await signUp(email, password, username);
      Alert.alert("Success", "Registration successful. You can now log in.");
      navigation.navigate('Log in');
    } catch (error) {
      if (error.code === 'auth/missing-password') {
        Alert.alert("Error", "Password is required.");
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "This email address is already in use.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "The email address is not valid.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Error", "The password is too weak.");
      } else {
        Alert.alert("Error", `Failed to register: ${error.message}`);
      }
    }
  };

  return (
    <ImageBackground 
        style={loginStyles.image}
        source={require('../../assets/images/login/background.png')}
        resizeMode='cover'>
      <View style={loginStyles.viewReg}>
        <Card>
          <Card.Title title="Register!" titleStyle={loginStyles.centerT} />
          <Card.Content>
            <TextInput 
              label="Username"
              style={loginStyles.textIn}
              onChangeText={setUsername}
            />
            <TextInput 
              label="Email"
              keyboardType='email-address'
              autoCapitalize='none'
              style={loginStyles.textIn}
              onChangeText={setEmail}
            />
            <TextInput 
              label="Password"
              secureTextEntry={true}
              autoCapitalize='none'
              style={loginStyles.textIn}
              onChangeText={setPassword}
            />
            <Button mode="contained" onPress={handleRegister}>Sign up</Button>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
};
