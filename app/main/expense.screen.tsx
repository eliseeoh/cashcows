import React, {useState, useEffect} from 'react';
import { Text, FlatList, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle} from './settings.screenstyle';
import {TextInput, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const janExp = [
    {
        category: 'food',
        title: "salad",
        price: 7
    },
    {
        category: 'transport',
        title: "bus",
        price: 1.5
    }
]

const febExp = [
    {
        category: 'food',
        title: "fried rice",
        price: 2
    },
    {
        category: 'transport',
        title: "grab",
        price: 15.5
    }
]

export const yrExpenses = [janExp,febExp]
const months = ['January', 'February']

export const Exp = ({navigation}) => {
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [sum, setSum] = useState(0);

    useEffect(() => {
        // Calculate the sum of expenses for the selected month
        const total = yrExpenses[selectedMonth].reduce((acc, expense) => acc + expense.price, 0);
        setSum(total);
    }, [selectedMonth]);

    const handlePrevMonth = () => {
        setSelectedMonth((prev) => (prev === 0 ? yrExpenses.length - 1 : prev - 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth((prev) => (prev === yrExpenses.length - 1 ? 0 : prev + 1));
    };

    const renderItem = ({ item }) => (
        <View style={expenseStyle.item}>
            <Text>{item.title} - ${item.price}</Text>
        </View>
    );

    return (

         <View style={expenseStyle.container}>
            <Text style={expenseStyle.total}>Total: ${sum.toFixed(2)}</Text>
            <View style={expenseStyle.navBar}>
                <Button 
                    icon={() => <MaterialCommunityIcons name="step-backward" size={24} color="black" />}
                    onPress={handlePrevMonth}></Button>
                <Text style={expenseStyle.monthText}>{months[selectedMonth]}</Text>
                <Button
                    onPress={handleNextMonth}
                    icon={() => <MaterialCommunityIcons name="step-forward" size={24} color="black" />}></Button>
            </View>
            <FlatList
                data={yrExpenses[selectedMonth]}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
            />
            <View style={expenseStyle.add}>
                <Button
                    mode='contained'
                    icon={() => <MaterialCommunityIcons name="plus" size={24} color="black" />}
                    onPress={() => navigation.navigate("AddExpense")}>Add</Button>
            </View>
        </View>
    )
}