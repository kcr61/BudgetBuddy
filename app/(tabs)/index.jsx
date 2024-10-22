import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';


// Dummy data for demonstration
const dummyBills = [
    { id: '1', name: 'Electricity Bill', dueDate: '2024-10-10', status: 'upcoming' },
    { id: '2', name: 'Water Bill', dueDate: '2024-10-01', status: 'past-due' },
    { id: '3', name: 'Internet Bill', dueDate: '2024-10-15', status: 'upcoming' },
    { id: '5', name: 'Rent', dueDate: '2024-10-20', status: 'upcoming' },
];

export default function App() {
    const [totalBudget, setTotalBudget] = useState('');
    const [spentAmount, setSpentAmount] = useState('');
    const [bills, setBills] = useState(dummyBills);

    // Calculate remaining amount
    const remainingAmount = (parseFloat(totalBudget) || 0) - (parseFloat(spentAmount) || 0);

    const handleTotalBudgetChange = (text) => {
        setTotalBudget(text);
    };

    const handleSpentAmountChange = (text) => {
        setSpentAmount(text);
    };

    const renderBillItem = ({ item }) => (
        <View style={styles.billItem}>
            <Text style={styles.billText}>{item.name} - Due: {item.dueDate}</Text>
            {item.status === 'past-due' && <Text style={styles.pastDue}>Past Due</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Budget Buddy !!!</Text>
            <StatusBar style="auto" />
            <Link href={'/transaction'} style={styles.link}>Head to Transaction</Link>

            {/* Spending Budget Section */}
            <View style={styles.budgetContainer}>
                <Text style={styles.sectionTitle}>Spending Budget</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Total Budget"
                    keyboardType="numeric"
                    value={totalBudget}
                    onChangeText={handleTotalBudgetChange}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Amount Spent"
                    keyboardType="numeric"
                    value={spentAmount}
                    onChangeText={handleSpentAmountChange}
                />
                <Text style={styles.budgetText}>Amount Left: ${remainingAmount.toFixed(2)}</Text>
            </View>

            {/* Bill Reminders Section */}
            <View style={styles.billsContainer}>
                <Text style={styles.sectionTitle}>Bill Reminders</Text>
                <FlatList
                    data={bills}
                    renderItem={renderBillItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#036704',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    link: {
        color: 'black',
        marginBottom: 20,
    },
    budgetContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    budgetText: {
        fontSize: 16,
        marginBottom: 5,
    },
    billsContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    billItem: {
        marginBottom: 10,
    },
    billText: {
        fontSize: 16,
    },
    pastDue: {
        color: 'red',
        fontWeight: 'bold',
    },
});