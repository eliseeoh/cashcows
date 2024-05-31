import React from 'react';
import { SafeAreaView, View} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';

export const LoginScreen = () => {
    return (
        <SafeAreaView style={loginStyles.appContainer}>
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
                        <Button uppercase={false}>Forgot email or password?</Button>
                        <Button mode="contained">Sign in</Button>
                        <Button>Register now!</Button>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    )
}