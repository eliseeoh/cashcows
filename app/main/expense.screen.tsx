import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { doc, updateDoc } from 'firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from '../../authentication/authContext';
import { db } from '../../config/firebaseConfig';
import { expenseStyle } from './settings.screenstyle';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = ['Food', 'Health', 'Clothing', 'Household', 'Transport', 'Travel', 'Utilities', 'Entertainment', 'Payments', 'Personal', 'Others'];

export const Exp = ({ navigation }) => {
  const { state, deleteExpense } = useContext(AuthContext);
  const { expenses, budgets } = state;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sum, setSum] = useState(0);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const currentMonthExpenses = expenses[selectedYear]?.[selectedMonth] || [];
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
  }, [selectedYear, selectedMonth, expenses]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
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
      <View style={expenseStyle.itemText}>
        <Text>{item.title} - ${item.price.toFixed(2)}</Text>
        <Text>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={expenseStyle.itemButtons}>
        <Button
          mode="text"
          onPress={() => navigation.navigate("AddExpense", { expense: item })}
          style={expenseStyle.iconButton}
          icon="pencil"
        />
        <Button
          mode="text"
          onPress={() => handleDelete(item.id, item.date)}
          style={expenseStyle.iconButton}
          icon="trash-can"
        />
      </View>
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
    const data = selectedCategory ? groupedExpenses[selectedCategory] : expenses[selectedYear]?.[selectedMonth] || [];
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

  // Calculate total budget and progress
  const totalBudget = Object.values(budgets || {}).reduce((acc, budget) => acc + budget, 0);
  const totalProgress = totalBudget ? (sum / totalBudget) : 0;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setSelectedYear(year);
    setSelectedMonth(month);
    hideDatePicker();
  };

  return (
    <View style={expenseStyle.container}>
      <Text style={expenseStyle.total}>Total: ${sum.toFixed(2)}</Text>
      {totalBudget > 0 && (
        <View style={expenseStyle.progressContainer}>
          <Progress.Bar progress={totalProgress} width={200} />
          <Text>{sum.toFixed(2)} / {totalBudget.toFixed(2)}</Text>
        </View>
      )}
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
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={expenseStyle.monthText}>{`${months[selectedMonth]} ${selectedYear}`}</Text>
        </TouchableOpacity>
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
          onPress={() => navigation.navigate("AddExpense", { selectedYear, selectedMonth })}>
          Add
        </Button>
        <Button
          mode='contained'
          icon={() => <MaterialCommunityIcons name="currency-usd" size={24} color="black" />}
          onPress={() => navigation.navigate("BudgetScreen")}>
          Budget
        </Button>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="calendar"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date(2000, 0, 1)} // Set minimum date to January 1, 2000
        maximumDate={new Date(2100, 11, 31)} // Set maximum date to December 31, 2100
      />
    </View>
  );
};

