import React, {useState} from 'react';
import { auth } from '../../config/firebaseConfig';
import { Text, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export const Friends = () => {
    return (
        <Text>Groups</Text>
    )
}