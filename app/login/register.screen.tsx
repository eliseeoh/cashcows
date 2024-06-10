import React, {useState} from 'react';
import { ImageBackground, View, ScrollView, Alert} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles } from './login.screenstyle';
import { registerUser } from '@/authentication/apiService';

export const RegisterScn= () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
          const data = await registerUser(email, username, password);
          console.log('Registration successful', data);
          Alert.alert('Registration Successful', 'You have successfully registered!');
          // Navigate to another screen or update UI based on registration success
        } catch (error) {
            console.error('Registration error:', error);
          Alert.alert('Registration Failed', error.message);
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