import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { AuthContext } from '../../authentication/authContext';
import { Dimensions } from 'react-native';
import { expenseStyle, analytics, groupStyle } from './settings.screenstyle';
import { Bar } from 'react-native-progress';

const screenWidth = Dimensions.get('window').width;

const Analytics = () => {
  const { state } = useContext(AuthContext);
  const { expenses, budgets } = state;
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const currentMonthExpenses = expenses[new Date().getFullYear()]?.[selectedMonth] || [];
    const groupedExpenses = currentMonthExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.price;
      return acc;
    }, {});

    const chartData = Object.keys(groupedExpenses).map((category, index) => ({
      name: category,
      amount: groupedExpenses[category],
      color: getShadeOfGrey(index), // Function to generate random color for each category
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));

    setData(chartData);
  }, [expenses, selectedMonth]);

  const shadesOfGrey = [
    '#000000', '#DCDCDC', '#808080', '#696969', '#778899',
    '#778899', '#2F2F2F', '#2F4F4F', '#CBC1AR', '#786F80'
  ];

  const getShadeOfGrey = (index) => {
    return shadesOfGrey[index % shadesOfGrey.length];
  };

  const handleLegendClick = (data) => {
    setSelectedCategory(data);
  };

  const calculatePercentage = (amount) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    return ((amount / total) * 100).toFixed(2);
  };

  const calculateBudgetPercentage = (amount, category) => {
    const budget = budgets[category] || 0;
    return budget ? ((amount / budget) * 100).toFixed(2) : -100;
  };

  return (
    <ScrollView style={expenseStyle.container}>
      <Text style={groupStyle.title}>Expenses by Category</Text>
        <Text style={groupStyle.subtitle}>Select Month: </Text>
      <View style={analytics.pickerWrapper}>
        <Picker
          selectedValue={selectedMonth}
          style={analytics.dropdown}
          onValueChange={(itemValue) => {
            setSelectedMonth(itemValue);
            setSelectedCategory(null);
        }}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={index} />
          ))}
        </Picker>
      </View>
      {data.length > 0 ? (
        <View>
            <PieChart
              data={data}
              width={screenWidth - 16}
              height={220}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
            />
            <View style={analytics.divider}></View>
            <View style={analytics.legendContainer}>
            {data.map((item, index) => (
              <TouchableOpacity key={index} style={analytics.legendItem} onPress={() => handleLegendClick(item)}>
                <View style={[analytics.legendColorBox, { backgroundColor: item.color }]} />
                <Text style={analytics.legendText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={analytics.divider}></View>
        </View>
      ) : (
        <Text>No data available for the selected month.</Text>
      )}
      {selectedCategory && (
        <View style={analytics.selectedCategoryContainer}>
          <Text style={groupStyle.title}>
            {selectedCategory.name}
          </Text>
          <Text style={groupStyle.subtitle}>
            Amount Spent: <Text style={{ fontWeight: 'bold' }}>${selectedCategory.amount.toFixed(2)}</Text>
          </Text>
          <Text style={groupStyle.subtitle}>
            Percentage of Total: <Text style={{ fontWeight: 'bold' }}>{calculatePercentage(selectedCategory.amount)}%</Text>
          </Text>
          <View>
            <Bar 
                progress={selectedCategory.amount / data.reduce((sum, item) => sum + item.amount, 0)} 
                width={screenWidth - 75} 
                height={20} 
                color="black" 
                borderWidth={1} 
                borderColor="black"
            />
          </View>
          <Text style={groupStyle.subtitle}>
            Percentage of Budget Spent: <Text style={{ fontWeight: 'bold' }}>{calculateBudgetPercentage(selectedCategory.amount, selectedCategory.name)}%</Text>
          </Text>
          <View style={analytics.progressBarContainer}>
            <Bar 
              progress={selectedCategory.amount / (budgets[selectedCategory.name] || 1)} 
              width={screenWidth - 75} 
              height={20} 
              color="black" 
              borderWidth={1} 
              borderColor="black"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Analytics;
