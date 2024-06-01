import React from 'react';
import { ImageBackground, SafeAreaView, ScrollView, View} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';
import { RegisterScn } from './register.screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export const LoginScreen = ({navigation}) => {
    return (
        <SafeAreaView style={loginStyles.appContainer}>
            <ImageBackground style={loginStyles.image} source={require('../../assets/images/login/background.png')}>
                <ScrollView contentContainerStyle={loginStyles.scrollV}>
                    <View style={loginStyles.view}>
                        <Card>
                            <Card.Title title="Log in" titleStyle={loginStyles.centerT}></Card.Title>
                            <Card.Content>
                                <TextInput label="Email"
                                    keyboardType='email-address'
                                    autoCapitalize='none'></TextInput>
                                <TextInput label="Password" 
                                    secureTextEntry={true}
                                    autoCapitalize='none'></TextInput>
                                <Button 
                                uppercase={false}
                                >Forgot email or password?</Button>
                                <Button mode="contained">Sign in</Button>
                                <Button onPress={() => navigation.navigate("Register")}>Register now!</Button>
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}