import React, { useState, useContext } from 'react';
import { auth } from '../../config/firebaseConfig';
import { ImageBackground, View, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';
import { AuthContext } from '../../authentication/authContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const RegisterScn = () => {
  const { signUp } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
      signUp();
    } catch (error) {

      console.error("Error registering:", error);
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  return (
    <ImageBackground style={loginStyles.image}
        source={require('../../assets/images/login/background.png')}
        resizeMode='cover'>
            <View style={loginStyles.viewReg}>
                <Card>
                    <Card.Title title="Register!" titleStyle={loginStyles.centerT}></Card.Title>
                    <Card.Content>
                        <TextInput label="Username"
                            style={loginStyles.textIn}
                            onChangeText={setUsername}></TextInput>
                        <TextInput label="Email"
                            keyboardType='email-address'
                            autoCapitalize='none'
                            style={loginStyles.textIn}
                            onChangeText={setEmail}></TextInput>
                        <TextInput label="Password"
                            secureTextEntry={true}
                            autoCapitalize='none'
                            style={loginStyles.textIn}
                            onChangeText={setPassword}></TextInput>
                        <Button mode="contained" onPress={handleRegister}>Sign up</Button>
                    </Card.Content>
                </Card>
            </View>
    </ImageBackground>
)
}
