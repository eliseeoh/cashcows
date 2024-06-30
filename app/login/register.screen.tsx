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
    console.log('handleRegister called');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      await signUp(email, password); // Use signUp method from AuthContext
      Alert.alert("Success", "Registration successful. You can now log in.");
      navigation.navigate('Log in');
    } catch (error) {
      if (error.code === 'auth/missing-password') {
        console.error("Missing password error:", error);
        Alert.alert("Error", "Password is required.");
      } else if (error.code === 'auth/email-already-in-use') {
        console.error("Email already in use error:", error);
        Alert.alert("Error", "This email address is already in use.");
      } else if (error.code === 'auth/invalid-email') {
        console.error("Invalid email error:", error);
        Alert.alert("Error", "The email address is not valid.");
      } else if (error.code === 'auth/weak-password') {
        console.error("Weak password error:", error);
        Alert.alert("Error", "The password is too weak.");
      } else {
        console.error("Error registering:", error);
        Alert.alert("Error", `Failed to register: ${error.message}`);
      }
    }
  };

  console.log('Component rendered');

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
              onChangeText={(text) => {
                setUsername(text);
                console.log('Username updated:', text);
              }}
            />
            <TextInput 
              label="Email"
              keyboardType='email-address'
              autoCapitalize='none'
              style={loginStyles.textIn}
              onChangeText={(text) => {
                setEmail(text);
                console.log('Email updated:', text);
              }}
            />
            <TextInput 
              label="Password"
              secureTextEntry={true}
              autoCapitalize='none'
              style={loginStyles.textIn}
              onChangeText={(text) => {
                setPassword(text);
                console.log('Password updated:', text);
              }}
            />
            <Button mode="contained" onPress={() => {
              console.log('Button pressed');
              handleRegister();
            }}>Sign up</Button>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
};
