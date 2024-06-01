import React from 'react';
import { ImageBackground, View, ScrollView} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles } from './login.screenstyle';

export const RegisterScn= () => {
    return (
        <SafeAreaView style={loginStyles.appContainer}>
            <ImageBackground style={loginStyles.image} source={require('../../assets/images/login/background.png')}>
                <ScrollView contentContainerStyle={loginStyles.scrollV}>
                    <View style={loginStyles.view}>
                        <Card>
                            <Card.Title title="Register!" titleStyle={loginStyles.centerT}></Card.Title>
                            <Card.Content>
                                <TextInput label="Username" style={loginStyles.textIn}></TextInput>
                                <TextInput label="Email"
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    style={loginStyles.textIn}></TextInput>
                                <TextInput label="Password" 
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    style={loginStyles.textIn}></TextInput>
                                <Button mode="contained">Sign up</Button>
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}