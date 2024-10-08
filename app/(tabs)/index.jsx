import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';

// Dummy data for demonstration
const dummyBudget = {
    total: 1000,
    spent: 450,
};

const dummyBills = [
    { id: '1', name: 'Electricity Bill', dueDate: '2024-10-10', status: 'upcoming' },
    { id: '2', name: 'Water Bill', dueDate: '2024-10-01', status: 'past-due' },
];

export default function App() {
    const [budget, setBudget] = useState(dummyBudget);
    const [bills, setBills] = useState(dummyBills);

    // Fetch budget and bills data from API or local storage
    useEffect(() => {
        // Fetch budget and bills data here
    }, []);

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
                <Text style={styles.budgetText}>Total Budget: ${budget.total}</Text>
                <Text style={styles.budgetText}>Amount Spent: ${budget.spent}</Text>
                <Text style={styles.budgetText}>Amount Left: ${budget.total - budget.spent}</Text>
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

const styles = {
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
};