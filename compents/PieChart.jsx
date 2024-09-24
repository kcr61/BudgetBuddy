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
    Bills: '#FF6347',    // Tomato
    Shopping: '#36A2EB', // Blue
    Eating: '#FFCE56',   // Yellow
    Others: '#4BC0C0',   // Teal
  };

  const chartData = data.map(expense => {
    const percentage = ((expense.value / total) * 100).toFixed(2);

    return {
      name: `${expense.name}: $${expense.value.toFixed(2)} (${percentage}%)`, 
      amount: expense.value,                                               
      color: categoryColors[expense.name] || '#999999',                   
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    };
  });

  return (
    <View>
      <PieChart
        data={chartData} 
        width={600}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        accessor="amount" 
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
      <Text>Total Expenses: ${total.toFixed(2)}</Text>
    </View>
  );
};

export default CircularChart;
