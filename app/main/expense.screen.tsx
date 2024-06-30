import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, View, ScrollView } from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { expenseStyle } from './settings.screenstyle';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Exp = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const { expenses } = state;
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

  const renderItem = ({ item }) => (
    <View style={expenseStyle.item}>
      <Text>{item.title} - ${item.price.toFixed(2)}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
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
        {Object.keys(groupedExpenses).map((category) => (
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

  return (
    <View style={expenseStyle.container}>
      <Text style={expenseStyle.total}>Total: ${sum.toFixed(2)}</Text>
      {selectedCategory && (
        <Text style={expenseStyle.categoryTotal}>
          {selectedCategory} Total: ${categoryTotal.toFixed(2)}
        </Text>
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
      {renderExpenses()}
      <View style={expenseStyle.add}>
        <Button
          mode='contained'
          icon={() => <MaterialCommunityIcons name="plus" size={24} color="black" />}
          onPress={() => navigation.navigate("AddExpense", { selectedMonth })}>Add</Button>
      </View>
    </View>
  );
};
