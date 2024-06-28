import React, {useState} from 'react';
import { auth } from '../../config/firebaseConfig';
import { Text, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Exp} from './expense.screen'
import {Settings} from './settings.screen'
import {Friends} from './friends.screen'

const Tab = createBottomTabNavigator();

export const Homepage = () => {

    return (
            <Tab.Navigator>
                <Tab.Screen name="Expenses" component={Exp}/>
                <Tab.Screen name="Friends" component={Friends}/> 
                <Tab.Screen name="Profile" component={Settings}/>
            </Tab.Navigator>
    )
}