import React, { useState, useContext } from 'react';
import { View, Alert } from "react-native";
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';

export const AddExp = ({ navigation }) => {
  const { addExpense } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    if (!category || !title || !price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const date = new Date();
    const newExpense = { 
      category, 
      title, 
      price: parseFloat(price),
      date: date.toISOString() // Store date as ISO string
    };
    console.log('New Expense:', newExpense);
    addExpense(newExpense);
    navigation.goBack();
  };

  return (
    <View style={expenseStyle.container}>
      <TextInput 
        label="Category"
        value={category}
        onChangeText={setCategory}
        style={expenseStyle.textInput}
      />
      <TextInput 
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={expenseStyle.textInput}
      />
      <TextInput 
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={expenseStyle.textInput}
      />
      <Button mode="contained" onPress={handleSave} style={expenseStyle.button}>Save</Button>
    </View>
  );
};
