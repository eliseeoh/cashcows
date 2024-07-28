import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Alert, ScrollView, Pressable } from 'react-native';
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle, friendStyle } from './settings.screenstyle';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const categories = ['Food', 'Health', 'Clothing', 'Household', 'Transport', 'Travel', 'Utilities', 'Entertainment', 'Payments', 'Personal', 'Gifts', 'Miscellaneous'];

export const BudgetScreen = ({ navigation }) => {
  const { state, setBudgets } = useContext(AuthContext);
  const [budgets, setLocalBudgets] = useState(state.budgets || {});

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', state.user.uid); // Assuming state.user.uid contains the user ID
      await updateDoc(userRef, { budgets });
      setBudgets(budgets);
      Alert.alert("Success", "Budgets saved successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving budgets:", error);
      Alert.alert("Error", "Failed to save budgets.");
    }
  };

  const handleInputChange = (text, category) => {
    if (text === '') {
      setLocalBudgets({ ...budgets, [category]: '' });
    } else {
      const parsedValue = parseFloat(text);
      if (!isNaN(parsedValue)) {
        setLocalBudgets({ ...budgets, [category]: parsedValue });
      }
    }
  };

  return (
    <ScrollView style={expenseStyle.container}>
      {categories.map((category) => (
        <View key={category} style={expenseStyle.card}>
        <Text style={expenseStyle.title}>{category}</Text>
        <TextInput
          placeholder="Budget"
          value={budgets[category]?.toString() || ''}
          onChangeText={(text) => handleInputChange(text, category)}
          keyboardType="numeric"
          style={expenseStyle.textInput}
        />
      </View>
      ))}
      <Pressable onPress={handleSave} style={friendStyle.button}>
        <Text style={friendStyle.buttonText}>Save Budgets</Text>
      </Pressable>
    </ScrollView>
  );
};
