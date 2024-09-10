import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';

const BudgetScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Function to add a new expense
  const addExpense = () => {
    // Remove non-numeric characters except decimal point
    const cleanedAmount = expenseAmount.replace(/[^0-9.]/g, '');
    if (expenseName && cleanedAmount) {
      setExpenses([...expenses, { name: expenseName, amount: parseFloat(cleanedAmount) }]);
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  // Function to delete an expense by index
  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // Render each expense item
  const renderExpenseItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>${item.amount.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => deleteExpense(index)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // Calculate total expense amount
  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />

      <TextInput
        style={styles.input}
        placeholder="Expense Amount"
        keyboardType="numeric"
        value={expenseAmount}
        onChangeText={setExpenseAmount}
      />

      <Button title="Add Expense" onPress={addExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExpenseItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

// Styles for the Budget Tab
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BudgetScreen;
