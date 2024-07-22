import React, { useState, useContext } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';

const categories = ['Food', 'Health', 'Clothing', 'Household', 'Transport', 'Travel', 'Utilities', 'Entertainment', 'Payments', 'Personal', 'Others'];

export const BudgetScreen = ({ navigation }) => {
  const { state, setBudgets } = useContext(AuthContext);
  const [budgets, setLocalBudgets] = useState(state.budgets || {});

  const handleSave = () => {
    setBudgets(budgets);
    Alert.alert("Success", "Budgets saved successfully.");
    navigation.goBack();
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
