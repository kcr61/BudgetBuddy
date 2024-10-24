import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Switch, Modal, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';

class BudgetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      expenseName: '',
      expenseAmount: '',
      dueDate: null,
      isAutoPay: false,
      showCalendar: false,
      modalVisible: false,
      deleteIndex: null,
      budgetCategories: {
        Bills: 300,
        Shopping: 200,
        Entertainment: 100,
      },
    };
  }

  addExpense = async (e) => {
    e.preventDefault();
  
    const { expenseName, expenseAmount, dueDate, isAutoPay, expenses } = this.state;
    const cleanedAmount = expenseAmount.replace(/[^0-9.]/g, '');
  
    if (expenseName && cleanedAmount && !isNaN(cleanedAmount) && parseFloat(cleanedAmount) > 0 && dueDate) {
      this.setState({
        expenses: [...expenses, { 
          name: expenseName, 
          amount: parseFloat(cleanedAmount),
          dueDate: dueDate,
          isAutoPay: isAutoPay 
        }],
        expenseName: '',
        expenseAmount: '',
        dueDate: '',
        isAutoPay: false
      });
    } else {
      alert('Please enter valid expense details and select a due date.');
    }
    
    // Include dueDate in the budgets object
    const budgets = { 
      expenseName, 
      expenseAmount: parseFloat(cleanedAmount), 
      dueDate, // Add dueDate here
      isAutoPay 
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/budget/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(budgets),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("New Expense added");
      alert("Expense added successfully!");
  
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("There was an error adding the expense.");
    }
  };
  
  confirmDeleteExpense = (index) => {
    this.setState({ deleteIndex: index, modalVisible: true });
  };

  deleteExpense = () => {
    const { deleteIndex, expenses } = this.state;
    this.setState({
      expenses: expenses.filter((_, i) => i !== deleteIndex),
      modalVisible: false
    });
  };

  onDateSelect = (date) => {
    this.setState({ dueDate: date.dateString, showCalendar: false });
  };

  updateCategoryAmount = (category, newAmount) => {
    const parsedAmount = parseFloat(newAmount);
    if (!isNaN(parsedAmount)) {
      this.setState(prevState => ({
        budgetCategories: {
          ...prevState.budgetCategories,
          [category]: parsedAmount,
        }
      }));
    }
  };

  renderExpenseItem = ({ item, index }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text>{item.name}</Text>
        <Text>${item.amount.toFixed(2)}</Text>
        <Text>Due: {item.dueDate}</Text>
        <Text>Auto-Pay: {item.isAutoPay ? 'Yes' : 'No'}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => this.confirmDeleteExpense(index)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  renderBudgetCategoryItem = ({ item }) => {
    const [category, amount] = item;
    return (
      <View style={styles.item}>
        <Text style={styles.category}>{category}</Text>
        <TextInput
          style={styles.input}
          defaultValue={amount.toString()}
          onEndEditing={(e) => this.updateCategoryAmount(category, e.nativeEvent.text)}
          keyboardType="numeric"
        />
      </View>
    );
  };

  render() {
    const { expenses, expenseName, expenseAmount, dueDate, isAutoPay, showCalendar, modalVisible, budgetCategories } = this.state;
    const totalBudget = Object.values(budgetCategories).reduce((total, amount) => total + amount, 0);
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detailed Budget Manager</Text>

        <TextInput
          style={styles.input}
          placeholder="Expense Name"
          value={expenseName}
          onChangeText={(text) => this.setState({ expenseName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Expense Amount"
          keyboardType="numeric"
          value={expenseAmount}
          onChangeText={(text) => this.setState({ expenseAmount: text })}
        />

        <Button title={dueDate ? `Due Date: ${dueDate}` : 'Select Due Date'} onPress={() => this.setState({ showCalendar: true })} />
        
        {showCalendar && (
          <Calendar
            onDayPress={this.onDateSelect}
            markedDates={dueDate ? { [dueDate]: { selected: true, selectedColor: 'blue' } } : {}}
          />
        )}

        <View style={styles.switchContainer}>
          <Text>Auto-Pay</Text>
          <Switch
            value={isAutoPay}
            onValueChange={(value) => this.setState({ isAutoPay: value })}
          />
        </View>
        {/* NOTE -- This is the Button Press function call */}
        <Button title="Add Expense" onPress={this.addExpense} />

        <FlatList
          data={expenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderExpenseItem}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Expenses: ${totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.budgetContainer}>
          <Text style={styles.sectionTitle}>Budget by Categories</Text>
          <FlatList
            data={Object.entries(budgetCategories)}
            keyExtractor={(item) => item[0]}
            renderItem={this.renderBudgetCategoryItem}
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Budget: ${totalBudget.toFixed(2)}</Text>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete this expense?</Text>
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalButtonYes} onPress={this.deleteExpense}>
                  <Text style={styles.modalButtonText}>Yes, Delete</Text>
                </Pressable>
                <Pressable style={styles.modalButtonCancel} onPress={() => this.setState({ modalVisible: false })}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',  // Added white background
    borderRadius: 5,          // Added rounded corners
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#fff'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#025703',  // Slightly darker green for contrast
    padding: 10,                 // Added padding
    borderRadius: 5,             // Added rounded corners
  },
  switchText: {                  // New style for switch label
    color: '#fff',
    fontSize: 16,
  },
  button: {                      // New style for buttons
    backgroundColor: '#0056b3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {                  // New style for button text
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetCategoryContainer: {     // New style for budget category items
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  budgetCategoryInput: {         // New style for budget category inputs
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 100,                  // Fixed width for consistency
  },
});

export default BudgetScreen;
