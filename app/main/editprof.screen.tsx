import React, {useState} from 'react';
import { auth } from '../../config/firebaseConfig';
import { Text, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TextInput } from 'react-native-paper';

export const Edit = () => {
    return (
        <View>
            <Button title= "Save"/>
        </View>
    )
}