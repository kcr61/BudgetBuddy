import { StatusBar } from 'expo-status-bar';
import { 
    Text, 
    View, 
    TextInput, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard 
} from 'react-native';
import { Link } from 'expo-router';
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Budget Buddy !!!</Text>
                <StatusBar style="auto" />
                
                <Link href={'/transaction'} asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkButtonText}>Head to Transactions</Text>
                    </TouchableOpacity>
                </Link>

                {/* Spending Budget Section */}
                <View style={styles.budgetContainer}>
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
                    <Text style={[styles.budgetText, remainingAmount < 0 && styles.negativeAmount]}>
                        Amount Left: ${remainingAmount.toFixed(2)}
                    </Text>
                </View>

                {/* Bill Reminders Section */}
                <View style={styles.billsContainer}>
                    <Text style={styles.sectionTitle}>Bill Reminders</Text>
                    <FlatList
                        data={bills}
                        renderItem={renderBillItem}
                        keyExtractor={(item) => item.id}
                        style={styles.billsList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#036704',
        padding: 20,
        paddingTop: 60, // Add padding for status bar
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    linkButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginBottom: 20,
        minWidth: 160,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
    budgetContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        fontSize: 16,
    },
    budgetText: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '600',
        color: '#036704',
    },
    negativeAmount: {
        color: 'red',
    },
    billsContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
    pastDue: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 5,
    },
});