import { StatusBar } from 'expo-status-bar';
import {
    Text,
    View,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Modal,
} from 'react-native';
import { Link } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';

// Dummy data for demonstration
const dummyBills = [
    { id: '1', name: 'Electricity Bill', dueDate: '2024-10-10', status: 'upcoming' },
    { id: '2', name: 'Water Bill', dueDate: '2024-10-01', status: 'past-due' },
    { id: '3', name: 'Internet Bill', dueDate: '2024-10-15', status: 'upcoming' },
];

export default function App() {
    const [totalBudget, setTotalBudget] = useState('');
    const [spentAmount, setSpentAmount] = useState('');
    const [bills, setBills] = useState(dummyBills);
    const [addBillModalVisible, setAddBillModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);
    const [newBillName, setNewBillName] = useState('');
    const [newBillDate, setNewBillDate] = useState('');

    // Updated calculations with proper validation and rounding
    const remainingAmount = (() => {
        const total = parseFloat(totalBudget) || 0;
        const spent = parseFloat(spentAmount) || 0;
        return parseFloat((total - spent).toFixed(2));
    })();

    const budgetProgress = (() => {
        const total = parseFloat(totalBudget);
        const spent = parseFloat(spentAmount);
        if (!total || !spent || isNaN(total) || isNaN(spent)) return 0;
        return Math.min(Math.round((spent / total) * 100) / 100, 1);
    })();

    const handleTotalBudgetChange = (text) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            setTotalBudget(parts[0] + '.' + parts.slice(1).join(''));
        } else {
            setTotalBudget(cleaned);
        }
    };

    const handleSpentAmountChange = (text) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            setSpentAmount(parts[0] + '.' + parts.slice(1).join(''));
        } else {
            setSpentAmount(cleaned);
        }
    };

    const handleAddBill = () => {
        if (newBillName.trim() && newBillDate) {
            const today = new Date().toISOString().split('T')[0];
            const newBill = {
                id: String(Date.now()),
                name: newBillName.trim(),
                dueDate: newBillDate,
                status: newBillDate < today ? 'past-due' : 'upcoming',
            };
            setBills([...bills, newBill]);
            setNewBillName('');
            setNewBillDate('');
            setAddBillModalVisible(false);
        } else {
            alert('Please provide a valid name and date for the bill.');
        }
    };

    const confirmDeleteBill = (bill) => {
        setBillToDelete(bill);
        setDeleteModalVisible(true);
    };

    const handleDeleteBill = () => {
        if (billToDelete) {
            setBills(bills.filter((bill) => bill.id !== billToDelete.id));
            setBillToDelete(null);
            setDeleteModalVisible(false);
        }
    };

    const getBillIcon = (billName) => {
        const lowerName = billName.toLowerCase();
        if (lowerName.includes('electricity')) return 'lightbulb-on-outline';
        if (lowerName.includes('water')) return 'water';
        if (lowerName.includes('internet')) return 'wifi';
        if (lowerName.includes('rent')) return 'home';
        if (lowerName.includes('phone')) return 'cellphone';
        if (lowerName.includes('food')) return 'food';
        if (lowerName.includes('shopping')) return 'shopping';
        if (lowerName.includes('car')) return 'car';
        if (lowerName.includes('groceries')) return 'cart-outline';
        if (lowerName.includes('movies')) return 'movie-open-outline';
        if (lowerName.includes('subscription')) return 'file-multiple-outline';
        if (lowerName.includes('bus')) return 'bus';
        if (lowerName.includes('insurance')) return 'shield-check-outline';
        if (lowerName.includes('medical')) return 'hospital-box-outline';
        if (lowerName.includes('school')) return 'book-open-outline';
        if (lowerName.includes('restaurant')) return 'silverware-fork-knife';
        if (lowerName.includes('travel')) return 'airplane-takeoff';
        if (lowerName.includes('gym')) return 'dumbbell';
        if (lowerName.includes('pets')) return 'dog';
        if (lowerName.includes('gifts')) return 'gift-outline';
        if (lowerName.includes('savings')) return 'piggy-bank-outline';
        if (lowerName.includes('loan')) return 'bank-outline';
        return 'currency-usd'; // Default icon
    };

    const renderBillItem = ({ item }) => {
        const today = new Date().toISOString().split('T')[0];
        let statusText;
        let backgroundColor;

        if (item.dueDate < today) {
            statusText = `Past Due: ${item.dueDate}`;
            backgroundColor = '#ffeeee';
        } else if (item.dueDate === today) {
            statusText = `Due Today: ${item.dueDate}`;
            backgroundColor = '#fff7e6';
        } else {
            statusText = `Upcoming Due: ${item.dueDate}`;
            backgroundColor = '#e6ffe6';
        }

        return (
            <View style={[styles.billItem, { backgroundColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Icon
                        name={getBillIcon(item.name)}
                        size={20}
                        color={item.dueDate < today ? 'red' : '#036704'}
                        style={{ marginRight: 10 }}
                    />
                    <Text style={[styles.billText, { flex: 1 }]}>
                        {item.name} - {statusText}
                    </Text>
                    <TouchableOpacity onPress={() => confirmDeleteBill(item)}>
                        <Icon name="delete" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Welcome to Budget Buddy !!!</Text>
                <StatusBar style="auto" />

                <Link href={'/transaction'} asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkButtonText}>Head to Transactions</Text>
                    </TouchableOpacity>
                </Link>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Spending Budget</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Total Budget"
                        keyboardType="numeric"
                        value={totalBudget}
                        onChangeText={handleTotalBudgetChange}
                        placeholderTextColor="#666"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Amount Spent"
                        keyboardType="numeric"
                        value={spentAmount}
                        onChangeText={handleSpentAmountChange}
                        placeholderTextColor="#666"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <ProgressBar
                        progress={budgetProgress}
                        color={budgetProgress > 0.8 ? 'red' : '#036704'}
                        style={{ marginVertical: 10, height: 10, borderRadius: 5 }}
                    />

                    <Text style={[styles.budgetText, remainingAmount < 0 && styles.negativeAmount]}>
                        Amount Left: ${remainingAmount.toFixed(2)}
                    </Text>
                    <Text style={[styles.progressText, budgetProgress > 0.8 && styles.negativeAmount]}>
                        {Math.round(budgetProgress * 100)}% of your budget is spent
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Bill Reminders</Text>
                    <FlatList
                        data={bills}
                        renderItem={renderBillItem}
                        keyExtractor={(item) => item.id}
                        style={styles.billsList}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity
                        style={styles.quickActionButton}
                        onPress={() => setAddBillModalVisible(true)}
                    >
                        <Text style={styles.quickActionText}>Add New Bill</Text>
                    </TouchableOpacity>
                    <Link href="/budget" asChild>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Text style={styles.quickActionText}>View Full Budget</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <Modal visible={addBillModalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Bill</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Bill Name"
                                value={newBillName}
                                onChangeText={setNewBillName}
                            />
                            <Calendar
                                style={styles.calendar}
                                onDayPress={(day) => setNewBillDate(day.dateString)}
                                markedDates={{
                                    [newBillDate]: { selected: true, marked: true, selectedColor: '#036704' }
                                }}
                            />
                            <TouchableOpacity style={styles.modalButton} onPress={handleAddBill}>
                                <Text style={styles.modalButtonText}>Add Bill</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonSecondary}
                                onPress={() => setAddBillModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={deleteModalVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Are you sure you want to delete this bill reminder?</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={handleDeleteBill}>
                                <Text style={styles.modalButtonText}>Yes, Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonSecondary}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#036704',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#036704',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    budgetText: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '600',
        color: '#036704',
    },
    progressText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#036704',
    },
    negativeAmount: {
        color: 'red',
    },
    billsList: {
        width: '100%',
    },
    billItem: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#036704',
    },
    billText: {
        fontSize: 16,
        color: '#333',
    },
    linkButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginBottom: 20,
        minWidth: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    linkButtonText: {
        color: '#036704',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    quickActionButton: {
        backgroundColor: '#036704',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    quickActionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#036704',
    },
    calendar: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#036704',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
        width: '80%',
    },
    modalButtonSecondary: {
        backgroundColor: '#036704',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    modalButton: {
        backgroundColor: '#036704',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
        width: '80%',
    },
    modalButtonSecondary: {
        backgroundColor: '#036704',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
