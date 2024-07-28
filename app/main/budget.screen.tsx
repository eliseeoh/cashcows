import React, { useState, useContext } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';
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
        <Card key={category} style={expenseStyle.card}>
          <Card.Title title={category} />
          <Card.Content>
            <TextInput
              label="Budget"
              value={budgets[category]?.toString() || ''}
              onChangeText={(text) => handleInputChange(text, category)}
              keyboardType="numeric"
              style={expenseStyle.textInput}
              mode="outlined"
              theme={{ colors: { background: '#f2f2f2' } }} // Set faint grey background
            />
          </Card.Content>
        </Card>
      ))}
      <Button mode="contained" onPress={handleSave} style={expenseStyle.button}>
        Save Budgets
      </Button>
    </ScrollView>
  );
};
