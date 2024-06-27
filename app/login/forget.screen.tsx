import React, {useState} from 'react';
import { ImageBackground, View, ScrollView, Alert} from "react-native";
import {TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';

export const ForgetScn= () => {
    const [email, setEmail] = useState('');

    return (
        <ImageBackground style={loginStyles.image} 
                source={require('../../assets/images/login/background.png')}
                resizeMode='cover'>
                    <View style={loginStyles.viewReg}>
                        <Card>
                            <Card.Title title="Enter your email" titleStyle={loginStyles.centerT}></Card.Title>
                            <Card.Content>
                                <TextInput label="Email"
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    style={loginStyles.textIn}
                                    onChangeText={setEmail}></TextInput>
                            </Card.Content>
                        </Card>
                    </View>
            </ImageBackground>
    )
}