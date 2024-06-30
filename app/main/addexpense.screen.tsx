import React, {useState} from 'react';
import { Text, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {TextInput, Button, Card } from 'react-native-paper';

export const AddExp = () => {
    const [newExpense, setNewExpense] = useState({ category: '', title: '', price: 0 });
    return (
        <View>
            <TextInput label="Category"></TextInput>
            <TextInput label="Name"></TextInput>
            <TextInput label="Price"></TextInput>
            <Button mode="contained">Save</Button>
        </View>
    )
}