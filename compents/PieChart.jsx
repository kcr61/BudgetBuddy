import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const CircularChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View>
        <Text>No expenses to display</Text>
      </View>
    );
  }

  // Calculate the total amount
  const total = data.reduce((sum, expense) => sum + expense.value, 0);

  // colors for categories
  const categoryColors = {
    Bills: '#FF6347',       // Tomato
    Rent: '#FF4500',        // OrangeRed
    Utilities: '#FF7F50',   // Coral
    Internet: '#DC143C',    // Crimson
    Shopping: '#36A2EB',    // Blue
    Groceries: '#4682B4',    // SteelBlue
    Clothing: '#1E90FF',    // DodgerBlue
    Electronics: '#00BFFF',  // DeepSkyBlue
    Eating: '#FFCE56',      // Yellow
    Restaurants: '#FFD700', // Gold
    FastFood: '#FFA500',    // Orange
    Others: '#4BC0C0',      // Teal
    Miscellaneous: '#008080',// Teal
  };

  const chartData = data.map(expense => {
    const percentage = ((expense.value / total) * 100).toFixed(2);

    return {
      name: `${expense.name}: $${expense.value.toFixed(2)} (${percentage}%)`, 
      amount: expense.value,                                               
      color: categoryColors[expense.name] || '#999999', 
      legendFontColor: "#036704",
      legendFontSize: 12,
    };
  });

  return (
    <View>
      <PieChart
        data={chartData} 
        width={360}
        height={150}
        chartConfig={{
          backgroundColor: "#036704",
          backgroundGradientFrom: "#036704",
          backgroundGradientTo: "#036704",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 0
          }
        }}
        accessor="amount" 
        paddingLeft="0"
        center={[10, 10]}
        absolute
      />
      <Text>Total Expenses: ${total.toFixed(2)}</Text>
    </View>
  );
};

export default CircularChart;
