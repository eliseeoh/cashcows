import React, {useState} from 'react';
import { ImageBackground, SafeAreaView, ScrollView, View, Alert} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';
import { RegisterScn } from './register.screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {loginUser} from "../../authentication/apiService.js"

export const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
          const data = await loginUser(email, password);
          console.log('Login successful', data);
          // Navigate to another screen or update UI based on login success
        } catch (error) {
          Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <SafeAreaView style={loginStyles.appContainer}>
            <ImageBackground style={loginStyles.image} source={require('../../assets/images/login/background.png')}>
                <ScrollView contentContainerStyle={loginStyles.scrollV}>
                    <View style={loginStyles.view}>
                        <Card>
                            <Card.Title title="Log in" titleStyle={loginStyles.centerT}></Card.Title>
                            <Card.Content>
                                <TextInput label="Username"
                                    onChangeText={setEmail}></TextInput>
                                <TextInput label="Password" 
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    onChangeText={setPassword}></TextInput>
                                <Button 
                                uppercase={false}
                                >Forgot email or password?</Button>
                                <Button mode="contained" onPress={handleLogin}>Sign in</Button>
                                <Button onPress={() => navigation.navigate("Register")}>Register now!</Button>
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}