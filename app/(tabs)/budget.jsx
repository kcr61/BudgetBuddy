import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Switch, Modal, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';

const BudgetScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [isAutoPay, setIsAutoPay] = useState(false);
  const [open, setOpen] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); // Index of expense to be deleted

  // Function to add a new expense
  const addExpense = () => {
    const cleanedAmount = expenseAmount.replace(/[^0-9.]/g, '');
    if (expenseName && cleanedAmount && dueDate) {
      setExpenses([...expenses, { 
        name: expenseName, 
        amount: parseFloat(cleanedAmount),
        dueDate: dueDate.toISOString().split('T')[0],  // Save the date in 'YYYY-MM-DD' format
        isAutoPay: isAutoPay 
      }]);
      setExpenseName('');
      setExpenseAmount('');
      setDueDate(new Date());
      setIsAutoPay(false);
    }
  };

  // Function to confirm delete action
  const confirmDeleteExpense = (index) => {
    setDeleteIndex(index);
    setModalVisible(true);
  };

  // Function to delete the expense
  const deleteExpense = () => {
    const updatedExpenses = expenses.filter((_, i) => i !== deleteIndex);
    setExpenses(updatedExpenses);
    setModalVisible(false); // Hide the modal after deletion
  };

  // Render each expense item
  const renderExpenseItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text>{item.name}</Text>
          <Text>${item.amount.toFixed(2)}</Text>
          <Text>Due: {item.dueDate}</Text>
          <Text>Auto-Pay: {item.isAutoPay ? 'Yes' : 'No'}</Text>
        </View>
        {}
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => confirmDeleteExpense(index)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

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

      {/* Date Picker for Due Date */}
      <Button title="Select Due Date" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={dueDate}
        onConfirm={(date) => {
          setOpen(false);
          setDueDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {/*Auto-Pay Slider */}
      <View style={styles.switchContainer}>
        <Text>Auto-Pay</Text>
        <Switch
          value={isAutoPay}
          onValueChange={setIsAutoPay}
        />
      </View>

      <Button title="Add Expense" onPress={addExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExpenseItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Confirmation Selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this expense?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonYes} onPress={deleteExpense}>
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </Pressable>
              <Pressable style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButtonYes: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default BudgetScreen;
