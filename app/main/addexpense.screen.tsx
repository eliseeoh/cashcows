import React, { useState, useContext } from 'react';
import { View, Alert, Text, Platform } from "react-native";
import { TextInput, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Constants
const categories = ['Food', 'Health', 'Clothing', 'Household', 'Transport', 'Travel', 'Utilities', 'Entertainment', 'Payments', 'Personal', 'Gifts', 'Miscellaneous'];

export const AddExp = ({ navigation, route }) => {
  const { addExpense, editExpense } = useContext(AuthContext);
  const { expense } = route.params || {};
  const [category, setCategory] = useState(expense ? expense.category : categories[0]);
  const [title, setTitle] = useState(expense ? expense.title : '');
  const [price, setPrice] = useState(expense ? expense.price.toString() : '');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(expense ? expense.category : null);
  const [items, setItems] = useState(
    categories.map(cat => ({ label: cat, value: cat }))
  );
  const [date, setDate] = useState(expense ? new Date(expense.date) : new Date());
  const [show, setShow] = useState(false);

  const handleSave = async () => {
    if (!value || !title || !price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const newExpense = { 
      category: value, 
      title, 
      price: parseFloat(price),
      date: date.toISOString() // Store date as ISO string
    };

    try {
      if (expense) {
        // Update existing expense
        await editExpense({ ...newExpense, id: expense.id }, expense.date);
        Alert.alert("Success", "Expense updated successfully.");
      } else {
        // Add new expense
        await addExpense(newExpense);
        Alert.alert("Success", "Expense added successfully.");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving expense:", error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'android');
    setDate(currentDate);
  };

  return (
    <View style={expenseStyle.container}>
      <DropDownPicker 
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select a category"
        style={expenseStyle.dropdown}
        dropDownContainerStyle={expenseStyle.dropdownContainer}
      />
      <TextInput 
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={expenseStyle.textInput}
        mode="outlined"
        theme={{ colors: { background: '#f2f2f2' } }} // Set faint grey background
      />
      <TextInput 
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={expenseStyle.textInput}
        mode="outlined"
        theme={{ colors: { background: '#f2f2f2' } }} // Set faint grey background
      />
      <Button onPress={() => setShow(true)} style={expenseStyle.button} labelStyle={expenseStyle.buttonLabel}>
        Select Date
      </Button>
      <Text>{date.toDateString()}</Text>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Button mode="contained" onPress={handleSave} style={expenseStyle.smallButton} labelStyle={expenseStyle.smallButtonText}>
        {expense ? 'Update' : 'Save'}
      </Button>
    </View>
  );
};
