import React, { useState, useContext } from 'react';
import { View, Alert, ImageBackground } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { loginStyles } from './login.screenstyle'; // Ensure this import is correct

export const RegisterScn = () => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);

      // Get the ID token
      const token = await user.getIdToken();
      console.log("User token:", token);
      
      // Ensure signUp method correctly handles the token
      signUp(token);
      
    } catch (error) {
      if (error.code === 'auth/missing-password') {
        console.error("Missing password error:", error);
        Alert.alert("Error", "Password is required.");
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
}

