import React, {useState} from 'react';
import { Text, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {TextInput, Button, Card } from 'react-native-paper';
import {yrExpenses} from './expense.screen'

export const AddExp = () => {
    const [newExpense, setNewExpense] = useState({ category: '', title: '', price: 0 });

    const addExpense = () => {
        // Validate new expense input
        if (!newExpense.category || !newExpense.title || newExpense.price <= 0) {
            alert('Please fill out all fields and ensure price is greater than 0.');
            return;
        }

        // Add new expense to the selected month's expenses
        yrExpenses[selectedMonth] = [...yrExpenses[selectedMonth], newExpense];
        setNewExpense({ category: '', title: '', price: 0 }); // Clear input fields after adding expense
    };

    return (
        <View>
            <TextInput label="Category"></TextInput>
            <TextInput label="Name"></TextInput>
            <TextInput label="Price"></TextInput>
            <Button mode="contained">Save</Button>
        </View>
    )
}