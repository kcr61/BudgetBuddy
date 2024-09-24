import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Switch, Modal, Pressable, SafeAreaView, Picker } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CircularChart from '../../compents/PieChart.jsx';

const BudgetScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [isAutoPay, setIsAutoPay] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const categories = ['Bills', 'Shopping', 'Eating', 'Others'];

    const addExpense = () => {
        const cleanedAmount = expenseAmount.replace(/[^0-9.]/g, '');
        if (expenseName && cleanedAmount && !isNaN(cleanedAmount) && parseFloat(cleanedAmount) > 0 && dueDate && category) {
            setExpenses([...expenses, { 
                name: expenseName, 
                amount: parseFloat(cleanedAmount),
                dueDate: dueDate,
                category: category,
                isAutoPay: isAutoPay 
            }]);
            resetForm();
        } else {
            alert('Please enter valid expense details, select a category, and choose a due date.');
        }
    };

    const resetForm = () => {
        setExpenseName('');
        setExpenseAmount('');
        setCategory('');
        setDueDate(null);
        setIsAutoPay(false);
    };

    const deleteExpense = () => {
        const updatedExpenses = expenses.filter((_, i) => i !== deleteIndex);
        setExpenses(updatedExpenses);
        setModalVisible(false); 
    };

    const calculateCategoryTotals = () => {
        const categoryTotals = {};
        categories.forEach(cat => categoryTotals[cat] = 0);

        expenses.forEach(expense => {
            if (categoryTotals[expense.category] !== undefined) {
                categoryTotals[expense.category] += expense.amount;
            }
        });

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value
        })) || []; 
    };

    const renderExpenseItem = ({ item, index }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <Text>{item.name}</Text>
                <Text>${item.amount.toFixed(2)}</Text>
                <Text>Due: {item.dueDate}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Auto-Pay: {item.isAutoPay ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => { setDeleteIndex(index); setModalVisible(true); }}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.largeTitle}>Transactions</Text>
            <View style={styles.header}>
                <CircularChart data={calculateCategoryTotals()} style={styles.chart} />
            </View>

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
            
            <Picker 
                selectedValue={category} 
                style={styles.picker} 
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Select Category" value="" />
                {categories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
            </Picker>

            <Button 
                title={dueDate ? `Due Date: ${dueDate}` : 'Select Due Date'} 
                onPress={() => setShowCalendar(true)} 
            />

            {showCalendar && (
                <Calendar
                    onDayPress={(date) => {
                        setDueDate(date.dateString);
                        setShowCalendar(false);
                    }}
                    markedDates={dueDate ? { [dueDate]: { selected: true, selectedColor: 'blue' } } : {}}
                />
            )}

            <View style={styles.switchContainer}>
                <Text>Auto-Pay</Text>
                <Switch value={isAutoPay} onValueChange={setIsAutoPay} />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#8aecc7',
    },
    largeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    chart: {
        flex: 1,
        alignSelf: 'flex-start',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    itemContent: {
        flex: 1,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
    totalContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonYes: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default BudgetScreen;
