import React, { useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Switch, 
    Modal, 
    Pressable, 
    SafeAreaView,
    ScrollView,
    Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
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

    const categories = {
        Bills: ['Rent', 'Utilities', 'Internet'],
        Shopping: ['Groceries', 'Clothing', 'Electronics'],
        Eating: ['Restaurants', 'FastFood'],
        Others: ['Miscellaneous']
    };

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

    const renderPicker = (items, placeholder, value, onValueChange) => {
        return (
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
                >
                    <Picker.Item label={placeholder} value="" />
                    {items.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>
        );
    };

    // NOTE -- Basically the 'click' variable
    const addExpense = async(e) => {
        e.preventDefault();

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

        // Include dueDate in the budgets object
        const transactions = { 
            expenseName, 
            expenseAmount: parseFloat(cleanedAmount), 
            category,
            subCategory,
            dueDate, // Add dueDate here
            isAutoPay 
        };
    
      try {
        const response = await fetch("http://localhost:3000/api/transaction/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(transactions),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("New Transaction added");
        alert("Transaction added successfully!");
    
      } catch (error) {
        console.error("Error adding Transaction:", error);
        alert("There was an error adding the transaction.");
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

    const deleteExpense = () => {
        const updatedExpenses = expenses.filter((_, i) => i !== deleteIndex);
        setExpenses(updatedExpenses);
        setModalVisible(false);
    };

    const calculateCategoryTotals = () => {
        const categoryTotals = {};
        Object.keys(categories).forEach(cat => categoryTotals[cat] = 0);
        expenses.forEach(expense => {
            if (categoryTotals[expense.category] !== undefined) {
                categoryTotals[expense.category] += expense.amount;
            }
        });
        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value
        }));
    };

    const renderExpenseItem = ({ item, index }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemText}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.itemText}>Due: {item.dueDate}</Text>
                <Text style={styles.itemText}>Category: {item.category}</Text>
                <Text style={styles.itemText}>Subcategory: {item.subCategory}</Text>
                <Text style={styles.itemText}>Auto-Pay: {item.isAutoPay ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => { 
                    setDeleteIndex(index); 
                    setModalVisible(true); 
                }}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.largeTitle}>Transactions</Text>
                
                <View style={styles.chartContainer}>
                    <CircularChart data={calculateCategoryTotals()} />
                </View>

                <View style={styles.formContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Expense Name" 
                        value={expenseName} 
                        onChangeText={setExpenseName}
                        placeholderTextColor="#666" 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Expense Amount" 
                        keyboardType="numeric" 
                        value={expenseAmount} 
                        onChangeText={setExpenseAmount}
                        placeholderTextColor="#666" 
                    />
                    
                    {renderPicker(
                        Object.keys(categories),
                        "Select Category",
                        category,
                        (itemValue) => {
                            setCategory(itemValue);
                            setSubCategory('');
                        }
                    )}

                    {renderPicker(
                        category ? categories[category] : [],
                        "Select Subcategory",
                        subCategory,
                        setSubCategory
                    )}

                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            {dueDate ? `Due Date: ${dueDate}` : 'Select Due Date'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Auto-Pay</Text>
                        <Switch 
                            value={isAutoPay} 
                            onValueChange={setIsAutoPay}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isAutoPay ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>
                    {/* NOTE -- The function(addExpense) that executes when the button is pressed */}
                    <TouchableOpacity style={styles.addButton} onPress={addExpense}>
                        <Text style={styles.addButtonText}>Add Expense</Text>
                    </TouchableOpacity>
                </View>

                {expenses.length > 0 && (
                    <View style={styles.expenseListContainer}>
                        <Text style={styles.sectionTitle}>Your Expenses</Text>
                        <FlatList
                            data={expenses}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderExpenseItem}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                )}
            </ScrollView>

            {showCalendar && (
                <Modal transparent={true} animationType="slide">
                    <View style={styles.calendarModal}>
                        <Calendar
                            onDayPress={(date) => {
                                setDueDate(date.dateString);
                                setShowCalendar(false);
                            }}
                            markedDates={dueDate ? { [dueDate]: { selected: true, selectedColor: 'blue' } } : {}}
                        />
                        <TouchableOpacity 
                            style={styles.closeCalendarButton}
                            onPress={() => setShowCalendar(false)}
                        >
                            <Text style={styles.closeCalendarButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}

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
                            <Pressable 
                                style={styles.modalButtonCancel} 
                                onPress={() => setModalVisible(false)}
                            >
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
        backgroundColor: '#036704',
    },
    scrollContainer: {
        padding: 20,
    },
    largeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    chartContainer: {
        height: 180,
        marginBottom: 13,
        backgroundColor: '#036704',
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 14,
        overflow: 'hidden',
    },
    pickerIOS: {
        height: 150,
        width: '100%',
    },
    pickerAndroid: {
        height: 50,
        width: '100%',
        color: '#000',
    },
    dateButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    dateButtonText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#025703',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    switchText: {
        color: '#fff',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#0056b3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    expenseListContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    item: {
        backgroundColor: '#025703',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemContent: {
        marginBottom: 10,
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    separator: {
        height: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButtonYes: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    modalButtonCancel: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    calendarModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        marginTop: 'auto',
    },
    closeCalendarButton: {
        backgroundColor: '#0056b3',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    closeCalendarButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BudgetScreen;