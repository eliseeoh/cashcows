import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, View, Alert, ScrollView } from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = ['Food', 'Health', 'Clothing', 'Household', 'Transport', 'Travel', 'Utilities', 'Entertainment', 'Payments', 'Personal', 'Others'];

export const Exp = ({ navigation }) => {
  const { state, deleteExpense } = useContext(AuthContext);
  const { expenses, budgets } = state;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sum, setSum] = useState(0);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryTotal, setCategoryTotal] = useState(0);

  useEffect(() => {
    const currentMonthExpenses = expenses[selectedMonth] || [];
    const total = currentMonthExpenses.reduce((acc, expense) => acc + expense.price, 0);
    setSum(total);

    const grouped = currentMonthExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    }, {});

    setGroupedExpenses(grouped);
    setSelectedCategory(''); // Reset selected category when month changes
    setCategoryTotal(0); // Reset category total when month changes

  // Save the total expense to the database
  const saveTotalExpense = async () => {
    try {
      const userDocRef = doc(db, 'users', state.user.uid); // Assuming user.uid is the user ID
      await updateDoc(userDocRef, {
        totalExpense: total,
      });
      console.log('Total expense saved successfully.');
    } catch (error) {
      console.error('Error saving total expense:', error);
    }
  };
  saveTotalExpense();
  }, [selectedMonth, expenses]);

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const total = groupedExpenses[category]?.reduce((acc, expense) => acc + expense.price, 0) || 0;
    setCategoryTotal(total);
  };

  const handleDelete = async (expenseId, expenseDate) => {
    try {
      await deleteExpense(expenseId, expenseDate);
      Alert.alert("Success", "Expense deleted successfully.");
    } catch (error) {
      console.error("Error deleting expense:", error);
      Alert.alert("Error", "Failed to delete expense.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={expenseStyle.item}>
      <Text>{item.title} - ${item.price.toFixed(2)}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
      <Button mode="text" onPress={() => navigation.navigate("AddExpense", { expense: item })}>Edit</Button>
      <Button mode="text" onPress={() => handleDelete(item.id, item.date)}>Delete</Button>
    </View>
  );

  const renderCategoryButtons = () => {
    return (
      <>
        <Button
          mode="contained"
          onPress={() => {
            setSelectedCategory('');
            setCategoryTotal(sum); // Show the total for all categories
          }}
          style={expenseStyle.categoryButton}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            mode="contained"
            onPress={() => handleCategorySelect(category)}
            style={expenseStyle.categoryButton}
          >
            {category}
          </Button>
        ))}
      </>
    );
  };

  const renderExpenses = () => {
    const data = selectedCategory ? groupedExpenses[selectedCategory] : expenses[selectedMonth] || [];
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    );
  };

  const budget = selectedCategory ? budgets[selectedCategory] : Object.values(budgets || {}).reduce((acc, budget) => acc + budget, 0);
  const progress = budget ? (categoryTotal / budget) : 0;

  return (
    <View style={expenseStyle.container}>
      <Text style={expenseStyle.total}>Total: ${sum.toFixed(2)}</Text>
      {selectedCategory && (
        <View>
          <Text style={expenseStyle.categoryTotal}>
            {selectedCategory} Total: ${categoryTotal.toFixed(2)}
          </Text>
          {budget ? (
            <View style={expenseStyle.progressContainer}>
              <Progress.Bar progress={progress} width={200} />
              <Text>{categoryTotal.toFixed(2)} / {budget}</Text>
            </View>
          ) : null}
        </View>
      )}
      <View style={expenseStyle.navBar}>
        <Button 
          icon={() => <MaterialCommunityIcons name="step-backward" size={24} color="black" />}
          onPress={handlePrevMonth}></Button>
        <Text style={expenseStyle.monthText}>{months[selectedMonth]}</Text>
        <Button
          onPress={handleNextMonth}
          icon={() => <MaterialCommunityIcons name="step-forward" size={24} color="black" />}></Button>
      </View>
      <ScrollView contentContainerStyle={expenseStyle.categoryButtonsContainer}>
        {renderCategoryButtons()}
      </ScrollView>
      <View style={expenseStyle.expensesListContainer}>
        {renderExpenses()}
      </View>
      <View style={expenseStyle.actions}>
        <Button
          mode='contained'
          icon={() => <MaterialCommunityIcons name="plus" size={24} color="black" />}
          onPress={() => navigation.navigate("AddExpense", { selectedMonth })}>
          Add
        </Button>
        <Button
          mode='contained'
          icon={() => <MaterialCommunityIcons name="currency-usd" size={24} color="black" />}
          onPress={() => navigation.navigate("BudgetScreen")}>
          Budget
        </Button>
      </View>
    </View>
  );
};


