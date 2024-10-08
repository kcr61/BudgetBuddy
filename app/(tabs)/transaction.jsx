import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Switch, Modal, Pressable, SafeAreaView, Picker } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CircularChart from '../../compents/PieChart.jsx'; 

const BudgetScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [isAutoPay, setIsAutoPay] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Category and subcategory mapping
    const categories = {
        Bills: ['Rent', 'Utilities', 'Internet'],
        Shopping: ['Groceries', 'Clothing', 'Electronics'],
        Eating: ['Restaurants', 'FastFood'],
        Others: ['Miscellaneous']
    };

    // Colors associated with each category
    const categoryColors = {
        Bills: '#FF6347',
        Rent: '#FF4500',
        Utilities: '#FF7F50',
        Internet: '#DC143C',
        Shopping: '#36A2EB',
        Groceries: '#4682B4',
        Clothing: '#1E90FF',
        Electronics: '#00BFFF',
        Eating: '#FFCE56',
        Restaurants: '#FFD700',
        FastFood: '#FFA500',
        Others: '#4BC0C0',
        Miscellaneous: '#008080',
    };

    // Function to add a new expense to the list
    const addExpense = () => {
        const cleanedAmount = expenseAmount.replace(/[^0-9.]/g, '');
        if (expenseName && cleanedAmount && !isNaN(cleanedAmount) && parseFloat(cleanedAmount) > 0 && dueDate && category && subCategory) {
            setExpenses([...expenses, { 
                name: expenseName, 
                amount: parseFloat(cleanedAmount),
                dueDate: dueDate,
                category: category,
                subCategory: subCategory,
                isAutoPay: isAutoPay 
            }]);
            resetForm(); 
        } else {
            alert('Please enter valid expense details, select a category and subcategory, and choose a due date.');
        }
    };

    const resetForm = () => {
        setExpenseName('');
        setExpenseAmount('');
        setCategory('');
        setSubCategory('');
        setDueDate(null);
        setIsAutoPay(false);
    };

    // Function to delete an expense
    const deleteExpense = () => {
        const updatedExpenses = expenses.filter((_, i) => i !== deleteIndex);
        setExpenses(updatedExpenses);
        setModalVisible(false); 
    };

    // Function to calculate totals for each category
    const calculateCategoryTotals = () => {
        const categoryTotals = {};
        
        // Initialize totals for categories
        Object.keys(categories).forEach(cat => categoryTotals[cat] = 0);

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

    // Function to render each expense item in the FlatList
    const renderExpenseItem = ({ item, index }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <Text>{item.name}</Text>
                <Text>${item.amount.toFixed(2)}</Text>
                <Text>Due: {item.dueDate}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Subcategory: {item.subCategory}</Text>
                <Text>Auto-Pay: {item.isAutoPay ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => { setDeleteIndex(index); setModalVisible(true); }}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.largeTitle}>Transactions</Text>
            <View style={styles.header}>
                <CircularChart data={calculateCategoryTotals()} style={styles.chart} />
            </View>

            {/* Input fields for adding new expenses */}
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
            
            {/* How to select a category */}
            <Picker 
                selectedValue={category} 
                style={styles.picker} 
                onValueChange={(itemValue) => { 
                    setCategory(itemValue); 
                    setSubCategory(''); 
                }}
            >
                <Picker.Item label="Select Category" value="" />
                {Object.keys(categories).map(cat => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                ))}
            </Picker>

            {/* How to select a subcategory */}
            <Picker 
                selectedValue={subCategory} 
                style={styles.picker} 
                enabled={category.length > 0} 
                onValueChange={(itemValue) => setSubCategory(itemValue)}
            >
                <Picker.Item label="Select Subcategory" value="" />
                {category && categories[category].map(subCat => (
                    <Picker.Item key={subCat} label={subCat} value={subCat} />
                ))}
            </Picker>

            {/* Button to select due date */}
            <Button 
                title={dueDate ? `Due Date: ${dueDate}` : 'Select Due Date'} 
                onPress={() => setShowCalendar(true)} 
            />

            {/* Calendar for selecting due date */}
            {showCalendar && (
                <Calendar
                    onDayPress={(date) => {
                        setDueDate(date.dateString);
                        setShowCalendar(false);
                    }}
                    markedDates={dueDate ? { [dueDate]: { selected: true, selectedColor: 'blue' } } : {}}
                />
            )}

            {/* Switch for enabling/disabling auto-pay */}
            <View style={styles.switchContainer}>
                <Text>Auto-Pay</Text>
                <Switch value={isAutoPay} onValueChange={setIsAutoPay} />
            </View>

            {/* Button to add the expense */}
            <Button title="Add Expense" onPress={addExpense} />

            {/* FlatList for displaying expenses */}
            <FlatList
                data={expenses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderExpenseItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {}
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
        backgroundColor: '#036704',
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
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#CED0CE',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    itemContent: {
        flex: 1,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
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
        marginRight: 5,
    },
    modalButtonCancel: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default BudgetScreen;
